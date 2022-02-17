import { Text } from 'solid-i18n';
import { useContext } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { BusinessContext } from 'app/containers/Main/context';

export function AddCreditCardForm() {
  const { business, signupUser, mutate } = useContext(BusinessContext)!;

  const onClick = async () => {
    mutate([signupUser(), { ...business(), accountingSetupStep: 'COMPLETE' }]);
  };

  return (
    <Page title={<Text message="Add Credit Card" />}>
      <Button onClick={onClick}>Complete Setup</Button>
    </Page>
  );
}
