import { createMemo, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { BusinessStatus } from 'app/types/businesses';
import { Spin } from '_common/components/Spin';
import { Fault } from '_common/components/Fault';
import { events } from '_common/api/events';
import { useResource } from '_common/utils/useResource';
import { Onboarding } from 'onboarding';
import { HardFail } from 'app/pages/HardFail';
import type { Business } from 'generated/capital';
import { getPermissions } from 'app/services/auth';

import { getLoggedInUser, getBusiness } from '../../services/businesses';
import { AppEvent } from '../../types/common';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext } from './context';

import css from './Main.css';

function isStatus(business: Readonly<Business> | null, status: BusinessStatus): boolean {
  return business?.status === status;
}

export default function Main() {
  const navigate = useNavigate();

  const [data, status, , , refetch, mutate] = useResource(
    () => Promise.all([getLoggedInUser(), getBusiness(), getPermissions()]),
    null,
  );

  const loggedInUser = createMemo(() => {
    const value = data();
    return value && value[0];
  });

  const business = createMemo(() => {
    const value = data();
    return value && value[1];
  });

  const permissions = createMemo(() => {
    const value = data();
    return value && value[2];
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
          value={{
            business,
            loggedInUser,
            permissions,
            refetch,
            mutate,
          }}
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
              <HardFail />
            </Match>
          </Switch>
        </BusinessContext.Provider>
      </Match>
    </Switch>
  );
}
