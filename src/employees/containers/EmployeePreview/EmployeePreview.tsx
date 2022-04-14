import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { formatPhone } from '_common/formatters/phone';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import { DEFAULT_PAGE_REQUEST } from 'app/constants/common';
import { CardsList } from 'cards/components/CardsList';
import { searchCards } from 'cards/services';
import type { SearchCardRequest } from 'generated/capital';

import { getUser } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeePreview.css';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: { ...DEFAULT_PAGE_REQUEST },
};

interface EmployeePreviewProps {
  uid: string;
}

export function EmployeePreview(props: Readonly<EmployeePreviewProps>) {
  const navigate = useNav();
  const [user, status, , , reload] = useResource(getUser, props.uid);

  const [cards, cardsStatus, params, setParams, reloadCards] = useResource(searchCards, {
    ...DEFAULT_PARAMS,
    users: [props.uid],
  } as SearchCardRequest);

  return (
    <div class={css.root}>
      <Data data={user()} loading={status().loading} error={status().error} onReload={reload}>
        <div class={css.content}>
          <h4 class={css.name}>{formatName(user()!)}</h4>
          <div class={css.data}>{user()!.email}</div>
          <div class={css.data}>{formatPhone(user()!.phone)}</div>
          <Data data={cards() as {}} loading={cardsStatus().loading} error={cardsStatus().error} onReload={reloadCards}>
            <CardsList
              data={cards()! as {}}
              search={params().searchText}
              onCardClick={(id: string) => navigate(`/cards/view/${id}`)}
              onChangeParams={setParams}
            />
          </Data>
        </div>
        <div class={css.controls}>
          <Button wide type="primary" onClick={() => navigate(`/employees/view/${props.uid}`)}>
            <Text message="View full profile" />
          </Button>
        </div>
      </Data>
    </div>
  );
}
