import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWsEvent } from 'src/types/api';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Decimal from 'break_infinity.js';
import { getOneData, saveOneData } from 'src/lib/storage';
import { buyItemSchema, clickSchema } from 'src/types/events';
import { getUserBalance } from 'src/lib/game';
import { Item, ItemBought } from '../items/entities/item.entity';

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

  async buyItem(data: IWsEvent['buyItem']['body']) {
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
    const itemPrice = Decimal.fromString(item.price);
    if (userBalance.lt(itemPrice)) {
      throw new HttpException('Not enough money', 400);
    }
    //* Mutate
    const userMoneyUsed = Decimal.fromString(user.moneyUsed);
    const newUserMoneyUsed = userMoneyUsed.add(itemPrice);
    user.moneyUsed = newUserMoneyUsed.toString();
    const itemBought = await this.itemsBoughtRepository.save({
      item,
      user,
    });
    user.itemsBought.push({
      ...itemBought,
      user: undefined as unknown as User,
    });
    await saveOneData({ key: 'users', id: parsedData.userId, data: user });
    return user;
  }
}
