import { Data } from 'app/components/Data';

import { ChartOfAccountsTable } from '../ChartOfAccountsTable';

import type { IntegrationAccountResponse } from './types';

interface ChartOfAccountsDataProps {
  loading: boolean;
  error: unknown;
  data: Readonly<IntegrationAccountResponse> | null;
  onReload: () => Promise<unknown>;
}

export function ChartOfAccountsData(props: Readonly<ChartOfAccountsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <ChartOfAccountsTable data={props.data?.results!} />
    </Data>
  );
}
