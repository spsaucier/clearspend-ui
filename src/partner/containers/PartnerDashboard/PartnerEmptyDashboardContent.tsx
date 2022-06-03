import { Text } from 'solid-i18n';

import logo from 'app/assets/logo-green.svg';
import cube from 'app/assets/cube.svg';
import { Button } from '_common/components/Button';

import css from './PartnerEmptyDashboardContent.css';

export function PartnerEmptyDashboardContent() {
  return (
    <div class={css.root}>
      <img class={css.logo} src={logo} alt="Company logo" width={189} height={70} />
      <img class={css.cube} src={cube} alt="Clear Spend" />

      <Text message="No accounts active" />
      <Text message="Let's make this official, and get your account set up" />
      <div class={css.btnWrapper}>
        <Button type="primary" size="lg" icon="add">
          Create new Client
        </Button>
        <Button type="default" size="lg" icon="email">
          Send Client Invitation
        </Button>
      </div>
    </div>
  );
}
