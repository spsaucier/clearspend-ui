import { useMediaContext } from '_common/api/media/context';
import { useNav } from '_common/api/router';
import { useActivity } from 'app/stores/activity';
import { Data } from 'app/components/Data';
import { DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/components/TransactionsData';

import { AccountingTimePeriod, getAccountingTimePeriod } from './utils';

import css from './AccountingOverview.css';

function toISO(range: [from: ReadonlyDate, to: ReadonlyDate]) {
  return {
    from: range[0].toISOString() as DateString,
    to: range[1].toISOString() as DateString,
  };
}

export function AccountingOverview() {
  const media = useMediaContext();
  const navigate = useNav();

  const initPeriod = AccountingTimePeriod.year;
  const PERIOD = toISO(getAccountingTimePeriod(initPeriod));

  const activityStore = useActivity({
    params: {
      ...DEFAULT_ACTIVITY_PARAMS,
      ...PERIOD,
      // allocationId,
    },
  });

  return (
    <div class={css.root}>
      <div>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <TransactionsData
            table={media.large}
            loading={activityStore.loading}
            error={activityStore.error}
            params={activityStore.params}
            data={activityStore.data}
            onReload={activityStore.reload}
            onChangeParams={activityStore.setParams}
            onUpdateData={activityStore.setData}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
            showAccountingAdminView
          />
        </Data>
      </div>
    </div>
  );
}
