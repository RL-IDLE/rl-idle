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
  getMoneyFromInvestmentsPerSeconds,
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
import {
  fullBoostMultiplier,
  maxClickPerSecond,
  maxDiffTimeUserSpec,
  maxPassiveIncomeInterval,
  timewarpBoost,
  upgradeBoost,
} from 'src/lib/constant';

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
    if (!parsedData) return { success: false };
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 400);
    const clicks = await redis.get(`clicks:${user.id}`);
    const maxPerSecond = maxClickPerSecond;
    const maxMultiplier = fullBoostMultiplier; //? x5 per click, max front-end mult
    const timeBuffer = 30;
    if (
      clicks &&
      parseInt(clicks) + parseInt(parsedData.times) >=
        maxPerSecond * maxMultiplier * timeBuffer
    ) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'You have reached the limit of clicks');
      return { success: false };
    }
    const moneyFromClick = Decimal.fromString(user.moneyFromClick);
    const moneyPerClick = getUserMoneyPerClick(user);
    const newMoneyFromClick = moneyFromClick.add(
      moneyPerClick.times(parsedData.times),
    );
    user.moneyFromClick = newMoneyFromClick.toString();
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    //? Add a click to the redis click counter
    await redis.increx(
      `clicks:${user.id}`,
      timeBuffer,
      parseInt(parsedData.times),
    );
    return { success: true };
  }

  async buyItem(data: IWsEvent['buyItem']['body'], server: Server) {
    const parsedData = await buyItemSchema.parseAsync(data).catch((err) => {
      server.emit(`error:${data.userId}`, err.message);
      return;
    });
    if (!parsedData) return { success: false };
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
      return { success: false };
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
    return { success: true };
  }

  async buyPrestige(data: IWsEvent['buyPrestige']['body'], server: Server) {
    const parsedData = await buyPrestigeSchema.parseAsync(data).catch((err) => {
      server.emit(`error:${data.userId}`, err.message);
      return;
    });
    if (!parsedData) return { success: false };
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
      return { success: false };
    }

    //? Check if user has already bought this prestige
    const alreadyBought = user.prestigesBought.filter(
      (prestigeBought) => prestigeBought.prestige.id === prestige.id,
    ).length;
    if (alreadyBought > 0) {
      //? Emit the exception for the correspondig user
      server.emit(`error:${user.id}`, 'You have already bought this prestige');
      return { success: false };
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
      return { success: false };
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
    user.latestBalance = '0';
    user.itemsBought = [];
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    return { success: true };
  }

  async addTokenBonus(data: IWsEvent['addTokenBonus']['body'], server: Server) {
    const exist = await redis.get(`bonus:money:${data.id}`);
    if (!exist) {
      server.emit(`error:${data.id}`, "This bonus does'nt exists");
      logger.warn(
        `User ${data.userId} tried to buy item retrieve a non existing bonus (id: ${data.id})`,
      );
      return { success: false };
    }

    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: data.userId,
    });
    if (!user) throw new HttpException('User not found', 400);

    const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);
    const { moneyPerClick } = user;
    const value = moneyPerSecond
      .add(Decimal.fromString(moneyPerClick).mul('5'))
      .mul('20');

    user.moneyFromClick = Decimal.fromString(user.moneyFromClick)
      .add(value)
      .toString();

    await saveOneData({ key: 'users', id: data.userId, data: user });
    return { success: true };
  }

  async addEmeraldBonus(
    data: IWsEvent['addEmeraldBonus']['body'],
    server: Server,
  ) {
    const bonus = await redis.get(`bonus:emerald:${data.id}`);
    if (!bonus) {
      server.emit(`error:${data.userId}`, "This bonus does'nt exists");
      logger.warn(
        `User ${data.userId} tried to buy item retrieve a non existing bonus (id: ${data.id})`,
      );
      return { success: false };
    }

    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: data.userId,
    });
    if (!user) throw new HttpException('User not found', 400);

    user.emeralds = Decimal.fromString(user.emeralds).add(bonus).toString();

    await saveOneData({ key: 'users', id: data.userId, data: user });
    return { success: true };
  }

  async buyBonus(data: IWsEvent['buyBonus']['body'], server: Server) {
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: data.userId,
    });
    if (!user) throw new HttpException('User not found', 400);

    const item = timewarpBoost.find((item) => item.id === data.id);
    if (!item) {
      const boostItem = upgradeBoost.find((item) => item.id === data.id);
      if (!boostItem) {
        server.emit(`error:${data.userId}`, "This bonus does'nt exists");
        logger.warn(
          `User ${data.userId} tried to buy item retrieve a non existing bonus (id: ${data.id})`,
        );
        return { success: false };
      }
      if (Decimal.fromString(user.emeralds).lt(boostItem.price)) {
        server.emit(`error:${data.userId}`, "You don't have enought money");
        return { success: false };
      }
      if (boostItem.id === '3') {
        //? Afk time permanent boost
        user.maxPassiveIncomeInterval =
          (user.maxPassiveIncomeInterval || maxPassiveIncomeInterval) +
          (boostItem.afkTime ?? 0) * 1000 * 60 * 60;
        user.emeralds = Decimal.fromString(user.emeralds)
          .minus(boostItem.price)
          .toString();
      } else {
      }
    } else {
      const timewarpItem = item;
      if (Decimal.fromString(user.emeralds).lt(timewarpItem.price)) {
        server.emit(`error:${data.userId}`, "You don't have enought money");
        return { success: false };
      }
    }

    await saveOneData({ key: 'users', id: data.userId, data: user });
    return { success: true };
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
    user.passiveNotificationSent = false;
    const uBalance = getUserBalance(user);
    user.latestBalance = uBalance.toString();
    user.latestBalanceExponent = uBalance.exponent.toString();
    user.latestBalanceMantissa = uBalance.mantissa.toString();
    await saveOneData({ key: 'users', id: data.userId, data: user });

    return data;
  }
}
