import Decimal from 'break_infinity.js';
import { IItemBought } from './item';
import { IPrestigeBought } from './prestige';

export type IUser = {
  id: string;
  moneyFromClick: Decimal;
  moneyPerClick: Decimal;
  moneyUsed: Decimal;
  itemsBought: IItemBought[] | undefined;
  prestigesBought: IPrestigeBought[] | undefined;
};
