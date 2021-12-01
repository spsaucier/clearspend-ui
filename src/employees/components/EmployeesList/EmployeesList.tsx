import { For } from 'solid-js';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import type { StoreSetter } from '_common/utils/store';

import { formatName } from '../../utils/formatName';
import type { User, SearchUserResponse, SearchUserRequest } from '../../types';
import { EmployeeCards } from '../EmployeeCards';

import css from './EmployeesList.css';

interface EmployeesListProps {
  data: SearchUserResponse;
  onClick: (uid: User['userId']) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeesList(props: Readonly<EmployeesListProps>) {
  return (
    <div>
      <Input disabled placeholder="Search employees..." suffix={<Icon name="search" size="sm" />} class={css.search} />
      <For each={props.data.content}>
        {(item) => (
          <div class={css.item} onClick={() => props.onClick(item.userData.userId)}>
            <div>
              <div class={css.name}>{formatName(item.userData)}</div>
              <div>{item.email}</div>
            </div>
            <div class={css.card}>
              <EmployeeCards data={item.cardInfoList} />
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
