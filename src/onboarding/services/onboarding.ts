import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types';

import type {
  CreateBusinessAccount,
  BusinessAccount,
  ConfirmOTP,
  CreateBusinessInfo,
  CreateBusinessInfoResp,
} from '../types';

export async function signup(params: Readonly<CreateBusinessAccount>) {
  return (await service.post<Readonly<BusinessAccount>>('/business-prospects', params)).data;
}

export async function confirmOTP(id: UUIDString, params: Readonly<ConfirmOTP>) {
  return service.post(`/business-prospects/${id}/validate-identifier`, params);
}

export async function setPhone(id: UUIDString, phone: string) {
  return service.post(`/business-prospects/${id}/phone`, { phone });
}

export async function setPassword(id: UUIDString, password: string) {
  return service.post(`/business-prospects/${id}/password`, { password });
}

export async function setBusinessInfo(id: UUIDString, params: Readonly<CreateBusinessInfo>) {
  return (await service.post<Readonly<CreateBusinessInfoResp>>(`/business-prospects/${id}/convert`, params)).data;
}
