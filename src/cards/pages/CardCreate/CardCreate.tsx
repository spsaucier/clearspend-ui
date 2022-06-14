import { Switch, Match, createSignal } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useBusiness } from 'app/containers/Main/context';
import { useMCC } from 'app/stores/mcc';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateUserRequest, IssueCardRequest, SearchCardData } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { CardType, LegacyIssueCardRequest } from 'cards/types';
import { CreateCardForm } from 'cards/components/CreateCardForm';

import { addAllocationsToCard, saveCard } from '../../services';

export default function CardCreate() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ userId: string; allocationId: string }>();
  const [errorLevel, setErrorLevel] = createSignal('');
  const [cardType, setCardType] = createSignal<LegacyIssueCardRequest['cardType']>();

  const mcc = useMCC({ initValue: [] });
  const users = useUsersList({ initValue: [] });
  const { allocations } = useBusiness();

  const onAddEmployee = async (userData: Readonly<CreateUserRequest>) => {
    const resp = await saveUser(userData);
    await users.reload();
    sendAnalyticsEvent({ name: Events.CREATE_EMPLOYEE });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    return resp;
  };

  const onSave = async (data: Readonly<IssueCardRequest>, existingCard: SearchCardData | undefined) => {
    if (existingCard?.cardId) {
      const { allocationSpendControls } = data;
      await addAllocationsToCard(existingCard.cardId, allocationSpendControls!);
      const prevLocation = location.state?.prev;
      sendAnalyticsEvent({ name: Events.ADD_ALLOCATION_TO_PHYSICAL_CARD });
      messages.success({
        title: i18n.t('Allocation added to card'),
        message: i18n.t('Employee can update the active allocation on the web or in the ClearSpend app.'),
      });
      if (prevLocation) {
        navigate(prevLocation);
      } else {
        navigate('/cards');
      }
    } else {
      const resp = await saveCard(data).catch((e: { data?: { message?: string } }) => {
        setErrorLevel('WARNING');
        if (e.data?.message === 'Physical card issuance limit exceeded') {
          let message = i18n.t(
            'Your virtual card was successfully created, but you have reached the maximum of physical cards. Please contact help@clearspend.com if you need more.',
          );
          if (data.cardType.length === 1) {
            setErrorLevel('ERROR');
            message = i18n.t(
              'You have reached the maximum of physical cards. Please contact help@clearspend.com if you need more.',
            );
          }
          messages.error({
            title: i18n.t('Unable to create physical card'),
            message,
          });
        } else {
          setErrorLevel('ERROR');
          messages.error({ title: i18n.t('Failed to create card') });
        }
        return undefined;
      });
      if (errorLevel() !== 'ERROR') {
        sendAnalyticsEvent({ name: Events.CREATE_CARD });
        const hasVirtualCard = data.cardType.includes(CardType.VIRTUAL);
        const hasPhysicalCard = data.cardType.includes(CardType.PHYSICAL);
        if (errorLevel() !== 'WARNING') {
          if (hasVirtualCard) {
            sendAnalyticsEvent({ name: Events.CREATE_CARD_VIRTUAL });
            messages.success({
              title: i18n.t('Virtual card created'),
              message: i18n.t('Access this card in the ClearSpend app.'),
            });
          } else if (hasPhysicalCard) {
            sendAnalyticsEvent({ name: Events.CREATE_CARD_PHYSICAL });
            messages.success({
              title: i18n.t('Physical card created'),
              message: i18n.t('Card will arrive in 5-10 days.'),
            });
          }
        }

        const prevLocation = location.state?.prev;
        if (prevLocation) navigate(prevLocation);
        else if (resp?.length === 1) navigate(`/cards/view/${resp[0]!.cardId}`);
        else navigate('/cards');
      }
    }
  };

  return (
    <Page
      title={
        <Switch>
          <Match when={cardType() === 'ADD_TO_PHYSICAL'}>
            <Text message="Add Card to New Allocation" />
          </Match>
          <Match when={cardType() === 'PHYSICAL'}>
            <Text message="New Physical Card" />
          </Match>
          <Match when={cardType() === 'VIRTUAL'}>
            <Text message="New Virtual Card" />
          </Match>
          <Match when={!cardType()}>
            <Text message="New Card" />
          </Match>
        </Switch>
      }
    >
      <Switch>
        <Match when={mcc.error}>
          <LoadingError onReload={mcc.reload} />
        </Match>
        <Match when={users.error}>
          <LoadingError onReload={users.reload} />
        </Match>
        <Match when={(users.loading && !users.data?.length) || mcc.loading}>
          <Loading />
        </Match>
        <Match when={mcc.data?.length}>
          <CreateCardForm
            setCardType={setCardType}
            userId={location.state?.userId}
            allocationId={location.state?.allocationId}
            users={users.data!}
            mccCategories={mcc.data!}
            allocations={allocations()}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
          />
        </Match>
      </Switch>
    </Page>
  );
}
