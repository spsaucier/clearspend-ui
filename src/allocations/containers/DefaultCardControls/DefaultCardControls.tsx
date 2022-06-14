import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { useMCC } from 'app/stores/mcc';
import type { AllocationDetailsResponse, UpdateAllocationRequest } from 'generated/capital';

import { DefaultCardControlsForm } from '../../components/DefaultCardControlsForm';

interface DefaultCardControlsProps {
  allocationId: string;
  data: Readonly<Required<AllocationDetailsResponse>>;
  disabled?: boolean;
  onSave: (allocationId: string, data: Readonly<UpdateAllocationRequest>) => Promise<unknown>;
}

export function DefaultCardControls(props: Readonly<DefaultCardControlsProps>) {
  const mcc = useMCC();

  return (
    <Data data={mcc.data} loading={mcc.loading} error={mcc.error} onReload={mcc.reload}>
      <Section
        title={<Text message="Default Card Controls" />}
        description={
          <Text
            message={
              'Set default limits for how much can be spent with cards in this allocation. ' +
              'These can be customized when issuing new cards.'
            }
          />
        }
      >
        <DefaultCardControlsForm
          data={props.data}
          mccCategories={mcc.data!}
          allocationId={props.allocationId}
          disabled={props.disabled}
          onSave={(values) => props.onSave(props.allocationId, values)}
        />
      </Section>
    </Data>
  );
}
