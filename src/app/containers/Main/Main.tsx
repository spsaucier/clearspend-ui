import { Accessor, createMemo, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Spin } from '_common/components/Spin';
import { Fault } from '_common/components/Fault';
import { events } from '_common/api/events';
import { getNoop } from '_common/utils/getNoop';
import { useResource } from '_common/utils/useResource';
import { Onboarding } from 'onboarding';

import { getOwner, getBusiness } from '../../services/businesses';
import { BusinessStatus, Businesses, BusinessOwner } from '../../types/businesses';
import { AppEvent } from '../../types/common';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext } from './context';

import css from './Main.css';

function isStatus(business: Readonly<Businesses> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

export default function Main() {
  const navigate = useNavigate();

  if (process.env.NODE_ENV === 'development') {
    fetch('/api/non-production/test-data/db-content').catch(getNoop());
    // fetch('/api/non-production/test-data/create-all-demo').catch(getNoop());
  }

  const [data, status, , , refetch, mutate] = useResource(() => Promise.all([getOwner(), getBusiness()]), null);

  const owner = createMemo(() => {
    const value = data();
    return value && value[0];
  });

  const business = createMemo(() => {
    const value = data();
    return value && value[1];
  });

  events.sub(AppEvent.Logout, () => {
    mutate(null);
    navigate('/login');
  });

  return (
    <Switch>
      <Match when={status().error}>
        <Fault onReload={refetch} />
      </Match>
      <Match when={status().loading && !data()}>
        <div class={css.loading}>
          <Spin />
        </div>
      </Match>
      <Match when={data()}>
        <BusinessContext.Provider
          value={{ business, owner: owner as Accessor<Readonly<BusinessOwner>>, refetch, mutate }}
        >
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
      </Match>
    </Switch>
  );
}
