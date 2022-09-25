import Axios from 'axios';

const SERVER_URL = process.env.REACT_APP_API_URL;

const extractErrMessage = (err: {
  response: { data: { message: any } };
  message: any;
}) => {
  if (!err) return 'Unknown error';
  if (err.response && err.response.data && err.response.data.message)
    return err.response.data.message;
  return err.message;
};

const api = Axios.create({
  transformRequest: [
    (data, headers) => {
      //if (store.getters.isLogged) {
      //  headers['Authorization'] = `Bearer ${store.state.auth.accessToken}`;
      //}
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
    return data.statusCode === 401 && data.type === 'ExpiredJwtToken';
  }
  return false;
};

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const originalRequest = err.config;

    // if even after refetch an access token on /refresh route we receive a 401 code then go to login
    if (
      isJwtExpirationError(err) &&
      originalRequest.url === '/api/auth/refresh'
    ) {
      // router.push("/login");
      return Promise.reject(err);
    } else if (isJwtExpirationError(err) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken: any = null; // store.state.auth.refreshToken;
      return api
        .post('/api/auth/refresh', { refresh_token: refreshToken })
        .then((res) => {
          const newToken = res.data;
          // store.commit("SET_ACCESS_TOKEN", newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        });
    }
    // if (err.response && err.response.status !== 403) // don't notify error of forbidden errors
    // store._vm.$notify({text: extractErrMessage(err), type: "error"});
    return Promise.reject(err);
  }
);

export { api };
