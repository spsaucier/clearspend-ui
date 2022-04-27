import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { SwitchBox } from 'app/components/SwitchBox';
import { postAutoCreateExpenseCategories } from 'accounting/services';
import { useBusiness } from 'app/containers/Main/context';

import css from './AutomaticUpdates.css';

interface AutomaticUpdatesProps {
  name: Readonly<string>;
}

export function AutomaticUpdates(props: Readonly<AutomaticUpdatesProps>) {
  const business = useBusiness();
  const [autoUpdatesStatus, setAutoUpdatesStatus] = createSignal<boolean>(
    business.business().autoCreateExpenseCategories !== undefined
      ? business.business().autoCreateExpenseCategories!
      : false,
  );

  const toggleAutoUpdatesStatus = async (status: boolean) => {
    try {
      await postAutoCreateExpenseCategories({ autoCreateExpenseCategories: status });
    } catch {
      // TODO: handle error
    }
  };

  const onToggleAutomaticStatus = () => {
    autoUpdatesStatus() ? setAutoUpdatesStatus(false) : setAutoUpdatesStatus(true);
    toggleAutoUpdatesStatus(autoUpdatesStatus());
  };

  return (
    <div class={css.root}>
      <SwitchBox
        checked={autoUpdatesStatus()}
        label={<Text message="Automatic updates" />}
        onChange={() => onToggleAutomaticStatus()}
        name={props.name}
      ></SwitchBox>
    </div>
  );
}
