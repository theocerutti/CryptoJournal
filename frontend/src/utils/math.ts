export const getSign = (value: number) => {
  if (value < 0) {
    return '-';
  } else if (value > 0) {
    return '+';
  }
  return '';
};
