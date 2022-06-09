import { Text, useI18n } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { SwitchBox } from 'app/components/SwitchBox';
import { postClassCategoryRequired } from 'accounting/services';
import { useBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';

interface EnableClassCategoryProps {
  name: Readonly<string>;
  class?: string;
}

export function EnableClassCategory(props: Readonly<EnableClassCategoryProps>) {
  const { business, mutate } = useBusiness();
  const [enableClassStatus, setEnableClassStatus] = createSignal<boolean>(
    business().classRequiredForSync !== undefined ? business().classRequiredForSync! : false,
  );

  const messages = useMessages();
  const i18n = useI18n();
  const toggleClassStatus = async (status: boolean) => {
    try {
      await postClassCategoryRequired({ autoCreateExpenseCategories: status });
    } catch {
      messages.error({ title: i18n.t('Something went wrong') });
    }
  };

  const onToggleClassStatus = () => {
    enableClassStatus() ? setEnableClassStatus(false) : setEnableClassStatus(true);
    toggleClassStatus(enableClassStatus());
    mutate({ business: { ...business(), classRequiredForSync: enableClassStatus() } });
  };

  return (
    <div class={props.class}>
      <SwitchBox
        checked={enableClassStatus()}
        label={<Text message="Class Required For Sync" />}
        onChange={() => onToggleClassStatus()}
        name={props.name}
      ></SwitchBox>
    </div>
  );
}
