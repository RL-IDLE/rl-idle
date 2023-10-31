import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { api } from 'src/types/api';
import { getOneData, saveOneData } from 'src/lib/storage';
import { maxPassiveIncomeInterval } from 'src/lib/constant';
import { getUserBalance } from 'src/lib/game';
import Decimal from 'break_infinity.js';
import { logger } from 'src/lib/logger';
import { getTimeBetween } from 'src/lib/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    if (!dbUser) throw new HttpException('User not found', 404);
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
    if (!dbUser) throw new HttpException('User not found', 404);
    const user = dbUser;
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
}
