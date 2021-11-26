import { createSignal, Show, Switch, Match } from 'solid-js';
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
import { Section } from 'app/components/Section';
import type { UUIDString } from 'app/types/common';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { Transactions } from '../../containers/Transactions';
import { Cards } from '../../containers/Cards';
import { getUser, editUser } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeeView.css';

enum Tabs {
  transactions,
  cards,
  settings,
}

export default function EmployeeView() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();

  const params = useParams<{ id: UUIDString }>();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const [user, status, , , reload, mutate] = useResource(getUser, params.id);

  const onEdit = async (firstName: string, lastName: string, email: string) => {
    const data = user()!;

    await editUser(data.userId, { firstName, lastName, email });
    mutate({ ...data, firstName, lastName, email });

    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The employee has been successfully updated.'),
    });
  };

  return (
    <Page
      breadcrumbs={
        <BackLink to="/employees">
          <Text message="Employees" />
        </BackLink>
      }
      title={
        <Show when={user()} fallback="Loading...">
          {(data) => formatName(data)}
        </Show>
      }
      subtitle={
        <Show when={user()}>
          {(data) => (
            <div class={css.info}>
              <div>{data.email}</div>
              {formatPhone(data.phone)}
            </div>
          )}
        </Show>
      }
      actions={
        <Button
          type="primary"
          size="lg"
          icon="add"
          disabled={!user()}
          onClick={() => navigate('/cards/edit', { state: { userId: user()?.userId } })}
        >
          <Text message="New Card" />
        </Button>
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
          {(data) => (
            <>
              <TabList value={tab()} onChange={setTab}>
                <Tab value={Tabs.transactions}>
                  <Text message="Transactions" />
                </Tab>
                <Tab value={Tabs.cards}>
                  <Text message="Cards" />
                </Tab>
                <Tab value={Tabs.settings}>
                  <Text message="Edit" />
                </Tab>
              </TabList>
              <Switch>
                <Match when={tab() === Tabs.transactions}>
                  <Transactions />
                </Match>
                <Match when={tab() === Tabs.cards}>
                  <Cards userId={data.userId} />
                </Match>
                <Match when={tab() === Tabs.settings}>
                  <Section title={<Text message="Employee Info" />}>
                    <EditEmployeeForm user={data} onSave={onEdit} />
                  </Section>
                </Match>
              </Switch>
            </>
          )}
        </Match>
      </Switch>
    </Page>
  );
}
