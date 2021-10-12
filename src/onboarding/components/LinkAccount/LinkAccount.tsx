import { useNavigate } from 'solid-app-router';

import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
import { Section } from 'app/components/Section';

import { VerifyAccount } from '../VerifyAccount';

import css from './LinkAccount.css';

export function LinkAccount() {
  const navigate = useNavigate();
  const media = useMediaContext();

  return (
    <Section
      title="Connect your account"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
    >
      <div class={css.wrapper}>
        <VerifyAccount class={css.verify} />
        <Button type="primary" wide={media.small} onClick={() => navigate('/onboarding/money')}>
          Next
        </Button>
      </div>
    </Section>
  );
}
