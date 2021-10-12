import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types';

import type { NewBusinessAccount, BusinessAccount, ConfirmOTP } from '../types';

export async function signup(params: Readonly<NewBusinessAccount>) {
  return (await service.post<Readonly<BusinessAccount>>('/business-prospect', params)).data;
}

export async function confirmOTP(id: UUIDString, params: Readonly<ConfirmOTP>) {
  return service.post(`/business-prospect/${id}/validate-identifier`, params);
}

export async function setPhone(id: UUIDString, phone: string) {
  return service.post(`/business-prospect/${id}/phone`, { phone });
}

export async function setPassword(id: UUIDString, password: string) {
  return service.post(`/business-prospect/${id}/password`, { password });
}
