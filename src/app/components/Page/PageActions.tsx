import { JSXElement, useContext } from 'solid-js';

import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';
import { FormContext } from '_common/components/Form/Form';

import { CustomPageActions } from './CustomPageActions';

export interface PageActionsProps {
  action?: JSXElement;
  onCancel: () => void;
  onSave: () => Promise<unknown>;
}

export function PageActions(props: Readonly<PageActionsProps>) {
  const [loading, action] = wrapAction(props.onSave);
  const formContext = useContext(FormContext);

  return (
    <CustomPageActions>
      <>
        <Button view="ghost" disabled={loading()} onClick={props.onCancel}>
          Cancel
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
          {props.action || 'Apply Changes'}
        </Button>
      </>
    </CustomPageActions>
  );
}
