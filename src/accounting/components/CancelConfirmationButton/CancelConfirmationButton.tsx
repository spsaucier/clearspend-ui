import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';

import css from './CancelConfirmationButton.css';

interface CancelConfirmationButtonProps {
  onCancel: () => void;
}

export function CancelConfirmationButton(props: Readonly<CancelConfirmationButtonProps>) {
  return (
    <Confirm
      position="top-center"
      question={
        <div>
          <Text message="Are you sure you want to cancel setup?" class={css.popupTitle!} />
          <Text
            message="Cancelling will remove any added cards and unlink your quickbooks account."
            class={css.popupContent!}
          />
        </div>
      }
      confirmText={<Text message="Cancel Setup" />}
      onConfirm={props.onCancel}
    >
      {(args) => (
        <Button view="ghost" {...args}>
          <Text message="Cancel" />
        </Button>
      )}
    </Confirm>
  );
}
