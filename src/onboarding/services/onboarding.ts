import { service } from 'app/utils/service';
import type { ManualReviewResponse } from 'onboarding/components/SoftFail/types';
import type { UUIDString } from 'app/types/common';
import type {
  CreateBusinessProspectRequest,
  CreateBusinessProspectResponse,
  ValidateBusinessProspectIdentifierRequest,
  ConvertBusinessProspectRequest,
  ConvertBusinessProspectResponse,
  CreateOrUpdateBusinessOwnerRequest,
} from 'generated/capital';

export async function signup(params: Readonly<CreateBusinessProspectRequest>) {
  return (await service.post<Readonly<CreateBusinessProspectResponse>>('/business-prospects', params)).data;
}

export async function confirmOTP(id: UUIDString, params: Readonly<ValidateBusinessProspectIdentifierRequest>) {
  return service.post(`/business-prospects/${id}/validate-identifier`, params);
}

export async function setPhone(id: UUIDString, phone: string) {
  return service.post(`/business-prospects/${id}/phone`, { phone });
}

export async function setPassword(id: UUIDString, password: string) {
  return service.post(`/business-prospects/${id}/password`, { password });
}

export async function setBusinessInfo(id: UUIDString, params: Readonly<ConvertBusinessProspectRequest>) {
  return (await service.post<Readonly<ConvertBusinessProspectResponse>>(`/business-prospects/${id}/convert`, params))
    .data;
}

export async function setBusinessOwner(ownerId: UUIDString, params: Readonly<CreateOrUpdateBusinessOwnerRequest>) {
  return service.patch(`/business-owners/${ownerId}`, params);
}

export async function getRequiredDocuments() {
  return (await service.get<Readonly<ManualReviewResponse>>('/manual-review')).data;
}
