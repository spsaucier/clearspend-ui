import { Show } from 'solid-js/web';

import { formatPhone } from '_common/formatters/phone';
import { formatAddress } from '_common/formatters/address';
import { DataRow } from 'app/components/DataRow';
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
      <DataRow icon="user">{formatName(props.data)}</DataRow>
      <DataRow icon="email">{props.data.email}</DataRow>
      <DataRow icon="phone">{formatPhone(props.data.phone)}</DataRow>
      <Show when={props.data.address.streetLine1}>
        <DataRow icon="pin" contentClass={css.address}>
          {formatAddress(props.data.address)}
        </DataRow>
      </Show>
    </div>
  );
}
