import { Show, Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { useResource } from '_common/utils/useResource';
import { formatPhone } from '_common/formatters/phone';
import { useMessages } from 'app/containers/Messages/context';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { BackLink } from 'app/components/BackLink';
import { usePageTabs } from 'app/utils/usePageTabs';
import type { FormValues } from 'employees/components/EditEmployeeForm/types';
import { canManageCards, canManageUsers } from 'allocations/utils/permissions';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { Transactions } from '../../containers/Transactions';
import { Cards } from '../../containers/Cards';
import { getUser, editUser } from '../../services';
import { formatName } from '../../utils/formatName';
import { useBusiness } from '../../../app/containers/Main/context';

import css from './EmployeeView.css';

enum Tabs {
  transactions = 'transactions',
  cards = 'cards',
  settings = 'settings',
}

export default function EmployeeView() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const { permissions } = useBusiness();

  const params = useParams<{ id: string }>();
  const [tab, setTab] = usePageTabs<Tabs>(Tabs.transactions);

  const [user, status, , , reload, mutate] = useResource(getUser, params.id);

  const onEdit = async (data: FormValues) => {
    const userData = user()!;
    const { firstName, lastName, email, phone, ...address } = data;
    if (userData.userId) {
      await editUser(userData.userId, { firstName, lastName, email, phone, address: { ...address, country: 'USA' } });
      mutate({ ...userData, firstName, lastName, email, phone, address: { ...address, country: 'USA' } });

      messages.success({
        title: i18n.t('Success'),
        message: i18n.t('The employee has been successfully updated.'),
      });
    }
  };

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
          {(data) => formatName(data)}
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
        <Show when={canManageCards(permissions())}>
          <Button
            type="primary"
            size="lg"
            icon="add"
            disabled={!user()}
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
            <Show when={canManageUsers(permissions())}>
              <Tab value={Tabs.settings}>
                <Text message="Edit Employee" />
              </Tab>
            </Show>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.transactions}>
              <Transactions userId={user()!.userId!} />
            </Match>
            <Match when={tab() === Tabs.cards}>
              <Cards userId={user()!.userId} />
            </Match>
            <Match when={tab() === Tabs.settings}>
              <Show when={canManageUsers(permissions())}>
                <EditEmployeeForm user={user()!} onSave={onEdit} />
              </Show>
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Page>
  );
}
