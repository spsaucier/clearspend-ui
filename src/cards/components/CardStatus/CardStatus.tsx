import { createMemo, Show } from 'solid-js';
import { useI18n, defineMessages } from 'solid-i18n';
import type { I18nMessage } from 'i18n-mini/lib/types';

import { Tag, TagProps } from '_common/components/Tag';
import { Icon, IconName } from '_common/components/Icon';
import type { Card } from 'generated/capital';

interface Settings {
  type: Required<TagProps>['type'];
  icon: keyof typeof IconName;
  title: I18nMessage;
}

const MESSAGES = defineMessages({
  active: { message: 'Active' },
  inactive: { message: 'Frozen' },
  cancelled: { message: 'Cancelled' },
  notActivated: { message: 'Not Activated' },
});

type Status = Required<Card>['status'];

const MAP: Readonly<Record<Status, Settings>> = {
  ACTIVE: { type: 'success', icon: 'freeze', title: MESSAGES.active },
  INACTIVE: { type: 'danger', icon: 'freeze', title: MESSAGES.inactive },
  CANCELLED: { type: 'danger', icon: 'freeze', title: MESSAGES.cancelled },
};

interface CardStatusProps {
  status: Status;
  activated: boolean;
  class?: string;
}

export function CardStatus(props: Readonly<CardStatusProps>) {
  const i18n = useI18n();

  const settings = createMemo<Settings>(() =>
    props.activated ? MAP[props.status] : { type: 'default', icon: 'warning-triangle', title: MESSAGES.notActivated },
  );

  return (
    <Show when={settings()}>
      <Tag size="xs" type={settings().type} class={props.class}>
        <Icon name={settings().icon} size="xs" />
        <span>{i18n.t(settings().title)}</span>
      </Tag>
    </Show>
  );
}
