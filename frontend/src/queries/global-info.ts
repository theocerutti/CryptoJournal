import { AxiosResponse } from 'axios';
import { api } from '../utils/api';
import { GlobalInfoDto } from '@shared/global-info';

export const getGlobalInfoQuery = (): Promise<AxiosResponse<GlobalInfoDto>> => api.get<GlobalInfoDto>('/global-info');

export const GLOBAL_INFO_QUERY_KEY = 'global-info';
