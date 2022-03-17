import { Text } from 'solid-i18n';

import img1 from './assets/img1.svg';
import img2 from './assets/img2.svg';
import img3 from './assets/img3.svg';
import img4 from './assets/img4.svg';

import css from './EasyStarted.css';

export default function EasyStarted() {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <h3 class={css.title}>
          <Text message="Easy to get started" />
        </h3>
        <ul class={css.list}>
          <li class={css.item}>
            <img src={img1} width="32" alt="Instant Application" height="32" class={css.icon} />
            <Text message="Instant Application" class={css.name!} />
            <Text message="Any US-based business can sign up. If you have an EIN, you qualify for ClearSpend." />
          </li>
          <li class={css.item}>
            <img src={img2} alt="No Credit Check" width="32" height="32" class={css.icon} />
            <Text message="No Credit Check" class={css.name!} />
            <Text message="Once we verify your business and owner details, you’re golden." />
          </li>
          <li class={css.item}>
            <img src={img3} alt="No Fees" width="32" height="32" class={css.icon} />
            <Text message="No Fees" class={css.name!} />
            <Text message="ClearSpend is free to businesses of any size. There are no monthly fees, transaction fees, interest charges, or card issuing fees." />
          </li>
          <li class={css.item}>
            <img src={img4} alt="Bank Funded" width="32" height="32" class={css.icon} />
            <Text message="Bank Funded" class={css.name!} />
            <Text message="Fund your ClearSpend account from your business bank account. ClearSpend supports most US banks." />
          </li>
        </ul>
      </div>
    </div>
  );
}
