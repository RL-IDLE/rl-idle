import Decimal from 'break_infinity.js';

export type IItem = {
  id: string;
  moneyPerSecond: Decimal;
  moneyPerClickMult: Decimal;
  image: string;
  name: string;
  price: Decimal;
};

export type IItemBought = {
  id: string;
  item: IItem;
  // user: IUser;
  createdAt: Date;
};
