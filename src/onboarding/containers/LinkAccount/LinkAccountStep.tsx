import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Button } from '_common/components/Button';

import { LinkAccount } from '.';

import css from './LinkAccountStep.css';

interface LinkAccountStepProps {
  onSuccess: (token: string, accountName?: string | undefined) => Promise<unknown>;
  skipDeposit: () => {};
  onCheckVerification: () => void;
  disabled: boolean;
}

export default function LinkAccountStep(props: LinkAccountStepProps) {
  return (
    <Section
      title={<Text message="Connect your bank" />}
      description={
        <Text message="Connecting your bank account brings you one step closer to becoming an expense management superstar." />
      }
      contentClass={css.verifySectionContent}
      class={css.root}
    >
      <Show when={props.disabled}>
        <div class={css.wrapper}>
          <Button type="primary" onClick={props.onCheckVerification} data-name="check-verification-status">
            <Text message="Check verification status" />
          </Button>
        </div>
      </Show>
      <LinkAccount verifyOnLoad={false} onSuccess={props.onSuccess} disabled={props.disabled} />

      <h3 class={css.heading}>
        <Text message="Don’t want to connect a bank account now?" />
      </h3>
      <p>
        <Text message="You can connect your back later, or we'll set up a virtual account that you can fund via ACH or wire transfer." />
      </p>
      <p>
        <Text message="Note: Your virtual account will be ready in about 30 minutes." />
      </p>
      <Button view="outline" onClick={props.skipDeposit}>
        <Text message="Skip bank verification" />
      </Button>
    </Section>
  );
}
