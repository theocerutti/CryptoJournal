import { api } from '../utils/api';
import { LoginUserDTO, CreateUserDTO } from '@shared/auth';

export const loginMutation = (mutationArgs: LoginUserDTO) => api.post('/auth/login', mutationArgs);

export const registerMutation = (mutationArgs: CreateUserDTO) => api.post('/auth/register', mutationArgs);
