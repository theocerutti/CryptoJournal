import { api } from '../api';

export const getInvestmentsQuery = () => api.get('/investments');

export const createInvestmentMutation = (mutationArgs: any) =>
  api.post('/investments', mutationArgs);

export const investmentQueryKey = 'investments';
