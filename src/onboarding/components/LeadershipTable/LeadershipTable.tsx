import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';
import type { Business, CreateOrUpdateBusinessOwnerRequest } from 'generated/capital';
import { BusinessType } from 'app/types/businesses';

import css from './LeadershipTable.css';

interface LeadershipTableProps {
  leaders: BusinessOwner[];
  business: Business;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  onAddClick?: () => void;
  currentUserEmail?: string;
  leaderIdsWithError?: string[];
}

export function LeadershipTable(props: Readonly<LeadershipTableProps>) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  const hiddenColumns: string[] = [];

  if (
    [BusinessType.SOLE_PROPRIETORSHIP, BusinessType.INCORPORATED_NON_PROFIT].includes(
      props.business.businessType as BusinessType,
    )
  ) {
    hiddenColumns.push('percentage');
  }

  if (!props.onEditClick) {
    hiddenColumns.push('actions');
  }

  const columns: readonly Readonly<TableColumn<BusinessOwner>>[] = [
    {
      name: 'name',
      title: <Text message="Name" />,
      render: (leader) => {
        return (
          <div class={css.cell}>
            {`${leader.firstName} ${leader.lastName}`}
            <Show when={props.leaderIdsWithError && props.leaderIdsWithError.includes(leader.businessOwnerId)}>
              <div>
                <Icon name="alert" class={css.error} />
              </div>
            </Show>
          </div>
        );
      },
    },
    {
      name: 'role',
      title: <Text message="Role" />,
      render: (leader) => {
        let roles = [];
        if (leader.relationshipOwner) roles.push('Owner');
        if (leader.relationshipExecutive) roles.push('Executive');
        if (props.business.businessType === BusinessType.INCORPORATED_NON_PROFIT) roles.push('Representative');
        return (
          <div class={css.cell}>
            <Text message={roles.length ? formatter.format(roles) : 'No roles selected'} />
          </div>
        );
      },
    },
    {
      name: 'percentage',
      title: <Text message="Ownership (25% or more)" />,
      render: (leader) => (
        <div class={css.cell}>
          {leader.percentageOwnership ? leader.percentageOwnership : ''}
          {leader.percentageOwnership ? `%` : 'N/A'}
        </div>
      ),
    },
    {
      name: 'actions',
      title: <Text message="Actions" />,
      render: (leader: BusinessOwner) => (
        <div class={css.cell}>
          <div class={css.row}>
            <Button
              size="sm"
              icon="edit"
              view="ghost"
              type="primary"
              onClick={() => props.onEditClick!(leader.businessOwnerId || '')}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div class={css.wrapper}>
      <Table
        columns={columns.filter((c) => !hiddenColumns.includes(c.name))}
        data={props.leaders}
        cellClass={css.cell}
      />
      <div>
        <Show when={props.onAddClick}>
          <Button class={css.button} type="default" icon="add" onClick={props.onAddClick} size={'lg'}>
            <Text message="Add a leader" />
          </Button>
        </Show>
      </div>
    </div>
  );
}

// todo: get this from capital.ts generation
export type BusinessOwner = Omit<CreateOrUpdateBusinessOwnerRequest, 'id'> & { businessOwnerId: string };
