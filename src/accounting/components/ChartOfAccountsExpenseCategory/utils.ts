import type { ExpenseCategory } from 'generated/capital';

import type { FlattenedIntegrationAccount } from '../ChartOfAccountsTable/types';

export function createPathSegments(
  accounts: readonly Readonly<FlattenedIntegrationAccount>[],
  parentId: string | undefined,
): string[] {
  let next = parentId;
  const result: string[] = [];

  while (next) {
    // eslint-disable-next-line no-loop-func
    const parent = accounts.find((item) => item.id === next);
    if (parent) result.push(parent.name!);
    next = parent?.parentId;
  }

  return result.reverse();
}

export function createFakeCategory(
  account: Readonly<FlattenedIntegrationAccount>,
  accounts: readonly Readonly<FlattenedIntegrationAccount>[],
): Readonly<ExpenseCategory> {
  return {
    expenseCategoryId: account.name,
    categoryName: account.name,
    pathSegments: createPathSegments(accounts, account.parentId),
  };
}
