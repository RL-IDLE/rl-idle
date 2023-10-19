import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWsEvent } from 'src/types/api';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Decimal from 'break_infinity.js';
import { getOneData, saveOneData } from 'src/lib/storage';
import { buyItemSchema, clickSchema } from 'src/types/events';
import {
  getPriceForClickItem,
  getPriceOfItem,
  getUserBalance,
} from 'src/lib/game';
import { Item, ItemBought } from '../items/entities/item.entity';
import { randomUUID } from 'crypto';
import { Server } from 'socket.io';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(ItemBought)
    private readonly itemsBoughtRepository: Repository<ItemBought>,
  ) {}

  async click(data: IWsEvent['click']['body']) {
    const parsedData = await clickSchema.parseAsync(data);
    const user = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: parsedData.userId,
    });
    if (!user) throw new HttpException('User not found', 404);
    const moneyFromClick = Decimal.fromString(user.moneyFromClick);
    const moneyPerClick = Decimal.fromString(user.moneyPerClick);
    const newMoneyFromClick = moneyFromClick.add(moneyPerClick);
    user.moneyFromClick = newMoneyFromClick.toString();
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
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
    const alreadyBought = await this.itemsBoughtRepository
      .createQueryBuilder('itemBought')
      .where('itemBought.item = :itemId', { itemId: item.id })
      .andWhere('itemBought.user = :userId', { userId: user.id })
      .getCount();

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
}
