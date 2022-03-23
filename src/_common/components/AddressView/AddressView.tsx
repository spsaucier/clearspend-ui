import { Show, type JSXElement } from 'solid-js';

import type { Address } from 'generated/capital';

import { Icon, IconName } from '../Icon';
import { join } from '../../utils/join';
import { formatAddress } from '../../formatters/address';

import css from './AddressView.css';

export interface AddressViewProps {
  label?: JSXElement;
  icon?: keyof typeof IconName;
  address: Readonly<Address>;
  class?: string;
}

export function AddressView(props: Readonly<AddressViewProps>) {
  return (
    <div class={join(css.root, props.class)}>
      {props.icon && <Icon name={props.icon} class={css.icon} />}
      <div>
        <Show when={props.label}>
          <div class={css.label}>{props.label}</div>
        </Show>
        <div class={css.address}>{formatAddress(props.address)}</div>
      </div>
    </div>
  );
}
