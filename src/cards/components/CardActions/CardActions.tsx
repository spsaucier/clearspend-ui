import { Switch, Match, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { Confirm } from '_common/components/Confirm';
import { Button } from '_common/components/Button';
import { useMessages } from 'app/containers/Messages/context';
import type { User, Card } from 'generated/capital';

import { canActivateCard } from '../../utils/canActivateCard';

interface CardActionsProps {
  user: Readonly<User>;
  card: Readonly<Card>;
  onActivate: () => void;
  onShowDetails: () => void;
  onChangeStatus: (cardId: string, block: boolean) => Promise<unknown>;
}

export function CardActions(props: Readonly<CardActionsProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, changeStatus] = wrapAction(props.onChangeStatus);

  const onChangeStatus = (block: boolean) => {
    changeStatus(props.card.cardId!, block).catch(() => messages.error({ title: i18n.t('Something went wrong') }));
  };

  return (
    <Switch>
      <Match when={!props.card.activated}>
        <Show when={canActivateCard(props.card, props.user)}>
          <Button
            size="lg"
            type="primary"
            icon="card-success"
            disabled={!props.card.issueDate}
            onClick={props.onActivate}
          >
            <Text message="Activate Card" />
          </Button>
        </Show>
      </Match>
      <Match when={props.card.activated}>
        <Button size="lg" icon="view" onClick={props.onShowDetails}>
          <Text message="Card Details" />
        </Button>
        <Switch>
          <Match when={props.card.status === 'ACTIVE'}>
            <Confirm
              position="bottom-right"
              question={
                <Text message="Freezing the card will prevent the cardholder from performing any transactions." />
              }
              confirmText={<Text message="Freeze card now" />}
              onConfirm={() => onChangeStatus(true)}
            >
              {(args) => (
                <Button size="lg" icon="freeze" type="danger" view="second" loading={loading()} onClick={args.onClick}>
                  <Text message="Freeze Card" />
                </Button>
              )}
            </Confirm>
          </Match>
          <Match when={props.card.status === 'INACTIVE'}>
            <Button size="lg" icon="freeze" type="primary" loading={loading()} onClick={() => onChangeStatus(false)}>
              <Text message="Unfreeze Card" />
            </Button>
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
}
