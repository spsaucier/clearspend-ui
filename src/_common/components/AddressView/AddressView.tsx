import { Text } from 'solid-i18n';

import type { Address } from 'generated/capital';
import { join } from '_common/utils/join';

import { Icon, IconName } from '../Icon';

import css from './AddressView.css';

export interface AddressViewProps {
  label?: string;
  icon?: keyof typeof IconName;
  address: Address;
  addressClass?: string;
}

export function AddressView(props: Readonly<AddressViewProps>) {
  return (
    <div class={css.root}>
      {props.icon && <Icon name={props.icon} class={css.icon} />}
      <div>
        {props.label && (
          <div class={css.label}>
            <Text message={props.label} />
          </div>
        )}
        <div class={join(css.address, props.addressClass)}>
          {props.address.streetLine1}
          <br />
          {props.address.streetLine2 ? (
            <>
              {props.address.streetLine2}
              <br />
            </>
          ) : null}
          {props.address.locality}, {props.address.region} {props.address.postalCode}
        </div>
      </div>
    </div>
  );
}
