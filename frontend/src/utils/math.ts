export const getSign = (value: number) => {
  if (value < 0) {
    return '-';
  } else if (value > 0) {
    return '+';
  }
  return '';
};

export const valueToPercent = (value: number, total: number) => {
  return Math.round((value / total) * 100);
};
