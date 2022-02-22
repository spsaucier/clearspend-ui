import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';
import type { CreateOrUpdateBusinessOwnerRequest } from 'generated/capital';

import css from './LeadershipTable.css';

interface LeadershipTableProps {
  leaders: CreateOrUpdateBusinessOwnerRequest[];
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onAddClick: () => void;
  currentUserEmail?: string;
}

export function LeadershipTable(props: Readonly<LeadershipTableProps>) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
  const columns: readonly Readonly<TableColumn<CreateOrUpdateBusinessOwnerRequest>>[] = [
    {
      name: 'name',
      title: <Text message="Name" />,
      render: (leader) => {
        return <div class={css.cell}>{`${leader.firstName} ${leader.lastName}`}</div>;
      },
    },
    {
      name: 'role',
      title: <Text message="Role" />,
      render: (leader) => {
        let roles = [];
        if (leader.relationshipOwner) roles.push('Owner');
        if (leader.relationshipExecutive) roles.push('Executive');
        if (leader.relationshipDirector) roles.push('Director');
        return (
          <div class={css.cell}>
            <Text message={roles.length ? formatter.format(roles) : 'No roles selected'} />
          </div>
        );
      },
    },
    {
      name: 'percentage',
      title: <Text message="% Ownership" />,
      render: (leader) => <div class={css.cell}>{leader.percentageOwnership}%</div>,
    },
    {
      name: 'actions',
      title: <Text message="Actions" />,
      render: (leader) => (
        <div class={css.cell}>
          <div class={css.row}>
            <a onClick={() => props.onEditClick(leader.id || '')} class={css.firstAction}>
              <Icon name="edit" />
            </a>
            <Show when={leader.email && leader.email !== props.currentUserEmail}>
              <a onClick={() => props.onDeleteClick(leader.id || '')}>
                <Icon name="trash" />
              </a>
            </Show>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div class={css.wrapper}>
      <Table columns={columns} data={props.leaders} tdClass={css.cell} />
      <Button class={css.button} type="default" icon="add" onClick={props.onAddClick}>
        <Text message="Add a leader" />
      </Button>
    </div>
  );
}