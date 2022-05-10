import type { Setter, SetterFunc } from '_common/types/common';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';
import { TransactionsData } from 'transactions/containers/TransactionsData';
import { useMediaContext } from '_common/api/media/context';

interface AccountingOverviewProps {
  loading: boolean;
  error: unknown;
  params: Readonly<AccountActivityRequest>;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  onRowClick?: (transaction: AccountActivityResponse) => void;
  onCardClick?: (id: string) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  showAccountingAdminView?: boolean;
  onUpdateData: (setter: SetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
}

export function AccountingOverview(props: Readonly<AccountingOverviewProps>) {
  const media = useMediaContext();

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
        showAccountingAdminView
      />
    </div>
  );
}
