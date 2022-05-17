import { Data } from 'app/components/Data';
import type { AddChartOfAccountsMappingRequest, BusinessNotification } from 'generated/capital';

import { ChartOfAccountsTable } from '../ChartOfAccountsTable';
import {
  useIntegrationExpenseCategoryMappings,
  useStoredIntegrationExpenseCategories,
} from '../../stores/integrationExpenseCategories';
import { useExpenseCategories } from '../../stores/expenseCategories';

interface ChartOfAccountsDataProps {
  newCategories?: readonly Readonly<BusinessNotification>[] | null;
  saveOnChange?: boolean;
  showUpdateButton?: boolean;
  onSave: (mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[]) => void;
  onSetRoadblock?: (
    mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[],
    unmappedIds: readonly string[],
  ) => void;
  onCancel?: () => void;
}

export function ChartOfAccountsData(props: Readonly<ChartOfAccountsDataProps>) {
  const data = useStoredIntegrationExpenseCategories();
  const mappings = useIntegrationExpenseCategoryMappings();
  const categories = useExpenseCategories();

  return (
    <Data
      data={data.data && mappings.data && categories.data}
      loading={data.loading || mappings.loading || categories.loading}
      error={data.error || mappings.error || categories.error}
      onReload={async () =>
        Promise.all([
          data.error && data.reload(),
          mappings.error && mappings.reload(),
          categories.error && categories.reload(),
        ])
      }
    >
      <ChartOfAccountsTable
        newCategories={props.newCategories || null}
        data={data.data!.results!}
        mappings={mappings.data!.results!}
        categories={categories.data!}
        showUpdateButton={props.showUpdateButton}
        saveOnChange={props.saveOnChange}
        onSave={props.onSave}
        onSetRoadblock={props.onSetRoadblock}
        onCancel={props.onCancel}
      />
    </Data>
  );
}
