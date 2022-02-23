import { create } from '_common/utils/store';

import { getIntegrationExpenseCategories } from '../services';

export const useIntegrationExpenseCategories = create(getIntegrationExpenseCategories);
