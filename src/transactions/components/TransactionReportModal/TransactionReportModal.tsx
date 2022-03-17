import { Text } from 'solid-i18n';

import { Modal, ModalCard } from '_common/components/Modal';
import { Button } from '_common/components/Button';
import { Link } from '_common/components/Link';
import { Icon } from '_common/components/Icon';

import css from './TransactionReportModal.css';

export interface ReportModalViewProps {
  open: boolean;
  onClose: () => void;
}

export function TransactionReportModal(props: ReportModalViewProps) {
  return (
    <Modal isOpen={props.open} close={props.onClose}>
      <ModalCard
        title={<Text message="Report an issue" />}
        actions={
          <Button wide onClick={props.onClose}>
            <Text message="Go back" />
          </Button>
        }
      >
        <Text message="See something wrong with a transaction? Let us know." class={css.text!} />
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
      </ModalCard>
    </Modal>
  );
}
