import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';

import css from './TransactionReportModal.css';

export interface ReportModalViewProps {
  onGoBack: () => void;
}

export function TransactionReportModal(props: ReportModalViewProps) {
  function preventClickBubbling(e: MouseEvent | TouchEvent) {
    e.stopPropagation();
  }

  return (
    <div class={css.card} onClick={preventClickBubbling}>
      <h4>
        <Text message="Report an issue" />
      </h4>
      <p>
        <Text message="See something wrong with a transaction? Let us know." />
      </p>
      <div class={css.info}>
        <div>
          <Icon size="xs" name="email" />
          <a href="mailto:disputes@clearspend.com">disputes@clearspend.com</a>
        </div>
        <div>
          <Icon size="xs" name="phone" />
          <a href="tel:+18553700660">(855) 370-0660</a>
        </div>
      </div>
      <Button onClick={props.onGoBack} wide={true}>
        <Text message="Go back" />
      </Button>
    </div>
  );
}
