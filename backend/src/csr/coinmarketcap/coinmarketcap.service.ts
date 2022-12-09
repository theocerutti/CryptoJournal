import { HttpStatus, Injectable } from '@nestjs/common';
import { cmcCachedApi, CRYPTO_BASIC_INFOS_CACHE_AGE, CRYPTO_QUOTES_CACHE_AGE, SUPPORTED_CRYPTOS_COUNT } from './api';
import { CMCCryptoBasicInfos, CMCCryptoMap, CMCQuoteLatestData, CMCQuotesLatest } from '../../shared/coinmarketcap';
import HttpError from '../../exceptions/http.error';

@Injectable()
export class CoinMarketCapService {
  constructor() {}

  getCryptoLogo(id: number) {
    return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
  }

  async getCryptoQuotes(ids: number[]): Promise<CMCQuoteLatestData> {
    if (!ids) throw new HttpError('Crypto IDs are not well formatted', null, HttpStatus.UNPROCESSABLE_ENTITY);
    if (ids.find((id) => id < 1 || id === null || id === undefined))
      throw new HttpError('Crypto IDs are not well formatted', null, HttpStatus.UNPROCESSABLE_ENTITY);
    if (ids.length === 0)
      throw new HttpError('Crypto IDs are not well formatted', null, HttpStatus.UNPROCESSABLE_ENTITY);

    try {
      // sort ids to avoid cache miss
      const quotes = await cmcCachedApi.get<CMCQuotesLatest>(
        `/v1/cryptocurrency/quotes/latest?id=${ids.sort().join(',')}`,
        {
          cache: {
            maxAge: CRYPTO_QUOTES_CACHE_AGE,
          },
        }
      );
      return quotes.data.data;
    } catch (e) {
      console.error(e);
      throw new HttpError("Can't get crypto quotes", e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCryptosBasicInfos(): Promise<CMCCryptoBasicInfos> {
    const toFetchCount = SUPPORTED_CRYPTOS_COUNT;
    let fetchedCount = 0;
    const infos: CMCCryptoBasicInfos = {};
    let page = 1;

    while (fetchedCount < toFetchCount) {
      try {
        const map = await cmcCachedApi.get<CMCCryptoMap>(
          `/v1/cryptocurrency/map?start=${page}&limit=${toFetchCount}&sort=cmc_rank`,
          {
            cache: {
              maxAge: CRYPTO_BASIC_INFOS_CACHE_AGE,
            },
          }
        );
        map.data.data.forEach((crypto) => {
          infos[crypto.id] = {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            logo: this.getCryptoLogo(crypto.id),
          };
        });
        fetchedCount += map.data.data.length;
      } catch (e) {
        throw new HttpError("Can't get crypto infos", e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      page++;
    }
    return infos;
  }
}
