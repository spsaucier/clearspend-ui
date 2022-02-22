import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';

interface ChartOfAccountsProps {
  onNext: () => void;
}

export function ChartOfAccounts(props: Readonly<ChartOfAccountsProps>) {
  return (
    <div>
      <Button onClick={props.onNext}>
        <Text message="Skip Setup" />
      </Button>
    </div>
  );
}
