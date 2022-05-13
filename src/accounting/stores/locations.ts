import { getLocationsForBusiness } from 'accounting/services';
import { create } from '_common/utils/store';

export const useLocations = create(getLocationsForBusiness);
