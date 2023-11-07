import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { api } from 'src/types/api';
import Decimal from 'break_infinity.js';
import memoizeOne from 'memoize-one';

const sortItems = (items: Item[]) => {
  const sorted = items.sort((a, b) => {
    if (a.name === 'Click') return -1;
    if (b.name === 'Click') return 1;
    // Sort by price
    const aPrice = new Decimal(a.price);
    const bPrice = new Decimal(b.price);
    if (aPrice.lt(bPrice)) return -1;
    if (aPrice.gt(bPrice)) return 1;
    // Sort by name
    return a.name < b.name ? -1 : 1;
  });
  return sorted;
};
const memoizedItems = memoizeOne(sortItems);

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<typeof api.items.findAll.response> {
    const items = await this.itemsRepository.find();
    const sorted = memoizedItems(items);
    return sorted;
  }
}
