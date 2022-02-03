import { formatPhone } from '_common/formatters/phone';
import { formatAddress } from '_common/formatters/address';
import { Icon } from '_common/components/Icon';
import type { User } from 'generated/capital';

import { formatName } from '../../utils/formatName';

import css from './ProfileInfo.css';

interface ProfileInfoProps {
  data: Readonly<Required<User>>;
  class?: string;
}

export function ProfileInfo(props: Readonly<ProfileInfoProps>) {
  return (
    <div class={props.class}>
      <div class={css.item}>
        <Icon name="user" size="sm" />
        <span>{formatName(props.data)}</span>
      </div>
      <div class={css.item}>
        <Icon name="email" size="sm" />
        <span>{props.data.email}</span>
      </div>
      <div class={css.item}>
        <Icon name="phone" size="sm" />
        <span>{formatPhone(props.data.phone)}</span>
      </div>
      <div class={css.item}>
        <Icon name="pin" size="sm" />
        <span class={css.address}>{formatAddress(props.data.address)}</span>
      </div>
    </div>
  );
}
