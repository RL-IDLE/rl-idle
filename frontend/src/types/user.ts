import Decimal from 'break_infinity.js';
import { IItemBought } from './item';
import { IPrestigeBought } from './prestige';

export type IUser = {
  id: string;
  username: string;
  moneyFromClick: Decimal;
  moneyPerClick: Decimal;
  moneyUsed: Decimal;
  itemsBought: IItemBought[];
  prestigesBought: IPrestigeBought[];
  emeralds: Decimal;
  latestBalance: Decimal;
  maxPassiveIncomeInterval: number;
};
