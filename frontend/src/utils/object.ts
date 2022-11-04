export const getObjectValueFromDot = (object: any, path: string) => path.split('.').reduce((r, k) => r?.[k], object);
