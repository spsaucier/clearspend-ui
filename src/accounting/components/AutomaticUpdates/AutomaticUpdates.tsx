import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { SwitchBox } from 'app/components/SwitchBox';
import { AutoUpdatesStatus } from 'app/types/businesses';
import { postAutoUpdatesStatus } from 'accounting/services';

import css from './AutomaticUpdates.css';

interface AutomaticUpdatesProps {
  name: Readonly<string>;
}

export function AutomaticUpdates(props: Readonly<AutomaticUpdatesProps>) {
  const [autoUpdatesStatus, setAutoUpdatesStatus] = createSignal<AutoUpdatesStatus>(AutoUpdatesStatus.OFF);

  const toggleAutoUpdatesStatus = async (status: AutoUpdatesStatus) => {
    try {
      await postAutoUpdatesStatus({ autoUpdateStatus: status });
    } catch {
      // TODO: handle error
    }
  };

  const onToggleAutomaticStatus = () => {
    autoUpdatesStatus() === AutoUpdatesStatus.ON
      ? setAutoUpdatesStatus(AutoUpdatesStatus.OFF)
      : setAutoUpdatesStatus(AutoUpdatesStatus.ON);
    toggleAutoUpdatesStatus(autoUpdatesStatus());
  };

  return (
    <div class={css.root}>
      <SwitchBox
        checked={autoUpdatesStatus() === AutoUpdatesStatus.ON}
        label={<Text message="Automatic updates" />}
        onChange={() => onToggleAutomaticStatus()}
        name={props.name}
      ></SwitchBox>
    </div>
  );
}
