import type { BusinessNotification, CodatAccountNested, ChartOfAccountsMappingResponse } from 'generated/capital';

import type { ChartOfAccountsMap, FlattenedIntegrationAccount } from './types';

export const getAccountType = (account: FlattenedIntegrationAccount) => {
  return account.fullyQualifiedCategory?.split('.')[2];
};

export function isNewAccount(qName: string | undefined, notifications: readonly Readonly<BusinessNotification>[]) {
  return notifications.some((item) => item.type === 'CHART_OF_ACCOUNTS_CREATED' && item.data?.newValue === qName);
}

export function flatCodatAccounts(
  accounts: readonly Readonly<CodatAccountNested>[],
  notifications: readonly Readonly<BusinessNotification>[],
): readonly Readonly<FlattenedIntegrationAccount>[] {
  return accounts.reduce<FlattenedIntegrationAccount[]>((acc, current) => {
    function next(items: CodatAccountNested[], level = 1, parentId?: string) {
      items.forEach((item) => {
        const { children, ...account } = item;
        acc.push({
          ...account,
          isNew: isNewAccount(account.fullyQualifiedName, notifications),
          parentId,
          level,
        });
        if (children?.length) next(children, level + 1, item.id);
      });
    }
    next([current]);
    return acc;
  }, []);
}

export const getCategoryMap = (
  accounts: readonly Readonly<FlattenedIntegrationAccount>[],
  mappings: readonly Readonly<ChartOfAccountsMappingResponse>[],
) => {
  return accounts.reduce<ChartOfAccountsMap>((acc, item) => {
    acc[item.id!] = mappings!.find((mapping) => mapping.accountRef === item.id);
    return acc;
  }, {});
};
