import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWsEvent } from 'src/types/api';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Decimal from 'break_infinity.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async click(data: IWsEvent['click']['body']) {
    const user = await this.usersRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) throw new HttpException('User not found', 404);
    //TODO Save in redis instead
    const money = Decimal.fromString(user.money);
    const moneyPerClick = Decimal.fromString(user.moneyPerClick);
    const newMoney = money.add(moneyPerClick);
    user.money = newMoney.toString();
    await this.usersRepository.save(user);
    return user;
  }
}
