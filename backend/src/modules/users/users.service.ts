import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { api } from 'src/types/api';
import { getOneData, redisNamespace, saveOneData } from 'src/lib/storage';
import { maxPassiveIncomeInterval, priceToEmerald } from 'src/lib/constant';
import { getUserBalance } from 'src/lib/game';
import Decimal from 'break_infinity.js';
import { logger } from 'src/lib/logger';
import { getTimeBetween, objectDepth } from 'src/lib/utils';
import {
  Prestige,
  PrestigeBought,
} from '../prestiges/entities/prestige.entity';
import { Item, ItemBought } from '../items/entities/item.entity';
import { randomUUID } from 'crypto';
import { bcryptCompare, hash } from 'src/lib/bcrypt';
import { redis } from 'src/lib/redis';
import { IConfirmPayment } from 'src/types/user';
import { Payment } from '../payments/entities/payment.entity';
import { stripe } from 'src/lib/stripe';

@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Prestige)
    private readonly prestigeRepository: Repository<Prestige>,
    @InjectRepository(PrestigeBought)
    private readonly prestigeBoughtRepository: Repository<PrestigeBought>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemBought)
    private readonly itemBoughtRepository: Repository<ItemBought>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async load(
    loadUser: typeof api.user.load.body,
  ): Promise<typeof api.user.load.response> {
    // await sleep(10000);

    const curDate = new Date();

    //? If no user id is set, create a new user
    let userId: string | undefined;
    if (!('id' in loadUser)) {
      const newUser = await this.usersRepository.save({});
      userId = newUser.id;
    }
    //? Otherwise, load the user
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: 'id' in loadUser ? loadUser.id : (userId as string),
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;

    //* Max passive income
    //? Get the time difference between the last time the user was seen and now
    const lastSeen = new Date(user.lastSeen as unknown as string);
    const timeDiff = Math.abs(curDate.getTime() - lastSeen.getTime());
    let overflow: null | Decimal = null;
    if (timeDiff > maxPassiveIncomeInterval) {
      const endOfInterval = new Date(
        lastSeen.getTime() + maxPassiveIncomeInterval,
      );
      const userBalance = getUserBalance(user);
      const userBalanceWithMaxPassiveIncome = getUserBalance(
        user,
        endOfInterval,
      );
      overflow = userBalance.minus(userBalanceWithMaxPassiveIncome);
      user.moneyUsed = Decimal.fromString(user.moneyUsed)
        .plus(overflow)
        .toString();
    }
    if (timeDiff > 1000 * 60) {
      logger.debug(
        `User ${user.id} was inactive for ${getTimeBetween(
          lastSeen,
          curDate,
        )}. ${
          overflow?.gt(0)
            ? overflow.toString() +
              ` overflowed (${getTimeBetween(
                new Date(timeDiff),
                new Date(maxPassiveIncomeInterval),
              )})`
            : ''
        }`,
      );
    }
    await saveOneData({
      key: 'users',
      id: user.id,
      data: { ...user, lastSeen: curDate },
    });

    return user;
  }

  async reset(
    resetUser: typeof api.user.reset.body,
  ): Promise<typeof api.user.reset.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: resetUser.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    //? Delete all redis keys
    const keys = await redis.keys(`${redisNamespace}:*`);
    if (keys.length) {
      await redis.del(keys);
    }
    user.moneyFromClick = '0';
    user.moneyPerClick = '1';
    user.moneyUsed = '0';
    user.itemsBought = [];
    user.prestigesBought = [];
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async give(
    give: typeof api.user.give.body,
  ): Promise<typeof api.user.give.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: give.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    user.moneyFromClick = Decimal.fromString(user.moneyFromClick)
      .add(give.amount)
      .toString();
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async remove(
    remove: typeof api.user.remove.body,
  ): Promise<typeof api.user.remove.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: remove.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    user.moneyUsed = Decimal.fromString(user.moneyUsed)
      .sub(remove.amount)
      .toString();
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async givePrestige(
    givePrestige: typeof api.user.givePrestige.body,
  ): Promise<typeof api.user.givePrestige.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: givePrestige.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    //* Next prestige
    const prestiges = await this.prestigeRepository.find();
    const lastestUserPrestige = user.prestigesBought.reduce<Prestige | null>(
      (acc, prestigeBought) => {
        if (acc === null) return prestigeBought.prestige;
        if (
          Decimal.fromString(acc.moneyMult).gt(
            Decimal.fromString(prestigeBought.prestige.moneyMult),
          )
        )
          return acc;
        return prestigeBought.prestige;
      },
      null,
    );
    const nextPrestige = prestiges
      .sort((a, b) =>
        Decimal.fromString(a.moneyMult).gt(Decimal.fromString(b.moneyMult))
          ? 1
          : -1,
      )
      .find((prestige) =>
        lastestUserPrestige
          ? Decimal.fromString(prestige.moneyMult).gt(
              Decimal.fromString(lastestUserPrestige.moneyMult),
            )
          : true,
      );
    if (!nextPrestige) throw new HttpException('No next prestige found', 400);
    //* Give prestige
    user.moneyUsed = '0';
    const prestigeBought: Omit<PrestigeBought, 'user'> & {
      user: { id: string };
    } = {
      id: randomUUID(),
      prestige: nextPrestige,
      user: {
        id: user.id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };
    // await saveOneData({
    //   key: 'prestigesBought',
    //   data: prestigeBought,
    //   id: nextPrestige.id,
    // });
    user.prestigesBought.push({
      ...prestigeBought,
      user: objectDepth(user),
    });
    //? Reset user money/items
    user.moneyFromClick = '0';
    user.moneyPerClick = '1';
    user.itemsBought = [];

    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async removePrestige(
    removePrestige: typeof api.user.removePrestige.body,
  ): Promise<typeof api.user.removePrestige.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: removePrestige.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    //* Find the highest prestige
    const highestPrestige = user.prestigesBought.reduce<Prestige | null>(
      (acc, prestigeBought) => {
        if (acc === null) return prestigeBought.prestige;
        if (
          Decimal.fromString(acc.moneyMult).gt(
            Decimal.fromString(prestigeBought.prestige.moneyMult),
          )
        )
          return acc;
        return prestigeBought.prestige;
      },
      null,
    );
    if (!highestPrestige) throw new HttpException('No prestige found', 400);
    //* Remove prestige
    user.prestigesBought = user.prestigesBought.filter(
      (prestigeBought) => prestigeBought.prestige.id !== highestPrestige.id,
    );
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async giveItem(
    giveItem: typeof api.user.giveItem.body,
  ): Promise<typeof api.user.giveItem.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: giveItem.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    const item = await getOneData({
      databaseRepository: this.itemRepository,
      key: 'items',
      id: giveItem.itemId,
      options: { noSync: true },
    });
    if (!item) throw new HttpException('Item not found', 400);
    //? Is click boost
    if (item.name === 'Click') {
      //? Update user moneyPerClick
      const userMoneyPerClick = Decimal.fromString(user.moneyPerClick);
      const newUserMoneyPerClick = userMoneyPerClick.times(
        Decimal.fromString(item.moneyPerClickMult),
      );
      user.moneyPerClick = newUserMoneyPerClick.toString();
    }
    const itemBought: ItemBought = {
      id: randomUUID(),
      item: item,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };
    // await saveOneData({
    //   key: 'itemsBought',
    //   data: itemBought,
    //   id: itemBought.id,
    // });
    user.itemsBought.push({
      ...itemBought,
      user: objectDepth(user),
    });
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async removeItem(
    removeItem: typeof api.user.removeItem.body,
  ): Promise<typeof api.user.removeItem.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: removeItem.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;
    const item = await getOneData({
      databaseRepository: this.itemRepository,
      key: 'items',
      id: removeItem.itemId,
      options: { noSync: true },
    });
    if (!item) throw new HttpException('Item not found', 400);
    user.itemsBought = user.itemsBought.filter(
      (itemBought) => itemBought.item.id !== item.id,
    );
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }

  async updateUser(user: User) {
    const password = hash(user.password, 10);

    if (!user.password || !user.username)
      throw new HttpException('Missing password or username', 400);

    await saveOneData({
      key: 'users',
      id: user.id,
      data: {
        password: password,
        username: user.username,
      },
    });
    return user;
  }

  async signIn(user: User) {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: user.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);

    if (user.username !== dbUser.username)
      throw new HttpException('Wrong username', 400);
    if (!(await bcryptCompare(user.password, dbUser.password)))
      throw new HttpException('Wrong password', 400);
    return user;
  }

  async confirmPayment(payment: IConfirmPayment) {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: payment.id,
    });
    if (!dbUser) throw new HttpException('User not found', 400);
    const user = dbUser;

    //* Get the payment checkout
    const checkoutId = payment.checkoutSessionId;
    const exists = await this.paymentRepository.findOne({
      where: {
        id: checkoutId,
      },
    });
    if (exists) {
      throw new HttpException('Payment already registered', 400);
    }
    const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
    if (!checkout.amount_total) {
      throw 'Amount not found on checkout';
    }
    const emeralds = priceToEmerald(checkout.amount_total);

    //* Save the payment checkout
    await this.paymentRepository.save({
      id: checkout.id,
      user: {
        id: user.id,
      },
    });

    //* Save the emeralds
    user.emeralds = Decimal.fromString(user.emeralds).add(emeralds).toString();
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });

    logger.info(
      `User ${user.id} bought ${emeralds} emeralds for ${checkout.amount_total} cents`,
    );

    return { emeralds };
  }
}
