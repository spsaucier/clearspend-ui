/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { IntegrationAccountResponse } from '../ChartOfAccountsData/types';

import type { IntegrationAccountMap } from './types';

export const getAccountType = (account: IntegrationAccountResponse) => {
  const codatCategorization = account.fullyQualifiedName.split('.');
  return codatCategorization[codatCategorization.length - 2];
};

export const generateInitialCategoryMap = (accounts: IntegrationAccountResponse[]) => {
  const categoryMap: IntegrationAccountMap = {};
  accounts.forEach((account) => {
    categoryMap[account.id] = null;
  });
  return categoryMap;
};
