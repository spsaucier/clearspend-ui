import { Show, useContext } from 'solid-js';
import { Text } from 'solid-i18n';

import type { PageActionsProps } from 'app/components/Page/PageActions';
import { Button } from '_common/components/Button';
import { FormContext } from '_common/components/Form/Form';
import { wrapAction } from '_common/utils/wrapAction';

import type { FormValues } from './types';

interface CreateCardActionsProps extends PageActionsProps {
  next: () => void;
  prev: () => void;
  values: FormValues;
  errors: Readonly<Partial<Record<keyof FormValues, string>>>;
  current: number;
  nextDisabled: boolean;
  nextLoading: boolean;
}

const MAX_INDEX = 2;

export const CreateCardActions = (props: CreateCardActionsProps) => {
  const [loading, action] = wrapAction(props.onSave);
  const formContext = useContext(FormContext);
  return (
    <Show
      when={props.current === MAX_INDEX}
      fallback={
        <>
          <Button view="ghost" disabled={loading()} onClick={props.onCancel}>
            <Text message="Cancel" />
          </Button>
          <Button disabled={loading() || props.current === 0} onClick={() => props.prev()}>
            <Text message="Back" />
          </Button>
          <Button
            type="primary"
            icon={{ name: 'arrow-right', pos: 'right' }}
            loading={props.nextLoading || loading()}
            onClick={() => props.next()}
            disabled={props.nextDisabled}
          >
            <Text message="Next" />
          </Button>
        </>
      }
    >
      <>
        <Button view="ghost" disabled={loading()} onClick={props.onCancel}>
          <Text message="Cancel" />
        </Button>
        <Button disabled={loading()} onClick={() => props.prev()}>
          <Text message="Back" />
        </Button>
        <Button
          type="primary"
          icon={{ name: 'confirm', pos: 'right' }}
          loading={loading()}
          onClick={() => {
            action();
            if (formContext.scrollToErrors) {
              formContext.scrollToErrors();
            }
          }}
        >
          {props.action || <Text message="Apply Changes" />}
        </Button>
      </>
    </Show>
  );
};
