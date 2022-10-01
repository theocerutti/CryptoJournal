const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 4,
});

export const formatCurrency = (value: number): string =>
  formatter.format(value);
