import { useI18n, Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { Button } from '_common/components/Button';
import { useMessages } from 'app/containers/Messages/context';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import type { BankAccount } from 'generated/capital';

import css from './AccountItem.css';

interface AccountItemProps {
  data: Readonly<Required<BankAccount>>;
  onUnlink: (id: string) => Promise<void>;
}

export function AccountItem(props: Readonly<AccountItemProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, unlink] = wrapAction(props.onUnlink);

  const onUnlink = () => {
    unlink(props.data.businessBankAccountId).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  return (
    <div>
      <div class={css.card}>
        {/* TODO: render Bank logo */}
        <div class={css.cardName}>{props.data.name}</div>
        <div class={css.cardNumber}>{formatAccountNumber(props.data.accountNumber)}</div>
      </div>
      {/* TODO: expose bank name, type, status - see CAP-579
      <div class={css.info}>
        <Text message="Bank name" class={css.infoLabel!} />: [Bank name]
      </div>
      <div class={css.info}>
        <Text message="Account type" class={css.infoLabel!} />: [Account type]
      </div>
      <div class={css.info}>
        <Text message="Status" class={css.infoLabel!} />: [Status]
      </div> */}

      {/* TODO: unlink button - see CAP-578 */}
      <Button
        size="lg"
        icon="trash"
        type="danger"
        view="second"
        loading={loading()}
        class={css.unlink}
        onClick={onUnlink}
      >
        <Text message="Unlink Account" />
      </Button>
    </div>
  );
}
