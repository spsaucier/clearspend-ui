import { service } from 'app/utils/service';
import type { Account, Business, User } from 'generated/capital';

export async function getOwner() {
  return (await service.get<Readonly<User>>('/users')).data;
}

export async function getBusiness() {
  return (await service.get<Readonly<Business> | null>(`/businesses`)).data;
}

export async function getBusinessAccount() {
  return (await service.get<Readonly<Account>>('/businesses/accounts')).data;
}
