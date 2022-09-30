import { api } from '../api';
import { CreateInvestmentDto } from '@shared/investment';

export const getInvestmentsQuery = () => api.get('/investments');

export const createInvestmentMutation = (mutationArgs: CreateInvestmentDto) =>
  api.post('/investments', mutationArgs);

export const investmentQueryKey = 'investments';
