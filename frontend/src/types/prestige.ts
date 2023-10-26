import Decimal from 'break_infinity.js';

export type IPrestige = {
  id: string;
  moneyMult: Decimal;
  image: string;
  name: string;
  price: Decimal;
};

export type IPrestigeBought = {
  id: string;
  prestige: IPrestige;
  // user: IUser;
  createdAt: Date;
};
