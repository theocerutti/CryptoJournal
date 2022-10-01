import { api } from '../utils/api';
import { CreateInvestmentDto } from '@shared/investment';
import {
  InvestmentDto,
  InvestmentGlobalInfoDto,
  GetInvestmentDto,
} from '@shared/investment';
import { AxiosResponse } from 'axios';

export const getInvestmentsQuery = (): Promise<
  AxiosResponse<GetInvestmentDto[]>
> => api.get<GetInvestmentDto[]>('/investments');

export const deleteInvestmentMutation = (investment: InvestmentDto) =>
  api.delete(`/investments/${investment.id}`);

export const getInvestmentsGlobalInfoQuery = (): Promise<
  AxiosResponse<InvestmentGlobalInfoDto>
> => api.get<InvestmentGlobalInfoDto>('/investments/global-info');

export const createInvestmentMutation = (mutationArgs: CreateInvestmentDto) =>
  api.post('/investments', mutationArgs);

export const INVESTMENT_QUERY_KEY = 'investments';
export const INVESTMENT_GLOBAL_INFO_QUERY_KEY = 'investmentGlobalInfo';
