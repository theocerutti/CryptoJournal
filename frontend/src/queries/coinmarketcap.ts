import { AxiosResponse } from 'axios';
import { api } from '../utils/api';
import { CMCCryptoBasicInfos } from '@shared/coinmarketcap';

export const getCryptoBasicsInfos = (): Promise<AxiosResponse<CMCCryptoBasicInfos>> =>
  api.get<CMCCryptoBasicInfos>('/coinmarketcap/crypto');

export const CMC_CRYPTO_BASIC_INFOS = 'cmcCryptoBasicInfos';
