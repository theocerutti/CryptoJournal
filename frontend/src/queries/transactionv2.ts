import { api } from '../utils/api';
import { CreateTransactionV2Dto, GetTransactionV2Dto, UpdateTransactionV2Dto } from '@shared/transactionv2';
import { AxiosResponse } from 'axios';

export const getTransactionsV2Query = (): Promise<AxiosResponse<GetTransactionV2Dto[]>> =>
  api.get<GetTransactionV2Dto[]>('/transactionsv2');

export const deleteTransactionV2Mutation = (investmentID: number) => api.delete(`/transactionsv2/${investmentID}`);

export const createTransactionV2Mutation = (mutationArgs: CreateTransactionV2Dto) =>
  api.post('/transactionsv2', mutationArgs);

export const updateTransactionV2Mutation = (mutationArgs: UpdateTransactionV2Dto) =>
  api.put('/transactionsv2', mutationArgs);

export const TRANSACTION_V2_QUERY_KEY = 'transactionsV2';
