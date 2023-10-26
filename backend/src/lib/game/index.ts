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
  const highestPrestige = user.prestigesBought.reduce<Decimal>(
    (acc, prestige) => {
      const prestigeValue = Decimal.fromString(prestige.prestige.moneyMult);
      return prestigeValue.gt(acc) ? prestigeValue : acc;
    },
    Decimal.fromString('0'),
  );
  const prestigeMultiplier = highestPrestige.eq('0') ? '1' : highestPrestige;
  const money = total.minus(moneyUsed).times(prestigeMultiplier);
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
