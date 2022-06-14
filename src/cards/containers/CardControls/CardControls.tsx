import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { useMCC } from 'app/stores/mcc';
import type { CardDetailsResponse, UpdateCardSpendControlsRequest } from 'generated/capital';
import { CardControlsForm } from 'cards/components/CardControlsForm/CardControlsForm';

interface CardControlsProps {
  id: string;
  allocationId: string;
  data: Readonly<Required<CardDetailsResponse>> | null;
  disabled?: boolean;
  onSave: (cardId: string, updates: Readonly<UpdateCardSpendControlsRequest>) => Promise<void>;
}

export function CardControls(props: Readonly<CardControlsProps>) {
  const mcc = useMCC();

  return (
    <Data data={mcc.data} loading={mcc.loading} error={mcc.error} onReload={mcc.reload}>
      <Section
        title={<Text message="Card Controls" />}
        description={<Text message={'Set limits for how much can be spent with this card.'} />}
      >
        <Show when={props.data}>
          <CardControlsForm
            data={props.data!}
            mccCategories={mcc.data!}
            disabled={props.disabled}
            onSave={(allocationSpendControls) => props.onSave(props.id, { ...props.data, allocationSpendControls })}
          />
        </Show>
      </Section>
    </Data>
  );
}
