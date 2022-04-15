import { Text } from 'solid-i18n';

import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';

import css from './ChartOfAccountsUpdateBar.css';

interface UpdateBarProps {
  count: number;
  setViewingDetailsDrawer: (open: boolean) => void;
  onDismiss: () => void;
}

export function ChartOfAccountsUpdateBar(props: UpdateBarProps) {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <div class={css.countContainerOuter}>
          <div class={css.countContainer}>
            <Icon name="information" />
            <Text
              message={`There ${props.count > 1 ? `are ${props.count} new updates` : `is 1 new update`}
            to your QuickBooks Online chart of accounts`}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              props.setViewingDetailsDrawer(true);
            }}
          >
            <Text message={'View Updates'} />
          </Button>
          <Button onClick={props.onDismiss} view={'ghost'}>
            <Text message={'Dismiss'} />
          </Button>
        </div>
      </div>
    </div>
  );
}
