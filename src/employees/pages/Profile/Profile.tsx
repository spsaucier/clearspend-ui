import { createSignal, For, createMemo } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { events } from '_common/api/events';
import { wrapAction } from '_common/utils/wrapAction';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Drawer } from '_common/components/Drawer';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { useBusiness } from 'app/containers/Main/context';
import { Card } from 'cards/components/Card';
import { CardPreview } from 'cards/containers/CardPreview';
import { CardType } from 'cards/types';
import { clearCurrentBusinessId } from '_common/api/businessId';

import { ProfileInfo } from '../../components/ProfileInfo';
import { getUser } from '../../services';
import { useUserCards } from '../../stores/userCards';
import { formatName } from '../../utils/formatName';

import css from './Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  const { currentUser } = useBusiness();
  const [user, userStatus, , , reloadUser] = useResource(getUser, currentUser().userId);

  const cards = useUserCards();
  const [cardID, setCardID] = createSignal<string>();
  const sortedCards = createMemo(() =>
    cards.data
      ? [
          ...cards.data
            .filter((c) => c.card.status === 'ACTIVE')
            .sort((c) => (c.card.type === CardType.PHYSICAL ? -1 : 1)),
          ...cards.data.filter((c) => c.card.status === 'INACTIVE'),
          ...cards.data.filter((c) => c.card.status === 'CANCELLED'),
        ]
      : [],
  );
  const [loading, logoutAction] = wrapAction(() =>
    logout().then(() => {
      events.emit(AppEvent.Logout);
      clearCurrentBusinessId();
    }),
  );

  return (
    <Page
      title={formatName(currentUser())}
      subtitle={<Text message="Account settings" class={css.subtitle!} />}
      actions={
        <Button size="lg" loading={loading()} onClick={logoutAction}>
          <Text message="Sign Out" />
        </Button>
      }
    >
      <Section
        title={<Text message="Profile" />}
        description={<Text message="Your primary account information" />}
        class={css.section}
      >
        <Data data={user()} error={userStatus().error} loading={userStatus().loading} onReload={reloadUser}>
          <ProfileInfo data={user()!} class={css.info} />
        </Data>
        <Button size="lg" icon="edit" onClick={() => navigate('/profile/settings')}>
          <Text message="Update Address" />
        </Button>
      </Section>
      <Section
        title={<Text message="Cards" />}
        description={<Text message="All cards assigned to your account" />}
        class={css.section}
      >
        <Data data={sortedCards()} loading={cards.loading} error={cards.error} onReload={cards.reload}>
          <div class={css.cards}>
            <For each={sortedCards()}>
              {(item) => (
                <Card
                  type={item.card.type as CardType}
                  number={item.card.cardNumber}
                  status={item.card.status}
                  activated={item.card.activated}
                  class={css.card}
                  onClick={() => setCardID(item.card.cardId)}
                />
              )}
            </For>
          </div>
        </Data>
      </Section>
      <Section
        title={<Text message="Password" />}
        description={<Text message="Change your current password" />}
        class={css.section}
      >
        <Button size="lg" icon="edit" onClick={() => navigate('/profile/password')}>
          <Text message="Update Password" />
        </Button>
      </Section>
      <Section
        title={<Text message="Two-factor authentication" />}
        description={<Text message="Update the mobile number used to secure your account." />}
        class={css.section}
      >
        <Button size="lg" icon="edit" onClick={() => navigate('/profile/phone')}>
          <Text message="Update Phone Number" />
        </Button>
      </Section>
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID()}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </Page>
  );
}
