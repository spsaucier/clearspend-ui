import { Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Tag } from '_common/components/Tag';
import { useResource } from '_common/utils/useResource';
import { formatPhone } from '_common/formatters/phone';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { BackLink } from 'app/components/BackLink';
import { useBusiness } from 'app/containers/Main/context';
import { usePageTabs } from 'app/utils/usePageTabs';
import { canManageCards, canManageUsers } from 'allocations/utils/permissions';

import { Transactions } from '../../containers/Transactions';
import { Cards } from '../../containers/Cards';
import { EmployeeProfile } from '../../containers/EmployeeProfile';
import { getUser } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeeView.css';

enum Tabs {
  transactions = 'transactions',
  cards = 'cards',
  settings = 'settings',
}

export default function EmployeeView() {
  const navigate = useNav();
  const { permissions } = useBusiness();
  const params = useParams<{ id: string }>();

  const [tab, setTab] = usePageTabs<Tabs>(Tabs.transactions);
  const [user, status, , , reload] = useResource(getUser, params.id);

  return (
    <Page
      breadcrumbs={
        <Show when={canManageUsers(permissions())}>
          <BackLink to="/employees">
            <Text message="Employees" />
          </BackLink>
        </Show>
      }
      title={
        <Show when={user()} fallback="Loading...">
          {(data) => (
            <span class={css.title}>
              {formatName(data)}
              <Show when={data.archived}>
                <Tag type="danger">
                  <Text message="Archived" />
                </Tag>
              </Show>
            </span>
          )}
        </Show>
      }
      headerContent={
        <Show when={user()}>
          {(data) => (
            <div class={css.info}>
              <div class="fs-mask">{data.email}</div>
              <span class="fs-mask">{formatPhone(data.phone || '')}</span>
            </div>
          )}
        </Show>
      }
      actions={
        <Show when={user() && !user()?.archived && canManageCards(permissions())}>
          <Button
            type="primary"
            size="lg"
            icon="add"
            onClick={() => navigate('/cards/edit', { state: { userId: user()?.userId } })}
          >
            <Text message="New Card" />
          </Button>
        </Show>
      }
    >
      <Switch>
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !user()}>
          <Loading />
        </Match>
        <Match when={user()}>
          <TabList value={tab()} onChange={setTab}>
            <Tab value={Tabs.transactions}>
              <Text message="Transactions" />
            </Tab>
            <Tab value={Tabs.cards}>
              <Text message="Cards" />
            </Tab>
            <Tab value={Tabs.settings}>
              <Text message="Employee profile" />
            </Tab>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.transactions}>
              <Transactions userId={user()!.userId!} />
            </Match>
            <Match when={tab() === Tabs.cards}>
              <Cards userId={user()!.userId} />
            </Match>
            <Match when={tab() === Tabs.settings}>
              <EmployeeProfile data={user()!} canManage={canManageUsers(permissions())} onReload={reload} />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Page>
  );
}
