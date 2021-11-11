import { service } from 'app/utils/service';
import type { User } from 'employees/types';

import type { Businesses } from '../types/businesses';
import type { Account } from '../types/accounts';

export async function getOwner() {
  return (await service.get<Readonly<User>>('/users')).data;
}

export async function getBusiness() {
  return (await service.get<Readonly<Businesses> | null>(`/businesses`)).data;
}

export async function getBusinessAccount() {
  return (await service.get<Readonly<Account>>('/businesses/accounts')).data;
}
