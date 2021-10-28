import { createResource, Switch, Match, Resource } from 'solid-js';

import { Spin } from '_common/components/Spin';
import { Fault } from '_common/components/Fault';
import { getNoop } from '_common/utils/getNoop';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { getBusiness } from '../../services/businesses';
import type { Businesses } from '../../types/businesses';
import { MainRoutes } from '../MainRoutes';

import { BusinessContext } from './context';

import css from './Main.css';

export default function Main() {
  if (process.env.NODE_ENV === 'development') {
    fetch('/api/non-production/test-data/db-content').catch(getNoop());
    // fetch('/api/non-production/test-data/create-all-demo').catch(getNoop());
  }

  const [business, { refetch }] = createResource(getBusiness);

  return (
    <Switch>
      <Match when={business.loading}>
        <div class={css.loading}>
          <Spin />
        </div>
      </Match>
      <Match when={business.error as unknown}>
        <Fault />
      </Match>
      <Match when={!business.loading && !business.error}>
        <BusinessContext.Provider value={{ business: business as Resource<Readonly<Businesses>>, refetch }}>
          <MainLayout side={<Sidebar />}>
            <MainRoutes />
          </MainLayout>
        </BusinessContext.Provider>
      </Match>
    </Switch>
  );
}
