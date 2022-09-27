export const SESSION_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
export const SESSION_STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';

export const getTokenFromStorage = (): string => {
  return sessionStorage.getItem(SESSION_STORAGE_ACCESS_TOKEN_KEY);
};

export const setTokenFromStorage = (accessToken: string) => {
  sessionStorage.setItem(SESSION_STORAGE_ACCESS_TOKEN_KEY, accessToken);
};

export const deleteTokenFromStorage = () => {
  sessionStorage.removeItem(SESSION_STORAGE_ACCESS_TOKEN_KEY);
};

export const getRefreshTokenFromStorage = (): string => {
  return sessionStorage.getItem(SESSION_STORAGE_REFRESH_TOKEN_KEY);
};

export const setRefreshTokenFromStorage = (refreshToken: string) => {
  sessionStorage.setItem(SESSION_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
};

export const deleteRefreshTokenFromStorage = () => {
  sessionStorage.removeItem(SESSION_STORAGE_REFRESH_TOKEN_KEY);
};
