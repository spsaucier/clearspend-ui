import { create } from '_common/utils/store';

import { getIntegrationExpenseCategories, getIntegrationExpenseCategoryMappings } from '../services';

export const useIntegrationExpenseCategories = create(getIntegrationExpenseCategories);
export const useIntegrationExpenseCategoryMappings = create(getIntegrationExpenseCategoryMappings);
