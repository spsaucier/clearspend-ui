import { Data } from 'app/components/Data';

import { ChartOfAccountsTable } from '../ChartOfAccountsTable';
import type { IntegrationAccountMapping } from '../ChartOfAccountsTable/types';

import type { IntegrationAccountResponse, IntegrationExpenseAccountMappingResponse } from './types';

interface ChartOfAccountsDataProps {
  loading: boolean;
  error: unknown;
  data: Readonly<IntegrationAccountResponse> | null;
  mappings: Readonly<IntegrationExpenseAccountMappingResponse> | null;
  onSave: (mappings: Readonly<IntegrationAccountMapping | null>[]) => void;
  onReload: () => Promise<unknown>;
}

export function ChartOfAccountsData(props: Readonly<ChartOfAccountsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <ChartOfAccountsTable data={props.data?.results!} onSave={props.onSave} />
    </Data>
  );
}
