import { createMemo, Switch, Match, createEffect, createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import * as LDClient from 'launchdarkly-js-client-sdk';

import { BusinessStatus } from 'app/types/businesses';
import { Spin } from '_common/components/Spin';
import { Fault } from '_common/components/Fault';
import { events } from '_common/api/events';
import { useResource } from '_common/utils/useResource';
import { Onboarding } from 'onboarding';
import { HardFail } from 'app/pages/HardFail';
import { formatNameString } from 'employees/utils/formatName';
import { setCurrentBusinessId } from '_common/api/businessId';
import { getToCTimestamp } from 'app/services/auth';
import { wrapAction } from '_common/utils/wrapAction';

import { getUsers, getBusiness } from '../../services/businesses';
import { getAllPermissions } from '../../services/permissions';
import { AppEvent } from '../../types/common';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext, type MutateContext } from './context';
import { isStatus, getPermissions } from './utils';

import css from './Main.css';

export default function Main() {
  const navigate = useNavigate();
  const [ldClient, setLdClient] = createSignal<LDClient.LDClient | null>(null);

  const [data, status, , , refetch, mutate] = useResource(async () => {
    const [currentUser, business] = await Promise.all([getUsers(), getBusiness()]);
    return { currentUser, business, ...(await getPermissions(business, getAllPermissions)) };
  });

  const business = createMemo(() => data()?.business || null);
  const mutateContext = (updates: Partial<Readonly<MutateContext>>): void => mutate({ ...data()!, ...updates });

  const reloadPermissions = async () => {
    const current = data();
    if (current) mutate({ ...current, ...(await getPermissions(current.business, getAllPermissions)) });
  };

  events.sub(AppEvent.Logout, (returnUrl: string) => {
    mutate(null);
    navigate('/login', { state: { returnUrl: returnUrl } });
  });

  createEffect(async () => {
    if (!data()?.currentUser?.userId) return null;
    const client = await LDClient.initialize(
      (window as CSWindow).clearspend_env?.LAUNCHDARKLY_CLIENT_ID || process.env.LAUNCHDARKLY_CLIENT_ID,
      {
        key: data()?.currentUser?.userId,
        secondary: data()?.currentUser?.businessId,
        email: data()?.currentUser?.email,
        name: formatNameString(data()?.currentUser || {}),
      },
    );
    await client.waitForInitialization();
    setLdClient(client);
    return client;
  });

  createEffect(() => {
    const businessId = data()?.business?.businessId;
    if (businessId) {
      setCurrentBusinessId(businessId);
    }
  });
  const [fetchingToCTimestamp, fetchTocTimestamp] = wrapAction(getToCTimestamp);

  createEffect(async () => {
    if (data()) {
      try {
        const tosTimestamp = await fetchTocTimestamp();

        if (tosTimestamp.isAcceptedTermsAndConditions) {
          const acceptedDatetime = new Date(tosTimestamp.acceptedTimestampByUser!);

          const updatedDatetime = new Date(tosTimestamp.documentTimestamp!);

          if (acceptedDatetime < updatedDatetime) {
            navigate('/toc');
          }
        }
      } catch (tosTimestampGetError: unknown) {
        navigate('/toc');
      }
    }
  });

  return (
    <Switch>
      <Match when={status().error}>
        <Fault onReload={refetch} />
      </Match>
      <Match when={(status().loading || fetchingToCTimestamp()) && !data()}>
        <div class={css.loading}>
          <Spin />
        </div>
      </Match>
      <Match when={data() && !fetchingToCTimestamp()}>
        <BusinessContext.Provider
          value={{
            business,
            currentUser: createMemo(() => data()?.currentUser || null),
            permissions: createMemo(() => data()?.permissions || null),
            allocations: createMemo(() => data()?.allocations || []),
            currentUserRoles: createMemo(() => data()?.roles || []),
            mutate: mutateContext,
            reloadPermissions,
            refetch,
            ldClient,
          }}
        >
          <Switch>
            <Match when={!business() || isStatus(business(), BusinessStatus.ONBOARDING)}>
              <Onboarding />
            </Match>
            <Match when={isStatus(business(), BusinessStatus.SUSPENDED)}>
              <div>SUSPENDED</div>
            </Match>
            <Match when={isStatus(business(), BusinessStatus.CLOSED)}>
              <HardFail />
            </Match>
            <Match when={isStatus(business(), BusinessStatus.ACTIVE)}>
              <MainRoutes />
            </Match>
          </Switch>
        </BusinessContext.Provider>
      </Match>
    </Switch>
  );
}
