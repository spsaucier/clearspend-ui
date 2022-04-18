import type { DeepReadonly } from 'solid-js/store';

import { Data } from 'app/components/Data';
import type {
  AddChartOfAccountsMappingRequest,
  BusinessNotification,
  CodatAccountNestedResponse,
  GetChartOfAccountsMappingResponse,
} from 'generated/capital';

import { ChartOfAccountsTable } from '../ChartOfAccountsTable';

interface ChartOfAccountsDataProps {
  loading: boolean;
  error: unknown;
  data: Readonly<CodatAccountNestedResponse> | null;
  newCategories: Readonly<BusinessNotification[]>;
  mappings: Readonly<GetChartOfAccountsMappingResponse> | null;
  onSave: (mappings: Readonly<AddChartOfAccountsMappingRequest | null>[]) => void;
  onReload: () => Promise<unknown>;
  onCancel?: () => void;
  onSkip?: () => void;
  setShowRoadblock?: (newValue: boolean) => void;
  setUnselectedCategories?: (newValue: (string | undefined)[]) => void;
  setRoadblockRequestParameters?: (newValue: DeepReadonly<AddChartOfAccountsMappingRequest | null>[]) => void;
  saveOnChange?: boolean;
  showDeleted?: boolean;
}

export function ChartOfAccountsData(props: Readonly<ChartOfAccountsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <ChartOfAccountsTable
        data={props.data?.results!}
        newCategories={props.newCategories}
        mappings={props.mappings?.results}
        onSave={props.onSave}
        onCancel={props.onCancel}
        setShowRoadblock={props.setShowRoadblock}
        setUnselectedCategories={props.setUnselectedCategories}
        setRoadblockRequestParameters={props.setRoadblockRequestParameters}
        saveOnChange={props.saveOnChange || false}
        showDeleted={props.showDeleted}
      />
    </Data>
  );
}
