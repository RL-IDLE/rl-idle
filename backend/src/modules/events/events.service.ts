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
    const parsedData = await clickSchema.parseAsync(data);
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 404);
    const clicks = await redis.get(`clicks:${user.id}`);
    const maxPerSecond = 20;
    if (clicks && parseInt(clicks) >= maxPerSecond * 30) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'You have reached the limit of clicks');
      return;
    }
    const moneyFromClick = Decimal.fromString(user.moneyFromClick);
    const moneyPerClick = getUserMoneyPerClick(user);
    const newMoneyFromClick = moneyFromClick.add(moneyPerClick);
    user.moneyFromClick = newMoneyFromClick.toString();
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    //? Add a click to the redis click counter
    if (!clicks) await redis.setex(`clicks:${user.id}`, 30, 1);
    else await redis.incr(`clicks:${user.id}`);
    return user;
  }

  async buyItem(data: IWsEvent['buyItem']['body'], server: Server) {
    const parsedData = await buyItemSchema.parseAsync(data);
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 404);
    const item = await getOneData({
      databaseRepository: this.itemsRepository,
      key: 'items',
      id: parsedData.itemId,
      options: { noSync: true },
    });
    if (!item) throw new HttpException('Item not found', 404);
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

    //* Is click boost
    if (item.name === 'Click') {
      //? Update user moneyPerClick
      const userMoneyPerClick = Decimal.fromString(user.moneyPerClick);
      const newUserMoneyPerClick = userMoneyPerClick.times(
        Decimal.fromString(item.moneyPerClickMult),
      );
      user.moneyPerClick = newUserMoneyPerClick.toString();
    }

    //* Mutate
    const userMoneyUsed = Decimal.fromString(user.moneyUsed);
    const newUserMoneyUsed = userMoneyUsed.add(itemPrice);
    user.moneyUsed = newUserMoneyUsed.toString();
    const itemBought: ItemBought = {
      id: randomUUID(),
      item: item,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };
    await saveOneData({
      key: 'itemsBought',
      data: itemBought,
      id: itemBought.id,
    });
    user.itemsBought.push({
      ...itemBought,
      user: undefined as unknown as User,
    });
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    return user;
  }

  async buyPrestige(data: IWsEvent['buyPrestige']['body'], server: Server) {
    const parsedData = await buyPrestigeSchema.parseAsync(data);
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 404);
    const prestige = await getOneData({
      databaseRepository: this.prestigeRepository,
      key: 'prestige',
      id: parsedData.prestigeId,
      options: { noSync: true },
    });
    if (!prestige) throw new HttpException('Prestige not found', 404);
    const userBalance = getUserBalance(user);

    if (userBalance.lt(prestige.price)) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'Not enough money to prestige');
      return;
    }

    //* Mutate
    const userMoneyUsed = Decimal.fromString(user.moneyUsed);
    const newUserMoneyUsed = userMoneyUsed.add(prestige.id);
    user.moneyUsed = newUserMoneyUsed.toString();
    const prestigeBought: PrestigeBought = {
      id: randomUUID(),
      prestige: prestige,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };
    await saveOneData({
      key: 'prestigesBought',
      data: prestigeBought,
      id: prestige.id,
    });
    user.prestigesBought.push({
      ...prestigeBought,
      user: undefined as unknown as User,
    });
    //? Reset user money/items
    user.moneyFromClick = '0';
    user.moneyPerClick = '1';
    user.moneyUsed = '0';
    user.itemsBought = [];
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    return user;
  }
}
