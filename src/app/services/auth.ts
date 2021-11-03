import { service } from 'app/utils/service';

import type { BusinessOwner } from '../types/businesses';

export async function login(username: string, password: string) {
  const data = (await service.post<Readonly<BusinessOwner> | null>('/authentication/login', { username, password }))
    .data;
  if (!data) throw new Error();
  return data;
}

export async function logout() {
  await service.post('/authentication/logout');
}
