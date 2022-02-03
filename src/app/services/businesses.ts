import { AppEvent } from 'app/types/common';
import { service } from 'app/utils/service';
import type {
  Account,
  Business,
  User,
  BusinessReallocationRequest,
  BusinessFundAllocationResponse,
} from 'generated/capital';
import { events } from '_common/api/events';

export async function getOwner() {
  const data = (await service.get<Readonly<Required<User>> | null>('/users')).data;
  if (!data) events.emit(AppEvent.Logout);
  return data;
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

export async function makeTransaction(params: Required<BusinessReallocationRequest>) {
  return (await service.post<Required<BusinessFundAllocationResponse>>('/businesses/transactions', params)).data;
}
