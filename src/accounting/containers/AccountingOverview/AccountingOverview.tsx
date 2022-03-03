import type { Setter } from 'solid-js';

import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';
import { TransactionsData } from 'transactions/components/TransactionsData';
import { useMediaContext } from '_common/api/media/context';
import { useNav } from '_common/api/router';
import type { StoreSetter, StoreSetterFunc } from '_common/utils/store';

interface AccountingOverviewProps {
  loading: boolean;
  error: unknown;
  params: Readonly<AccountActivityRequest>;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  onRowClick?: (transaction: AccountActivityResponse) => void;
  onCardClick?: (id: string) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<AccountActivityRequest>> | StoreSetter<Readonly<AccountActivityRequest>>;
  showAccountingAdminView?: boolean;
  onUpdateData: (setter: StoreSetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
}

export function AccountingOverview(props: Readonly<AccountingOverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();

  return (
    <div>
      <TransactionsData
        table={media.large}
        loading={props.loading}
        error={props.error}
        params={props.params}
        data={props.data}
        onReload={props.onReload}
        onChangeParams={props.onChangeParams}
        onUpdateData={props.onUpdateData}
        onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
        showAccountingAdminView
      />
    </div>
  );
}
