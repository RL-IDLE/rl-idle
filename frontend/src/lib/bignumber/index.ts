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

function intToBase26String(
  _num: Decimal,
  round?: boolean,
  roundKind: 'round' | 'ceil' | 'floor' = 'round',
) {
  // Vérifie si le nombre est valide
  const num = Decimal.fromDecimal(_num);
  num.exponent -= 20;
  if (num.exponent <= 0) return '';

  let str = '';

  const baseExponent = num.exponent === 1 ? 1 : num.exponent - 1;
  let exponent = baseExponent / 3;
  const mult = 10 ** ((num.exponent - 1) % 3);
  while (exponent > 0) {
    const charCode = Math.floor(exponent) % 26;
    str = String.fromCharCode(97 + charCode) + str;
    exponent = Math.floor(Math.floor(exponent) / 26);
  }

  const value = (num.mantissa * mult).toString().replace(floatRegex, '$1');
  const stringToAppend = ' ' + str;
  if (!round) {
    return value + stringToAppend;
  }
  if (roundKind === 'round') {
    return (
      Decimal.fromString(value).mul(100).round().div(100).toString() +
      stringToAppend
    );
  } else if (roundKind === 'ceil') {
    const floating = value.split('.')[1];
    const floatingCeil = '.' + (parseInt(floating) + 1);
    return (
      Decimal.fromString(value).floor().toString() +
      floatingCeil +
      stringToAppend
    );
  }
  return (
    Decimal.fromString(value).mul(100).floor().div(100).toString() +
    stringToAppend
  );
}

function _decimalToHumanReadable(
  decimal: Decimal,
  round?: boolean,
  roundKind: 'round' | 'ceil' | 'floor' = 'round',
): string {
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
    return intToBase26String(decimal, round, roundKind);
  }

  const decimalTab = tabsDecimal[parseInt(index.minus(1).toString())];

  const mantissa = Decimal.fromNumber(decimal.mantissa)
    .mul(Decimal.fromString('10').pow(decimal.exponent - decimalTab.value))
    .toString();

  let decimalFromRegex = floatRegex.exec(mantissa.toString())?.[1];
  if (decimalFromRegex === '.000') {
    decimalFromRegex = '';
  }
  const value = mantissa.replace(floatRegex, decimalFromRegex ?? '');
  if (!round) {
    return value + ' ' + decimalTab.label;
  }
  if (roundKind === 'round') {
    return (
      Decimal.fromString(mantissa.replace(floatRegex, decimalFromRegex ?? ''))
        .mul(100)
        .round()
        .div(100)
        .toString() +
      ' ' +
      decimalTab.label
    );
  } else if (roundKind === 'ceil') {
    return (
      Decimal.fromString(mantissa.replace(floatRegex, decimalFromRegex ?? ''))
        .mul(100)
        .ceil()
        .div(100)
        .toString() +
      ' ' +
      decimalTab.label
    );
  }
  return (
    Decimal.fromString(mantissa.replace(floatRegex, decimalFromRegex ?? ''))
      .mul(100)
      .floor()
      .div(100)
      .toString() +
    ' ' +
    decimalTab.label
  );
}
const decimalToHumanReadable = memoizee(_decimalToHumanReadable, { max: 1000 });

export { decimalToHumanReadable };
