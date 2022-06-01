import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { Page } from 'app/components/Page';
import { CancelConfirmationButton } from 'accounting/components/CancelConfirmationButton';
import { Button } from '_common/components/Button';
import { useClasses } from 'accounting/stores/classes';
import { Table, TableColumn } from '_common/components/Table';
import type { CodatCategory } from 'generated/capital';
import { Input } from '_common/components/Input';
import { i18n } from '_common/api/intl';
import { Icon } from '_common/components/Icon';

import css from './ClassesSetup.css';

interface ClassesSetupProps {
  onNext: () => void;
  onCancel: () => void;
}

export function ClassesSetup(props: ClassesSetupProps) {
  const classes = useClasses();

  const columns: Readonly<TableColumn<CodatCategory>>[] = [
    {
      name: 'className',
      title: <Text message={'Class'} />,
      render: (codatClass) => <div>{codatClass.categoryName}</div>,
    },
    {
      name: 'clearspendClassName',
      title: <Text message={'ClearSpend class'} />,
      render: () => (
        <Input
          class={css.select}
          placeholder={String(i18n.t('Assign class'))}
          value={''}
          suffix={<Icon name="chevron-down" size="sm" />}
          onChange={() => {
            return null;
          }}
          data-name="Search"
        />
      ),
    },
  ];

  return (
    <div class={css.root}>
      <Page contentClass={css.pageContent} title={<Text message="Set up your QuickBooks Online integration" />}>
        <div class={css.pageBody}>
          <Show when={classes.data}>
            <div class={css.table}>
              <Table columns={columns} data={classes.data!} />
            </div>
          </Show>
          <div class={css.tableButtons}>
            <Show when={!!props.onCancel}>
              <CancelConfirmationButton onCancel={props.onCancel!} />
            </Show>
            <Button class={css.done} type="primary" icon={{ name: 'confirm', pos: 'right' }} onClick={props.onNext}>
              <Text message="Save changes" />
            </Button>
          </div>
        </div>
      </Page>
    </div>
  );
}
