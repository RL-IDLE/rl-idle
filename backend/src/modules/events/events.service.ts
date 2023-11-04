import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWsEvent } from 'src/types/api';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Decimal from 'break_infinity.js';
import { getOneData, saveOneData } from 'src/lib/storage';
import {
  buyItemSchema,
  buyPrestigeSchema,
  clickSchema,
} from 'src/types/events';
import {
  getPriceForClickItem,
  getPriceOfItem,
  getUserBalance,
  getUserMoneyPerClick,
} from 'src/lib/game';
import { Item, ItemBought } from '../items/entities/item.entity';
import { randomUUID } from 'crypto';
import { Server } from 'socket.io';
import { redis } from 'src/lib/redis';
import {
  Prestige,
  PrestigeBought,
} from '../prestiges/entities/prestige.entity';
import { logger } from 'src/lib/logger';
import { objectDepth } from 'src/lib/utils';
import { maxDiffTimeUserSpec } from 'src/lib/constant';

@Injectable()
export class EventsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(ItemBought)
    private readonly itemsBoughtRepository: Repository<ItemBought>,
    @InjectRepository(Prestige)
    private readonly prestigeRepository: Repository<Prestige>,
    @InjectRepository(PrestigeBought)
    private readonly prestigeBoughtRepository: Repository<PrestigeBought>,
  ) {}

  async click(data: IWsEvent['click']['body'], server: Server) {
    const parsedData = await clickSchema.parseAsync(data).catch((err) => {
      server.emit(`error:${data.userId}`, err.message);
      return;
    });
    if (!parsedData) return;
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 400);
    const clicks = await redis.get(`clicks:${user.id}`);
    const maxPerSecond = 20;
    if (
      clicks &&
      parseInt(clicks) + parseInt(parsedData.times) >= maxPerSecond * 30
    ) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'You have reached the limit of clicks');
      return;
    }
    const moneyFromClick = Decimal.fromString(user.moneyFromClick);
    const moneyPerClick = getUserMoneyPerClick(user);
    const newMoneyFromClick = moneyFromClick.add(
      moneyPerClick.times(Decimal.fromString(parsedData.times)),
    );
    user.moneyFromClick = newMoneyFromClick.toString();
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    //? Add a click to the redis click counter
    await redis.increx(`clicks:${user.id}`, 30, 1);
    return user;
  }

  async buyItem(data: IWsEvent['buyItem']['body'], server: Server) {
    const parsedData = await buyItemSchema.parseAsync(data).catch((err) => {
      server.emit(`error:${data.userId}`, err.message);
      return;
    });
    if (!parsedData) return;
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 400);
    const item = await getOneData({
      databaseRepository: this.itemsRepository,
      key: 'items',
      id: parsedData.itemId,
      options: { noSync: true },
    });
    if (!item) throw new HttpException('Item not found', 400);
    const userBalance = getUserBalance(user);
    // const alreadyBought = await this.itemsBoughtRepository
    //   .createQueryBuilder('itemBought')
    //   .where('itemBought.item = :itemId', { itemId: item.id })
    //   .andWhere('itemBought.user = :userId', { userId: user.id })
    //   .getCount();
    const alreadyBought = user.itemsBought.filter(
      (itemBought) => itemBought.item.id === item.id,
    ).length;

    const itemPrice =
      item.name === 'Click'
        ? getPriceForClickItem(
            Decimal.fromString(item.price),
            Decimal.fromNumber(alreadyBought),
          )
        : getPriceOfItem(
            Decimal.fromString(item.price),
            Decimal.fromNumber(alreadyBought),
          );
    if (userBalance.lt(itemPrice)) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'Not enough money');
      logger.warn(
        `User ${user.id} tried to buy item ${
          item.name
        } but didn't have enough money (${userBalance.toString()} < ${itemPrice.toString()})`,
      );
      return;
    }

    //* Mutate
    //? Is click boost
    if (item.name === 'Click') {
      //? Update user moneyPerClick
      const userMoneyPerClick = Decimal.fromString(user.moneyPerClick);
      const newUserMoneyPerClick = userMoneyPerClick.times(
        Decimal.fromString(item.moneyPerClickMult),
      );
      user.moneyPerClick = newUserMoneyPerClick.toString();
    }
    const now = new Date();
    let createdAt = new Date(data.createdAt);
    //? If the difference between now and the user spec is too big, we use now
    if (
      now.getTime() - new Date(data.createdAt).getTime() >
      maxDiffTimeUserSpec
    ) {
      createdAt = now;
    }
    const userMoneyUsed = Decimal.fromString(user.moneyUsed);
    const newUserMoneyUsed = userMoneyUsed.add(itemPrice);
    user.moneyUsed = newUserMoneyUsed.toString();
    const itemBought: Omit<ItemBought, 'user'> & { user: { id: string } } = {
      id: randomUUID(),
      item: item,
      user: {
        id: user.id,
      },
      createdAt: createdAt,
      updatedAt: createdAt,
      deletedAt: null as unknown as Date,
    };
    // await saveOneData({
    //   key: 'itemsBought',
    //   data: itemBought,
    //   id: itemBought.id,
    // });
    user.itemsBought.push({
      ...itemBought,
      user: { id: user.id } as unknown as User,
    });
    await saveOneData({
      key: 'users',
      id: parsedData.userId,
      data: user,
    });
    return user;
  }

  async buyPrestige(data: IWsEvent['buyPrestige']['body'], server: Server) {
    const parsedData = await buyPrestigeSchema.parseAsync(data).catch((err) => {
      server.emit(`error:${data.userId}`, err.message);
      return;
    });
    if (!parsedData) return;
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 400);
    const prestige = await getOneData({
      databaseRepository: this.prestigeRepository,
      key: 'prestige',
      id: parsedData.prestigeId,
      options: { noSync: true },
    });
    if (!prestige) throw new HttpException('Prestige not found', 400);
    const userBalance = getUserBalance(user);

    if (userBalance.lt(prestige.price)) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'Not enough money to prestige');
      return;
    }

    //? Check if user has already bought this prestige
    const alreadyBought = user.prestigesBought.filter(
      (prestigeBought) => prestigeBought.prestige.id === prestige.id,
    ).length;
    if (alreadyBought > 0) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'You have already bought this prestige');
      return;
    }

    //? Check that this prestige is the next one
    const prestigeSorted = user.prestigesBought.sort((a, b) =>
      Decimal.fromString(a.prestige.moneyMult).cmp(
        Decimal.fromString(b.prestige.moneyMult),
      ),
    );
    const lastPrestigeBought =
      prestigeSorted.length > 0
        ? prestigeSorted[prestigeSorted.length - 1]
        : null;
    const prestiges = await this.prestigeRepository.find();
    const prestigesOrdered = prestiges.sort((a, b) =>
      Decimal.fromString(a.moneyMult).cmp(Decimal.fromString(b.moneyMult)),
    );
    const nextPrestige = prestigesOrdered[
      prestigesOrdered.reduce((acc, prestige, i) => {
        if (prestige.id === lastPrestigeBought?.prestige.id) return i;
        return acc;
      }, -1) + 1
    ] as Prestige | null;
    if (nextPrestige?.id !== prestige.id) {
      //? Emit the exception for the correspondig user
      server.emit(
        `error:${user.id}`,
        'You have to buy the previous prestige first',
      );
      return;
    }

    //* Mutate
    user.moneyUsed = '0';
    const prestigeBought: PrestigeBought = {
      id: randomUUID(),
      prestige: prestige,
      user: objectDepth(user),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };
    // await saveOneData({
    //   key: 'prestigesBought',
    //   data: prestigeBought,
    //   id: prestige.id,
    // });
    user.prestigesBought.push({
      ...prestigeBought,
      user: undefined as unknown as User,
    });
    //? Reset user money/items
    user.moneyFromClick = '0';
    user.moneyPerClick = '1';
    user.itemsBought = [];
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    return user;
  }

  async livelinessProbe(data: IWsEvent['livelinessProbe']['body']) {
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: data.userId,
    });
    if (!user) throw new HttpException('User not found', 400);
    //? Update user lastSeen
    user.lastSeen = new Date();
    await saveOneData({ key: 'users', id: data.userId, data: user });

    return data;
  }
}
