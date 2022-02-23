/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { IntegrationAccountResponse } from '../ChartOfAccountsData/types';

export const getAccountType = (account: IntegrationAccountResponse) => {
  const codatCategorization = account.fullyQualifiedName.split('.');
  return codatCategorization[codatCategorization.length - 2];
};
