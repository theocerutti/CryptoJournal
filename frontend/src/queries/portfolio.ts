import { api } from '../utils/api';
import { CreatePortfolioDto, GetPortfolioDto, UpdatePortfolioDto } from '@shared/portfolio';
import { AxiosResponse } from 'axios';

export const getPortfoliosQuery = (): Promise<AxiosResponse<GetPortfolioDto[]>> =>
  api.get<GetPortfolioDto[]>('/portfolios');

export const createPortfolioMutation = (mutationArgs: CreatePortfolioDto) => api.post('/portfolios', mutationArgs);

export const updatePortfolioMutation = (mutationArgs: UpdatePortfolioDto) => api.put('/portfolios', mutationArgs);

export const PORTFOLIO_QUERY_KEY = 'portfolios';
