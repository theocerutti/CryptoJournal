export const STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
export const STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';

export const getTokenFromStorage = (): string => {
  return localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
};

export const setTokenFromStorage = (accessToken: string) => {
  localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, accessToken);
};

export const deleteTokenFromStorage = () => {
  localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY);
};

export const getRefreshTokenFromStorage = (): string => {
  return localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY);
};

export const setRefreshTokenFromStorage = (refreshToken: string) => {
  localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
};

export const deleteRefreshTokenFromStorage = () => {
  localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
};
