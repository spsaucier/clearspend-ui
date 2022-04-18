import type { BusinessNotification, CodatAccountNested } from 'generated/capital';

import type { FlattenedIntegrationAccount } from '../ChartOfAccountsData/types';

import type { IntegrationAccountMap } from './types';

export const getAccountType = (account: FlattenedIntegrationAccount) => {
  return account.fullyQualifiedCategory?.split('.').pop();
};

export const generateInitialCategoryMap = (accounts: CodatAccountNested[]) => {
  const categoryMap: IntegrationAccountMap = {};
  accounts.forEach((account) => {
    categoryMap[account.id!] = null;
  });
  return categoryMap;
};

export const flattenNestedIntegrationAccounts = (
  accounts: CodatAccountNested[],
  notifications: Readonly<BusinessNotification[]>,
  currentLevel = 1,
): FlattenedIntegrationAccount[] => {
  return accounts.reduce<FlattenedIntegrationAccount[]>((flattenedAccounts, currentValue) => {
    let newArray = flattenedAccounts;
    newArray.push({
      ...currentValue,
      level: currentLevel,
      hasChildren: currentValue.children?.length !== 0,
      isNew:
        notifications.findIndex(
          (notification) =>
            notification.type === 'CHART_OF_ACCOUNTS_CREATED' &&
            notification.data?.newValue &&
            notification.data.newValue === currentValue.fullyQualifiedName,
        ) !== -1,
    });
    if (currentValue.children?.length) {
      const nestedAccounts = flattenNestedIntegrationAccounts(currentValue.children!, notifications, currentLevel + 1);
      newArray = newArray.concat(nestedAccounts);
    }
    return newArray;
  }, []);
};
