import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { formatCardNumber } from 'cards/utils/formatCardNumber';

import css from './LinkedAccountPreview.css';

interface LinkedAccountPreviewProps {
  accountId: string;
}

// TODO Use API to get account info by props.accountId
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LinkedAccountPreview(props: Readonly<LinkedAccountPreviewProps>) {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <div class={css.card}>
          <div class={css.cardName}>[Account name]</div>
          <div class={css.cardNumber}>{formatCardNumber('0000000000000000')}</div>
        </div>
        <h4 class={css.header}>
          <Text message="Account info" />
        </h4>
        <div class={css.info}>
          <Text message="Bank name" class={css.infoLabel!} />
          [Bank name]
        </div>
        <div class={css.info}>
          <Text message="Account type" class={css.infoLabel!} />
          [Account type]
        </div>
        <div class={css.info}>
          <Text message="Status" class={css.infoLabel!} />
          [Status]
        </div>
      </div>
      <Button wide icon="trash" type="danger" view="second">
        <Text message="Remove Account" />
      </Button>
    </div>
  );
}
