import Decimal from 'break_infinity.js';
import { IUser } from 'src/types/user';

export const getUserBalance = (user: IUser) => {
  const moneyFromClick = Decimal.fromString(user.moneyFromClick);
  const moneyFromInvestments = user.itemsBought.reduce<Decimal>((acc, item) => {
    const timeDiff = Date.now() - new Date(item.createdAt).getTime();
    return acc.plus(
      Decimal.fromString(item.item.moneyPerSecond).times(timeDiff / 1000),
    );
  }, Decimal.fromString('0'));
  const total = moneyFromClick.plus(moneyFromInvestments);
  const moneyUsed = Decimal.fromString(user.moneyUsed);
  const money = total.minus(moneyUsed);
  return money.round();
};
