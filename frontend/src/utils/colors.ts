export const getGrowthColor = (growth: number) => {
  if (growth === 0) return 'secondaryGrey.600';
  return growth > 0 ? 'green.500' : 'red.500';
};