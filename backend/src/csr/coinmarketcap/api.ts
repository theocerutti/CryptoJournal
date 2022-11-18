import Axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { axiosRateLimit } from '../../utils/axiosRateLimiter';

const cache = setupCache({
  maxAge: 1 * 60 * 1000, // 60 minutes
  exclude: { query: false },
});

const cmcCachedApi = axiosRateLimit(
  Axios.create({
    transformRequest: [
      (data, headers) => {
        headers['X-CMC_PRO_API_KEY'] = process.env.COINMARKETCAP_API_KEY;
        headers['Accept'] = 'application/json';
        headers['Accept-Encoding'] = 'deflate, gzip';
        return data;
      },
      // @ts-ignore
      ...Axios.defaults.transformRequest,
    ],
    baseURL: process.env.COINMARKETCAP_API_URL,
    adapter: cache.adapter,
  }),
  { maxRequests: 28, perMilliseconds: 1000 * 60 }
);

export const SUPPORTED_CRYPTOS_COUNT = 1000;
export const CRYPTO_BASIC_INFOS_CACHE_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
export const CRYPTO_QUOTES_CACHE_AGE = 1000 * 60 * 30; // 30 minutes
export const CRYPTO_METADATA_CACHE_AGE = 1000 * 60 * 24 * 14; // 14 days

export { cmcCachedApi };
