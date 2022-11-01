export const getSign = (value: number) => {
  if (value < 0) {
    return '-';
  } else if (value > 0) {
    return '+';
  }
  return '';
};

/*
 Return a fixed decimal number without having weirdly formatted number
 @example
   toSpecialPrecision(1.234567, 2) => 1.23
   toSpecialPrecision(0.000000123223, 3) => 0.000000123
 */
export const DEFAULT_CURRENCY_PRECISION = 2;
export const toSpecialPrecision = (value: number, precision: number = DEFAULT_CURRENCY_PRECISION) => {
  if (value === null || value === undefined) return '';

  const s = value.toString();
  let zeroNumber = 0;
  const eMatch = s.match('e[+|-][0-9]+');

  if (eMatch) {
    zeroNumber = parseInt(s.slice(eMatch.index + 2, s.length)) - 1;
  } else if (s.indexOf('.') !== -1) {
    const decimalPart = s.split('.')[1];

    let i = 0;
    while (decimalPart[i] === '0' && i < decimalPart.length) i++;
    zeroNumber = i;
  }
  return zeroNumber <= precision ? value.toFixed(precision) : value.toFixed(precision + zeroNumber);
};
