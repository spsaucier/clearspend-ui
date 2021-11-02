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
import { BusinessStatus, Businesses } from '../../types/businesses';
import { AppEvent } from '../../types/common';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext } from './context';

import css from './Main.css';

function isStatus(business: Readonly<Businesses> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

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
    <Switch
      fallback={
        <BusinessContext.Provider value={{ business, refetch, mutate }}>
          <Switch>
            <Match when={!business() || isStatus(business(), BusinessStatus.ONBOARDING)}>
              <Onboarding />
            </Match>
            <Match when={isStatus(business(), BusinessStatus.ACTIVE)}>
              <MainRoutes />
            </Match>
            <Match when={isStatus(business(), BusinessStatus.SUSPENDED)}>
              <div>SUSPENDED</div>
            </Match>
            <Match when={isStatus(business(), BusinessStatus.CLOSED)}>
              <div>CLOSED</div>
            </Match>
          </Switch>
        </BusinessContext.Provider>
      }
    >
      <Match when={status().error}>
        <Fault onReload={refetch} />
      </Match>
      <Match when={status().loading && !business()}>
        <div class={css.loading}>
          <Spin />
        </div>
      </Match>
    </Switch>
  );
}
