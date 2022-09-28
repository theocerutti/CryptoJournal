import { api } from '../api';

export const getInvestmentsQuery = () => api.get('/investments');
