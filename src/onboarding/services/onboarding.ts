import { service } from 'app/utils/service';
import type { ManualReviewResponse } from 'onboarding/components/SoftFail/types';
import type {
  BusinessProspectData,
  CreateBusinessProspectResponse,
  ValidateBusinessProspectIdentifierRequest,
  ConvertBusinessProspectRequest,
  ConvertBusinessProspectResponse,
  CreateOrUpdateBusinessOwnerRequest,
  UpdateBusiness,
  ControllerError,
} from 'generated/capital';
import type { BusinessOwner } from 'onboarding/components/LeadershipTable/LeadershipTable';

export type BusinessRelationships =
  | 'relationshipOwner'
  | 'relationshipRepresentative'
  | 'relationshipExecutive'
  | 'relationshipDirector';

export async function signup(params: Readonly<BusinessProspectData>) {
  return (await service.post<Readonly<CreateBusinessProspectResponse>>('/business-prospects', params)).data;
}

export async function resendOtp(
  params: Readonly<{
    otpType: ValidateBusinessProspectIdentifierRequest['identifierType'];
    businessProspectId: string;
  }>,
) {
  return (await service.get(`/business-prospects/${params.businessProspectId}/${params.otpType}/resend-otp`)).data;
}

export async function getBusinessProspectInfo(businessProspectId: string) {
  return service.get(`/business-prospects/${businessProspectId}`);
}

export async function confirmOTP(id: string, params: Readonly<ValidateBusinessProspectIdentifierRequest>) {
  return service.post<{ emailExist?: boolean }>(`/business-prospects/${id}/validate-identifier`, params);
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

export async function updateBusinessInfo(params: Readonly<UpdateBusiness>) {
  return (await service.post<Readonly<UpdateBusiness>>(`/businesses/update`, params)).data;
}

export async function setBusinessOwner(ownerId: string, params: Readonly<CreateOrUpdateBusinessOwnerRequest>) {
  return service.patch(`/business-owners/${ownerId}`, params);
}

export async function createBusinessOwner(params: Readonly<CreateOrUpdateBusinessOwnerRequest>) {
  return service.post<ControllerError>(`/business-owners/create`, params);
}

export async function updateBusinessOwner(params: Readonly<CreateOrUpdateBusinessOwnerRequest>) {
  return service.patch(`/business-owners/update`, params);
}

export async function listBusinessOwners() {
  return (await service.get<BusinessOwner[]>(`/business-owners/list`)).data;
}

export async function triggerBusinessOwners() {
  return service.post(`/business-owners/trigger-all-owners-provided`, {
    noOtherOwnersToProvide: true,
    noExecutiveToProvide: true,
  });
}

export async function getApplicationReviewRequirements() {
  return (await service.get<Readonly<ManualReviewResponse>>('/application-review/requirement')).data;
}
