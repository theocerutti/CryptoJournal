const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return formatter.format(0);
  }
  return formatter.format(value);
}
