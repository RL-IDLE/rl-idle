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
  beautify(
    Decimal.fromString('0.1')
      .mul(basePrice)
      .mul(step.pow(2))
      // .add(Decimal.fromString('0.4').mul(step).mul(basePrice))
      .add(basePrice)
      .round(),
  );

//? old: basePrice (3 (x + x * 0.2))^(x / 2) * 11x
// export const getPriceForClickItem = (basePrice: Decimal, step: Decimal) => {
//   return beautify(
//     basePrice
//       .times(
//         Decimal.fromString('1.5')
//           .times(step.plus(step.times('0.1')))
//           .pow(step.div('2')),
//       )
//       .times(
//         step.times('3').eq('0') ? Decimal.fromString('1') : step.times('3'),
//       )
//       .round(),
//   );
// };
//? Test: 20 (8+8*0.1 x)^(x)
export const getPriceForClickItem = (basePrice: Decimal, step: Decimal) => {
  return beautify(
    basePrice.times(Decimal.fromString('7').pow(step.times('0.6'))).round(),
  );
};

export const getUserMoneyPerClick = (user: IUser) => {
  const clickPower = new Decimal(user.moneyPerClick);
  const highestPrestige = memoizedHighestPrestige(user.prestigesBought);
  return clickPower.times(highestPrestige);
};

/**
 * Beautify a number
 * @description It will try to beautify a Decimal number
 * @param num
 * @returns number beautified
 * @example
 * beautify(1000) // 1,000
 * beautify(171) // 170
 * beautify(2589) // 3,000
 * beautify(197024772) // 200,000,000
 */
export const beautify = (num: Decimal, debug?: boolean) => {
  //? Get the 3 firsts digit from the right
  const firstsDigits = num.toString().slice(0, 3);
  const exponent = num.exponent;
  const firstsDigitsNumber = Number(firstsDigits.replace('e+', ''));
  if (debug) console.log(num, firstsDigitsNumber);
  //? If the number is less than 1000, return the number
  if (exponent < 2 || firstsDigitsNumber < 100) {
    return num.times(10).round().div(10);
  }
  //? Round firstsDigitsNumber
  const roundedFirstsDigitsNumber = Math.round(firstsDigitsNumber / 10) * 10;
  return Decimal.fromString(
    `${roundedFirstsDigitsNumber}e${exponent - 2}`,
  ).round();
};

export const getMoneyFromInvestmentsPerSeconds = (
  user: Pick<IUser, 'itemsBought' | 'prestigesBought'> | null,
) => {
  if (!user) return Decimal.fromString('0');
  const moneyFromInvestments = user.itemsBought.reduce<Decimal>((acc, item) => {
    return acc.plus(item.item.moneyPerSecond);
  }, Decimal.fromString('0'));
  const highestPrestige = memoizedHighestPrestige(user.prestigesBought);
  return moneyFromInvestments.times(highestPrestige);
};
