import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { SwitchBox } from 'app/components/SwitchBox';
import { postAutoCreateExpenseCategories } from 'accounting/services';
import { useBusiness } from 'app/containers/Main/context';

interface AutomaticUpdatesProps {
  name: Readonly<string>;
  class?: string;
}

export function AutomaticUpdates(props: Readonly<AutomaticUpdatesProps>) {
  const { business, mutate } = useBusiness();
  const [autoUpdatesStatus, setAutoUpdatesStatus] = createSignal<boolean>(
    business().autoCreateExpenseCategories !== undefined ? business().autoCreateExpenseCategories! : false,
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
    mutate({ business: { ...business(), autoCreateExpenseCategories: autoUpdatesStatus() } });
  };

  return (
    <div class={props.class}>
      <SwitchBox
        checked={autoUpdatesStatus()}
        label={<Text message="Automatic updates" />}
        onChange={() => onToggleAutomaticStatus()}
        name={props.name}
      ></SwitchBox>
    </div>
  );
}
