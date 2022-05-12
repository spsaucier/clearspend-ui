import { getClassesForBusiness } from 'accounting/services';
import { create } from '_common/utils/store';

export const useClasses = create(getClassesForBusiness);
