import { Text } from 'solid-i18n';

import { Box } from 'signup/components/Box';
import { Header } from 'signup/components/Header';
import { Description } from 'signup/components/Description';

import logo from '../../assets/logo-name.svg';

import css from './HardFail.css';

export function HardFail() {
  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={120} height={34} />
      </header>
      <div class={css.content}>
        <Box>
          <Header>We're sorry</Header>
          <Description>
            <Text message="A risk was detected on our collaboration, and we will not be able to continue this process." />
          </Description>
        </Box>
      </div>
    </section>
  );
}
