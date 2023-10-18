import Decimal from 'break_infinity.js';
import { IItemBought } from './item';

export type IUser = {
  id: string;
  moneyFromClick: Decimal;
  moneyPerClick: Decimal;
  moneyUsed: Decimal;
  itemsBought: IItemBought[];
};
