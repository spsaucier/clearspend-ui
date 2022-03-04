import type { FlattenedIntegrationAccount, IntegrationAccount } from '../ChartOfAccountsData/types';

import type { IntegrationAccountMap } from './types';

export const getAccountType = (account: FlattenedIntegrationAccount) => {
  return account.fullyQualifiedCategory.split('.').pop();
};

export const generateInitialCategoryMap = (accounts: IntegrationAccount[]) => {
  const categoryMap: IntegrationAccountMap = {};
  accounts.forEach((account) => {
    categoryMap[account.id] = null;
  });
  return categoryMap;
};

export const flattenNestedIntegrationAccounts = (
  accounts: IntegrationAccount[],
  currentLevel = 1,
): FlattenedIntegrationAccount[] => {
  return accounts.reduce<FlattenedIntegrationAccount[]>((flattenedAccounts, currentValue) => {
    let newArray = flattenedAccounts;
    newArray.push({ ...currentValue, level: currentLevel });
    if (currentValue.children.length) {
      const nestedAccounts = flattenNestedIntegrationAccounts(currentValue.children, currentLevel + 1);
      newArray = newArray.concat(nestedAccounts);
    }
    return newArray;
  }, []);
};
