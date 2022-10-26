import { api } from '../utils/api';
import {
  CreateInvestmentDto,
  GetInvestmentDto,
  UpdateInvestmentDto,
  InvestmentGlobalInfoDto,
} from '@shared/investment';
import { AxiosResponse } from 'axios';

export const getInvestmentsQuery = (): Promise<AxiosResponse<GetInvestmentDto[]>> =>
  api.get<GetInvestmentDto[]>('/investments');

export const deleteInvestmentMutation = (investmentID: number) => api.delete(`/investments/${investmentID}`);

export const getInvestmentsGlobalInfoQuery = (): Promise<AxiosResponse<InvestmentGlobalInfoDto>> =>
  api.get<InvestmentGlobalInfoDto>('/investments/global-info');

export const createInvestmentMutation = (mutationArgs: CreateInvestmentDto) => api.post('/investments', mutationArgs);

export const updateInvestmentMutation = (mutationArgs: UpdateInvestmentDto) => api.put('/investments', mutationArgs);

export const INVESTMENT_QUERY_KEY = 'investments';
export const INVESTMENT_GLOBAL_INFO_QUERY_KEY = 'investmentGlobalInfo';
