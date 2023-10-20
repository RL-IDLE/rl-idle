import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { api } from 'src/types/api';
import Decimal from 'break_infinity.js';
import memoizeOne from 'memoize-one';
import { Prestige } from './prestige/prestige.entity';

const sortPrestige = (prestige: Prestige[]) => {
  const sorted = prestige.sort((a, b) => {
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
const memoizedPrestige = memoizeOne(sortPrestige);

@Injectable()
export class PrestigesService {
  constructor(
    @InjectRepository(Prestige)
    private readonly prestigeRepository: Repository<Prestige>,
  ) {}

  async findAll(): Promise<typeof api.prestiges.findAll.response> {
    const prestige = await this.prestigeRepository.find();
    const sorted = memoizedPrestige(prestige);
    return sorted;
  }
}
