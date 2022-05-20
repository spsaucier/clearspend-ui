import { Text } from 'solid-i18n';

import img1 from './assets/img1.svg';
import img2 from './assets/img2.svg';
import img3 from './assets/img3.svg';

import css from './EasyStarted.css';

export default function AccountingPartnership() {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <h3 class={css.title}>
          <Text message="Clearspend's Accounting Firm Partnership" />
        </h3>
        <ul class={css.list}>
          <li class={css.item}>
            <img src={img1} width="32" alt="Lorem ipsum dolor sit amet" height="32" class={css.icon} />
            <Text message="Lorem ipsum dolor sit amet" class={css.name!} />
            <Text message="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet." />
          </li>
          <li class={css.item}>
            <img src={img2} alt="No Credit Check" width="32" height="32" class={css.icon} />
            <Text message="Lorem ipsum dolor sit amet" class={css.name!} />
            <Text message="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet." />
          </li>
          <li class={css.item}>
            <img src={img3} alt="No Fees" width="32" height="32" class={css.icon} />
            <Text message="Lorem ipsum dolor sit amet" class={css.name!} />
            <Text message="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet." />
          </li>
        </ul>
      </div>
    </div>
  );
}
