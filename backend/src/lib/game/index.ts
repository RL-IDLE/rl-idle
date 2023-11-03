import Decimal from 'break_infinity.js';
import { IUser } from 'src/types/user';
import memoizeOne from 'memoize-one';

const memoizedHighestPrestige = memoizeOne(
  (prestiges: IUser['prestigesBought']) => {
    return prestiges.reduce<Decimal>((acc, prestige) => {
      const prestigeValue = Decimal.fromString(prestige.prestige.moneyMult);
      return prestigeValue.gt(acc) ? prestigeValue : acc;
    }, Decimal.fromString('1'));
  },
);

export const getUserBalance = (user: IUser, date?: Date) => {
  const baseDate = date?.getTime() || Date.now();
  const moneyFromClick = Decimal.fromString(user.moneyFromClick);
  const highestPrestige = memoizedHighestPrestige(user.prestigesBought);
  const moneyFromInvestments = user.itemsBought
    .reduce<Decimal>((acc, item) => {
      const timeDiff = baseDate - new Date(item.createdAt).getTime();
      return acc.plus(
        Decimal.fromString(item.item.moneyPerSecond).times(timeDiff / 1000),
      );
    }, Decimal.fromString('0'))
    .times(highestPrestige);
  const total = moneyFromClick.plus(moneyFromInvestments);
  const moneyUsed = Decimal.fromString(user.moneyUsed);
  const money = total.minus(moneyUsed);
  return money.round();
};

export const getPriceOfItem = (basePrice: Decimal, step: Decimal) =>
  Decimal.fromString('0.1')
    .mul(basePrice)
    .mul(step.pow(2))
    .add(Decimal.fromString('0.4').mul(step).mul(basePrice))
    .add(basePrice)
    .round();

export const getPriceForClickItem = (basePrice: Decimal, step: Decimal) => {
  return basePrice
    .times(Decimal.fromString('2').pow(step))
    .times(
      step.times('3.5').eq('0') ? Decimal.fromString('1') : step.times('3.5'),
    )
    .round();
};

export const getUserMoneyPerClick = (user: IUser) => {
  const clickPower = new Decimal(user.moneyPerClick);
  const highestPrestige = memoizedHighestPrestige(user.prestigesBought);
  return clickPower.times(highestPrestige);
};
