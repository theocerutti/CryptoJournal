import { api } from '../api';

export const loginMutation = (mutationArgs: any) =>
  api.post('/auth/login', mutationArgs);

export const registerMutation = (mutationArgs: any) =>
  api.post('/auth/register', mutationArgs);
