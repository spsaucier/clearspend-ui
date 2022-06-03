import { create } from '_common/utils/store';

import { getClientsForPartner, getPinsForPartner } from '../services';

export const usePartnerClients = create(getClientsForPartner);
export const usePartnerPins = create(getPinsForPartner);
