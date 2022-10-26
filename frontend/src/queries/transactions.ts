import { api } from '../utils/api';
import { CreateTransactionDto, GetTransactionDto, UpdateTransactionDto } from '@shared/transaction';
import { AxiosResponse } from 'axios';

export const getTransactionsQuery = (): Promise<AxiosResponse<GetTransactionDto[]>> =>
  api.get<GetTransactionDto[]>('/transactions');

export const deleteTransactionMutation = (investmentID: number) => api.delete(`/transactions/${investmentID}`);

export const createTransactionMutation = (mutationArgs: CreateTransactionDto) =>
  api.post('/transactions', mutationArgs);

export const updateTransactionMutation = (mutationArgs: UpdateTransactionDto) => api.put('/transactions', mutationArgs);

export const TRANSACTION_QUERY_KEY = 'transactions';
