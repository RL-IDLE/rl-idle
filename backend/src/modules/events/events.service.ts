import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWsEvent } from 'src/types/api';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Decimal from 'break_infinity.js';
import { getOneData, saveOneData } from 'src/lib/storage';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async click(data: IWsEvent['click']['body']) {
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: data.userId,
    });
    if (!user) throw new HttpException('User not found', 404);
    const money = Decimal.fromString(user.money);
    const moneyPerClick = Decimal.fromString(user.moneyPerClick);
    const newMoney = money.add(moneyPerClick);
    user.money = newMoney.toString();
    await saveOneData({ key: 'users', id: data.userId, data: user });
    return user;
  }
}
