import type { DeepReadonly } from 'solid-js/store';

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
  onCancel?: () => void;
  onSkip?: () => void;
  setShowRoadblock?: (newValue: boolean) => void;
  setUnselectedCategories?: (newValue: (number | undefined)[]) => void;
  setRoadblockRequestParameters?: (newValue: DeepReadonly<IntegrationAccountMapping | null>[]) => void;
  saveOnChange?: boolean;
}

export function ChartOfAccountsData(props: Readonly<ChartOfAccountsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <ChartOfAccountsTable
        data={props.data?.results!}
        mappings={props.mappings?.results}
        onSave={props.onSave}
        onCancel={props.onCancel}
        setShowRoadblock={props.setShowRoadblock}
        setUnselectedCategories={props.setUnselectedCategories}
        setRoadblockRequestParameters={props.setRoadblockRequestParameters}
        saveOnChange={props.saveOnChange || false}
      />
    </Data>
  );
}
