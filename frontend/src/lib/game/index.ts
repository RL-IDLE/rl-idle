import { IUser } from '@/types/user';
import Decimal from 'break_infinity.js';

export const getUserBalance = (user: IUser | null) => {
  if (!user) return Decimal.fromString('0');
  const moneyFromClick = user.moneyFromClick;
  const moneyFromInvestments = user.itemsBought.reduce<Decimal>((acc, item) => {
    const timeDiff = Date.now() - new Date(item.createdAt).getTime();
    return acc.plus(item.item.moneyPerSecond.times(timeDiff / 1000));
  }, Decimal.fromString('0'));
  const total = moneyFromClick.plus(moneyFromInvestments);
  const moneyUsed = user.moneyUsed;
  const money = total.minus(moneyUsed);
  return money.round();
};

export const getMoneyFromInvestmentsPerSeconds = (user: IUser | null) => {
  if (!user) return Decimal.fromString('0');
  const moneyFromInvestments = user.itemsBought.reduce<Decimal>((acc, item) => {
    return acc.plus(item.item.moneyPerSecond);
  }, Decimal.fromString('0'));
  return moneyFromInvestments;
};
