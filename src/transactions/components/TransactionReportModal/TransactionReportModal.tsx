import { Text } from 'solid-i18n';
import { createEffect, createSignal, Show } from 'solid-js';

import { Modal, ModalCard } from '_common/components/Modal';
import { Button } from '_common/components/Button';
import { Link } from '_common/components/Link';
import { Icon } from '_common/components/Icon';
import { getCard } from 'cards/services';
import { getUser } from 'employees/services';
import { useResource } from '_common/utils/useResource';

import { useBusiness } from '../../../app/containers/Main/context';

import css from './TransactionReportModal.css';

export interface ReportModalViewProps {
  open: boolean;
  onClose: () => void;
  activityId: string | undefined;
  userEmail?: string | undefined;
  cardId?: string;
}

export function TransactionReportModal(props: ReportModalViewProps) {
  const { business } = useBusiness();
  const [email, setEmail] = createSignal(props.userEmail);
  createEffect(() => {
    setEmail(props.userEmail);
  });

  // Unfortunately, AccountActivityResponse does not include user email,
  // so we have to go thru card -> user to get it
  if (props.open && !email() && props.cardId) {
    const [data] = useResource(getCard, props.cardId);
    const [user, , , setUserID] = useResource(getUser, undefined, false);
    createEffect(() => {
      if (data()?.card.userId) {
        setUserID(data()!.card.userId!);
      }
    });
    createEffect(() => {
      if (user()?.email) {
        setEmail(user()?.email);
      }
    });
  }

  return (
    <Modal isOpen={props.open} onClose={props.onClose}>
      <ModalCard
        title={<Text message="Report an issue" />}
        actions={
          <>
            <Show when={email() && props.activityId && business().legalName}>
              <Button
                wide
                type="primary"
                class={css.firstButton}
                target="_blank"
                href={`https://share.hsforms.com/169oyZhC0RsOCNdyJSgq2Iwc7tw6?TICKET.transaction_id=${encodeURIComponent(
                  props.activityId!,
                )}&company=${encodeURIComponent(business().legalName!)}&email=${encodeURIComponent(email()!)}`}
              >
                <Text message="Open a dispute" />
              </Button>
            </Show>
            <Button wide onClick={props.onClose}>
              <Text message="Go back" />
            </Button>
          </>
        }
      >
        <Text message="See something wrong with a transaction? Let us know." class={css.text!} />
        <Show when={!email() || !props.activityId || !business().legalName}>
          <div class={css.links}>
            <div class={css.link}>
              <Icon size="sm" name="email" />
              <Link href="mailto:disputes@clearspend.com">disputes@clearspend.com</Link>
            </div>
            <div class={css.link}>
              <Icon size="sm" name="phone" />
              <Link href="tel:+18553700660">(855) 370-0660</Link>
            </div>
          </div>
        </Show>
      </ModalCard>
    </Modal>
  );
}
