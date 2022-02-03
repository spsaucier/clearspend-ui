import { For } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { events } from '_common/api/events';
import { wrapAction } from '_common/utils/wrapAction';
import { Button } from '_common/components/Button';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { useBusiness } from 'app/containers/Main/context';
import { Card } from 'cards/components/Card';
import type { CardType } from 'cards/types';

import { ProfileInfo } from '../../components/ProfileInfo';
import { useUserCards } from '../../stores/userCards';
import { formatName } from '../../utils/formatName';

import css from './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { owner } = useBusiness();

  const cards = useUserCards();
  const [loading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  return (
    <Page
      title={formatName(owner())}
      subtitle={<Text message="Account settings" class={css.subtitle!} />}
      actions={
        <Button size="lg" loading={loading()} onClick={logoutAction}>
          <Text message="Sign Out" />
        </Button>
      }
    >
      <Section
        title={<Text message="Profile" />}
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        class={css.section}
      >
        <ProfileInfo data={owner()} class={css.info} />
        <Button size="lg" icon="edit">
          <Text message="Update Profile" />
        </Button>
      </Section>
      <Section
        title={<Text message="Cards" />}
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        class={css.section}
      >
        <Data data={cards.data} loading={cards.loading} error={cards.error} onReload={cards.reload}>
          <div class={css.cards}>
            <For each={cards.data}>
              {(item) => (
                <Card
                  type={item.card.type as CardType}
                  number={item.card.cardNumber}
                  status={item.card.status}
                  notActivated={!item.card.activated}
                  class={css.card}
                  onClick={() => navigate(`/cards/view/${item.card.cardId}`)}
                />
              )}
            </For>
          </div>
        </Data>
      </Section>
      <Section
        title={<Text message="Password" />}
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        class={css.section}
      >
        <Button size="lg" icon="edit">
          <Text message="Update Password" />
        </Button>
      </Section>
      <Section
        title={<Text message="Two-factor authentication" />}
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        class={css.section}
      >
        <Button size="lg" icon="edit">
          <Text message="Update Phone Number" />
        </Button>
      </Section>
    </Page>
  );
}
