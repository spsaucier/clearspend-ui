import { service } from 'app/utils/service';
import type { ManualReviewResponse } from 'onboarding/components/SoftFail/types';
import type {
  CreateBusinessProspectRequest,
  CreateBusinessProspectResponse,
  ValidateBusinessProspectIdentifierRequest,
  ConvertBusinessProspectRequest,
  ConvertBusinessProspectResponse,
  CreateOrUpdateBusinessOwnerRequest,
  BusinessProspectData,
} from 'generated/capital';

export type BusinessRelationships =
  | 'relationshipOwner'
  | 'relationshipRepresentative'
  | 'relationshipExecutive'
  | 'relationshipDirector';

export async function signup(params: Readonly<CreateBusinessProspectRequest>) {
  return (await service.post<Readonly<CreateBusinessProspectResponse>>('/business-prospects', params)).data;
}

export async function getBusinessProspectInfo(businessProspectId: string) {
  return service.get<Readonly<BusinessProspectData>>(`/business-prospects/${businessProspectId}`);
}

export async function confirmOTP(id: string, params: Readonly<ValidateBusinessProspectIdentifierRequest>) {
  return service.post(`/business-prospects/${id}/validate-identifier`, params);
}

export async function setPhone(id: string, phone: string) {
  return service.post(`/business-prospects/${id}/phone`, { phone });
}

export async function setPassword(id: string, password: string) {
  return service.post(`/business-prospects/${id}/password`, { password });
}

export async function setBusinessInfo(id: string, params: Readonly<ConvertBusinessProspectRequest>) {
  return (await service.post<Readonly<ConvertBusinessProspectResponse>>(`/business-prospects/${id}/convert`, params))
    .data;
}

export async function setBusinessOwner(ownerId: string, params: Readonly<CreateOrUpdateBusinessOwnerRequest>) {
  return service.patch(`/business-owners/${ownerId}`, params);
}

export async function setBusinessOwners(params: Readonly<CreateOrUpdateBusinessOwnerRequest[]>) {
  return service.post(`/business-owners`, params);
}

export async function getApplicationReviewRequirements() {
  return (await service.get<Readonly<ManualReviewResponse>>('/application-review/requirement')).data;
}
