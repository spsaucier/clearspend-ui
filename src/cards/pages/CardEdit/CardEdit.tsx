import { Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useMCC } from 'app/stores/mcc';
import { useAllocations } from 'allocations/stores/allocations';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateUserRequest, IssueCardRequest } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { CardType } from 'cards/types';

import { EditCardForm } from '../../components/EditCardForm';
import { saveCard } from '../../services';

export default function CardEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ userId: string; allocationId: string }>();

  const mcc = useMCC({ initValue: [] });
  const allocations = useAllocations({ initValue: [] });
  const users = useUsersList({ initValue: [] });

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

  const onSave = async (data: Readonly<IssueCardRequest>) => {
    await saveCard(data).catch((e: { data?: { message?: string } }) => {
      if (e.data?.message === 'Physical card issuance limit exceeded') {
        messages.error({
          title: i18n.t('Unable to create physical card'),
          message:
            data.cardType.length > 1 // Assume 1 was virtual & 1 was physical
              ? i18n.t(
                  'Your virtual card was successfully created, but you have reached the maximum of 10 physical cards.',
                )
              : i18n.t('You have reached the maximum of 10 physical cards. Please contact support if you need more.'),
        });
      } else {
        messages.error({ title: i18n.t('Failed to create card') });
      }
    });

    sendAnalyticsEvent({ name: Events.CREATE_CARD });
    const hasVirtualCard = data.cardType.includes(CardType.VIRTUAL);
    const hasPhysicalCard = data.cardType.includes(CardType.PHYSICAL);
    if (hasVirtualCard) sendAnalyticsEvent({ name: Events.CREATE_CARD_VIRTUAL });
    if (hasPhysicalCard) sendAnalyticsEvent({ name: Events.CREATE_CARD_PHYSICAL });
    if (hasVirtualCard && hasPhysicalCard) {
      sendAnalyticsEvent({ name: Events.CREATE_CARD_BOTH_PHYSICAL_VIRTUAL });
      messages.success({
        title: i18n.t('Cards created successfully'),
        message: i18n.t('The virtual card is available now. Please allow 5-10 days for the physical card to arrive.'),
      });
    } else if (hasVirtualCard) {
      messages.success({
        title: i18n.t('Virtual card issued successfully'),
        message: i18n.t('This card is immediately available inside the ClearSpend app.'),
      });
    } else if (hasPhysicalCard) {
      messages.success({
        title: i18n.t('Physical card issued successfully'),
        message: i18n.t('Please allow 5-10 days for this card to arrive.'),
      });
    }
    // TODO: after CAP-842, redirect to created card if possible
    navigate(location.state?.prev || '/cards');
  };

  return (
    <Page title={<Text message="New Card" />}>
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={mcc.error}>
          <LoadingError onReload={mcc.reload} />
        </Match>
        <Match when={users.error}>
          <LoadingError onReload={users.reload} />
        </Match>
        <Match when={allocations.loading || (users.loading && !users.data?.length) || mcc.loading}>
          <Loading />
        </Match>
        <Match when={allocations.data?.length && mcc.data?.length}>
          <EditCardForm
            userId={location.state?.userId}
            allocationId={location.state?.allocationId}
            users={users.data!}
            mccCategories={mcc.data!}
            allocations={allocations.data!}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
          />
        </Match>
      </Switch>
    </Page>
  );
}
