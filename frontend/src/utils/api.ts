import Axios from 'axios';
import {
  deleteRefreshTokenFromStorage,
  deleteTokenFromStorage,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  setTokenFromStorage,
} from './authStorage';
// import { HttpErrorCode } from '@shared/exceptions'; // TODO
// import { TOKEN_AUTH_RES_HEADER } from '@shared/auth';

const TOKEN_AUTH_RES_HEADER = 'Authorization';
const SERVER_URL = process.env.REACT_APP_API_URL;

const extractErrMessage = (err: { response: { data: { message: string } }; message: string }) => {
  if (!err) return 'Unknown error';
  if (err.response && err.response.data && err.response.data.message) return err.response.data.message;
  return err.message;
};

const api = Axios.create({
  transformRequest: [
    (data, headers) => {
      const accessToken = getTokenFromStorage();
      if (accessToken) {
        headers[TOKEN_AUTH_RES_HEADER] = `Bearer ${accessToken}`;
      }
      return data;
    },
    // @ts-ignore
    ...Axios.defaults.transformRequest,
  ],
  baseURL: SERVER_URL,
});

const isJwtExpirationError = (err: { response: { data: any } }) => {
  if (err.response && err.response.data) {
    const data = err.response.data;
    return data.id === /*HttpErrorCode.JWT_ERROR*/ 1; // TODO
  }
  return false;
};

let __alreadySetup = false;
export const setupInterceptors = (history: any, toast: (options: any) => void = null) => {
  if (__alreadySetup) return;
  __alreadySetup = true;
  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      const originalRequest = err.config;

      // if even after refetch an access token on /refresh route we receive a 401 code then go to login
      if (isJwtExpirationError(err) && originalRequest.url === '/auth/refresh') {
        deleteRefreshTokenFromStorage();
        deleteTokenFromStorage();
        history.push('/auth/sign-in', {
          alertMessage: 'Your refresh token is expired. Please sign in again.',
        });
        return Promise.reject(err);
      } else if (isJwtExpirationError(err) && !originalRequest._retried) {
        originalRequest._retried = true;
        const refreshToken = getRefreshTokenFromStorage();
        return api.post('/auth/refresh', { refresh_token: refreshToken }).then((res) => {
          const newToken = res.data;
          setTokenFromStorage(newToken);
          api.defaults.headers.common[TOKEN_AUTH_RES_HEADER] = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }
      if (err.response && err.response.status !== 403) {
        // don't notify error of forbidden errors
        if (toast) {
          toast({
            description: extractErrMessage(err),
            status: 'error',
            position: 'bottom-right',
            isClosable: true,
          });
        }
      }
      return Promise.reject(err);
    }
  );
};

export { api };
