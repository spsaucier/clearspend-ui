import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import type { FlattenedIntegrationAccount } from '../ChartOfAccountsTable/types';

import css from './ChartOfAccountsName.css';

const IGNORE_LEVELS = 2;
const LEVEL_PADDING_PX = 18;

interface ChartOfAccountsNameProps {
  data: Readonly<FlattenedIntegrationAccount>;
}

export function ChartOfAccountsName(props: Readonly<ChartOfAccountsNameProps>) {
  return (
    <div
      class={css.root}
      style={{ 'margin-left': `${Math.max(0, props.data.level - IGNORE_LEVELS) * LEVEL_PADDING_PX}px` }}
    >
      <Show when={props.data.level > 1}>
        <span class={css.nestedIcon} />
      </Show>
      <div class={css.container}>
        {props.data.name}
        <Show when={props.data.isNew}>
          <Text message="New Account" class={css.new!} />
        </Show>
      </div>
    </div>
  );
}
