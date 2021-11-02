import { Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Spin } from '_common/components/Spin';
import { Fault } from '_common/components/Fault';
import { events } from '_common/api/events';
import { getNoop } from '_common/utils/getNoop';
import { useResource } from '_common/utils/useResource';
import { Onboarding } from 'onboarding';

import { getBusiness } from '../../services/businesses';
import { ownerStore } from '../../stores/owner';
import { BusinessStatus } from '../../types/businesses';
import { AppEvent } from '../../types/common';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext } from './context';

import css from './Main.css';

export default function Main() {
  const navigate = useNavigate();
  if (!(ownerStore.data as unknown)) navigate('/login');

  if (process.env.NODE_ENV === 'development') {
    fetch('/api/non-production/test-data/db-content').catch(getNoop());
    // fetch('/api/non-production/test-data/create-all-demo').catch(getNoop());
  }

  const [business, status, , , refetch, mutate] = useResource(getBusiness, null);

  events.sub(AppEvent.Logout, () => {
    mutate(null);
    navigate('/login');
  });

  return (
    <Switch>
      <Match when={status().error}>
        <Fault onReload={refetch} />
      </Match>
      <Match when={status().loading && !business()}>
        <div class={css.loading}>
          <Spin />
        </div>
      </Match>
      <Match when={!!business()}>
        <BusinessContext.Provider value={{ business, refetch }}>
          <Switch>
            <Match when={!(business().status as unknown) || business().status === BusinessStatus.ONBOARDING}>
              <Onboarding />
            </Match>
            <Match when={business().status === BusinessStatus.ACTIVE}>
              <MainRoutes />
            </Match>
            <Match when={business().status === BusinessStatus.SUSPENDED}>
              <div>SUSPENDED</div>
            </Match>
            <Match when={business().status === BusinessStatus.CLOSED}>
              <div>CLOSED</div>
            </Match>
          </Switch>
        </BusinessContext.Provider>
      </Match>
    </Switch>
  );
}
