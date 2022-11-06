import { api } from '../utils/api';
import { CreateAssetDto, GetAssetDto, UpdateAssetDto } from '@shared/asset';
import { AxiosResponse } from 'axios';

export const getAssetsQuery = (): Promise<AxiosResponse<GetAssetDto[]>> => api.get<GetAssetDto[]>('/assets');

export const deleteAssetMutation = (assetId: number) => api.delete(`/assets/${assetId}`);

export const createAssetMutation = (mutationArgs: CreateAssetDto) => api.post('/assets', mutationArgs);

export const updateAssetMutation = (mutationArgs: UpdateAssetDto) => api.put('/assets', mutationArgs);

export const ASSET_QUERY_KEY = 'assets';
