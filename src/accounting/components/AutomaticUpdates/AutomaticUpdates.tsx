import { Text } from 'solid-i18n';
import type { Accessor, Setter } from 'solid-js';

import { SwitchBox } from 'app/components/SwitchBox';
import { AUTO_UPDATES_STATUS } from 'accounting/types';

import css from './AutomaticUpdates.css';

interface AutomaticUpdatesProps {
  name: Readonly<string>;
  value: Accessor<AUTO_UPDATES_STATUS>;
  setAutomaticUpdates: Setter<AUTO_UPDATES_STATUS>;
}

export function AutomaticUpdates(props: Readonly<AutomaticUpdatesProps>) {
  const onToggleAutomaticStatus = (value: string) => {
    return () => {
      value === AUTO_UPDATES_STATUS.ON
        ? props.setAutomaticUpdates(AUTO_UPDATES_STATUS.OFF)
        : props.setAutomaticUpdates(AUTO_UPDATES_STATUS.ON);
    };
  };

  return (
    <div class={css.root}>
      <SwitchBox
        checked={props.value.toString() === AUTO_UPDATES_STATUS.ON}
        label={<Text message="Automatic updates" />}
        onChange={onToggleAutomaticStatus(props.value.toString())}
        name={props.name}
      ></SwitchBox>
    </div>
  );
}
