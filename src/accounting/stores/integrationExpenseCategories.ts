import { create } from '_common/utils/store';

import {
  getIntegrationExpenseCategories,
  getIntegrationExpenseCategoryMappings,
  getSavedChartOfAccounts,
} from '../services';

export const useIntegrationExpenseCategories = create(getIntegrationExpenseCategories);
export const useStoredIntegrationExpenseCategories = create(getSavedChartOfAccounts);
export const useIntegrationExpenseCategoryMappings = create(getIntegrationExpenseCategoryMappings);
