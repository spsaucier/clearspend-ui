import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { Page } from 'app/components/Page';
import { CancelConfirmationButton } from 'accounting/components/CancelConfirmationButton';
import { Button } from '_common/components/Button';

import css from './ClassesSetup.css';

interface ClassesSetupProps {
  onNext: () => void;
  onCancel: () => void;
}

export function ClassesSetup(props: ClassesSetupProps) {
  return (
    <div class={css.root}>
      <Page contentClass={css.pageContent} title={<Text message="Set up your QuickBooks Online integration" />}>
        <div class={css.pageBody}>
          <div></div>
          <div class={css.tableButtons}>
            <Show when={!!props.onCancel}>
              <CancelConfirmationButton onCancel={props.onCancel!} />
            </Show>
            <Button class={css.done} type="primary" icon={{ name: 'confirm', pos: 'right' }} onClick={props.onNext}>
              <Text message="Save changes" />
            </Button>
          </div>
        </div>
      </Page>
    </div>
  );
}
