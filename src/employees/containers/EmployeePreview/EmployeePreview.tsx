import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { formatPhone } from '_common/formatters/phone';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import { CardsList } from 'cards/components/CardsList';
import { searchCards } from 'cards/services';
import type { UUIDString } from 'app/types/common';
import type { SearchCardRequest } from 'cards/types';

import { getUser } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeePreview.css';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface EmployeePreviewProps {
  uid: UUIDString;
}

export function EmployeePreview(props: Readonly<EmployeePreviewProps>) {
  const navigate = useNav();
  const [user, status, , , reload] = useResource(getUser, props.uid);

  const [cards, cardsStatus, params, setParams, reloadCards] = useResource(searchCards, {
    ...DEFAULT_PARAMS,
    userId: props.uid,
  });

  return (
    <div class={css.root}>
      <Data data={user()} loading={status().loading} error={status().error} onReload={reload}>
        <div>
          <h4 class={css.name}>{formatName(user()!)}</h4>
          <div class={css.data}>{user()!.email}</div>
          <div class={css.data}>{formatPhone(user()!.phone)}</div>
          <Data data={cards()} loading={cardsStatus().loading} error={cardsStatus().error} onReload={reloadCards}>
            <CardsList
              data={cards()!}
              search={params().searchText}
              onCardClick={(id: UUIDString) => navigate(`/cards/view/${id}`)}
              onChangeParams={setParams}
            />
          </Data>
        </div>
        <Button wide type="primary" onClick={() => navigate(`/employees/view/${props.uid}`)}>
          <Text message="View full profile" />
        </Button>
      </Data>
    </div>
  );
}