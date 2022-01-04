import { AppEvent } from 'app/types/common';
import { service } from 'app/utils/service';
import type { Account, Business, User } from 'generated/capital';
import { events } from '_common/api/events';

export async function getOwner() {
  return (await service.get<Readonly<User> | null>('/users')).data ?? events.emit(AppEvent.Logout);
}

export async function getBusiness() {
  try {
    return (await service.get<Readonly<Business> | null>(`/businesses`)).data;
  } catch (e: unknown) {
    return null;
  }
}

export async function getBusinessAccount() {
  return (await service.get<Readonly<Account>>('/businesses/accounts')).data;
}
