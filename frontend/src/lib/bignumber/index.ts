import Decimal from 'break_infinity.js';
import memoizee from 'memoizee';

const floatRegex = /(\.\d{3})\d+/;
const floatRegex1 = /(\.\d{1})\d+/;

const tabsDecimal = [
  { value: 0, label: '' },
  { value: 3, label: 'K' },
  { value: 6, label: 'M' },
  { value: 9, label: 'B' },
  { value: 12, label: 'T' },
  { value: 15, label: 'Q' },
  { value: 18, label: 'S' },
];

function intToBase26String(_num: Decimal) {
  // Vérifie si le nombre est valide
  const num = Decimal.fromDecimal(_num);
  num.exponent -= 20;
  if (num.exponent <= 0) return '';

  let str = '';

  while (num.exponent > 0) {
    num.exponent--;
    const charCode = num.exponent % 26;
    str = String.fromCharCode(97 + charCode) + str;
    num.exponent = Math.floor(num.exponent / 26);
  }

  return num.mantissa.toString().replace(floatRegex, '$1') + ' ' + str;
}

function _decimalToHumanReadable(
  decimal: Decimal,
  round?: boolean,
  debug?: boolean,
): string {
  if (debug === true) {
    console.log(decimal, debug);
  }
  if (decimal.exponent < 3) {
    const mantissa = decimal.mantissa * 10 ** decimal.exponent;
    return (round ? Math.round(mantissa) : mantissa)
      .toString()
      .replace(floatRegex1, '$1');
  }

  const entier = Decimal.fromNumber(decimal.exponent).div(3).floor();
  const index = entier.add(1);

  if (index.eq(0)) {
    return decimal.mantissa.toString();
  } else if (index.gt(tabsDecimal.length)) {
    return intToBase26String(decimal);
  }

  const decimalTab = tabsDecimal[parseInt(index.minus(1).toString())];

  const mantissa =
    decimal.mantissa * 10 ** (decimal.exponent - decimalTab.value);

  let decimalFromRegex = floatRegex.exec(mantissa.toString())?.[1];
  if (decimalFromRegex === '.000') {
    decimalFromRegex = '';
  }
  const value = mantissa.toString().replace(floatRegex, decimalFromRegex ?? '');
  const decimalReadable =
    (round
      ? Decimal.fromString(
          mantissa.toString().replace(floatRegex, decimalFromRegex ?? ''),
        )
          .mul(100)
          .round()
          .div(100)
          .toString()
      : value) +
    ' ' +
    decimalTab.label;

  return decimalReadable;
}
const decimalToHumanReadable = memoizee(_decimalToHumanReadable, { max: 1000 });

export { decimalToHumanReadable };
