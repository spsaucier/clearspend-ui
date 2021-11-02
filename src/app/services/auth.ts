import { service } from 'app/utils/service';

import type { BusinessOwner } from '../types/businesses';

export async function login(username: string, password: string) {
  return (await service.post<Readonly<BusinessOwner>>('/authentication/login', { username, password })).data;
}

export async function logout() {
  await service.post('/authentication/logout');
}
