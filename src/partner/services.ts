import { service } from 'app/utils/service';
import type { PartnerBusiness } from 'generated/capital';

export async function getClientsForPartner() {
  return (await service.get<Readonly<PartnerBusiness>[]>(`/partner/businesses`)).data;
}

export async function getPinsForPartner() {
  return (await service.get<Readonly<PartnerBusiness>[]>(`/partner/pins`)).data;
}
