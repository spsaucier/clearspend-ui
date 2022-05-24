import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { useMCC } from 'app/stores/mcc';

import { CardControlsForm } from '../../components/CardControlsForm';
import type { ControlsData } from '../../types';

interface CardControlsProps {
  id: string;
  allocationId?: string;
  data: Readonly<ControlsData>;
  disabled?: boolean;
  onSave: (allocationId: string, data: Readonly<ControlsData>) => Promise<unknown>;
}

export function CardControls(props: Readonly<CardControlsProps>) {
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
        <CardControlsForm
          data={props.data}
          mccCategories={mcc.data!}
          allocationId={props.allocationId}
          disabled={props.disabled}
          onSave={(values) => props.onSave(props.id, values)}
        />
      </Section>
    </Data>
  );
}
