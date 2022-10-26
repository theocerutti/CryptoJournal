import { AxiosResponse } from 'axios';
import { api } from '../utils/api';
import { GetUserDto, UpdateUserDto } from '@shared/user';

export const GET_USER = 'user';

export const getUserQuery = (): Promise<AxiosResponse<GetUserDto>> => api.get<GetUserDto>('/users/me');

export const updateUserMutation = (user: UpdateUserDto) => api.put(`/users/me`, user);
