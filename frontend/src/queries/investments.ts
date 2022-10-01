import { api } from '../utils/api';
import { CreateInvestmentDto } from '@shared/investment';
import { InvestmentDto } from '@shared/investment';

export const getInvestmentsQuery = () => api.get('/investments');

export const deleteInvestmentMutation = (investment: InvestmentDto) =>
  api.delete(`/investments/${investment.id}`);

export const getInvestmentsGlobalInfoQuery = () =>
  api.get('/investments/global-info');

export const createInvestmentMutation = (mutationArgs: CreateInvestmentDto) =>
  api.post('/investments', mutationArgs);

export const INVESTMENT_QUERY_KEY = 'investments';
export const INVESTMENT_GLOBAL_INFO_QUERY_KEY = 'investmentGlobalInfo';
