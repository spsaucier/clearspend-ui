import { Text } from 'solid-i18n';
import { Show, createSignal, createEffect, createMemo } from 'solid-js';

import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import type { Business, CreateOrUpdateBusinessOwnerRequest, User, BusinessOwner } from 'generated/capital';
import { Radio, RadioGroup } from '_common/components/Radio';
import { createBusinessOwner, listBusinessOwners, updateBusinessOwner } from 'onboarding/services/onboarding';
import { useResource } from '_common/utils/useResource';
import { Icon } from '_common/components/Icon';

import { LeadershipTable } from '../LeadershipTable';

import { CurrentUserForm } from './CurrentUserForm';
import { AddEditLeaderForm } from './AddEditLeaderForm';

import css from './TeamForm.css';

interface TeamFormProps {
  onNext: () => Promise<unknown>;
  currentUser: User;
  setTitle: (title: string) => void;
  business: Business | null;
  kycErrors?: Readonly<{ [key: string]: string[] }>;
  onLeaderUpdate: (leaderId: string) => void;
  setLoadingModalOpen: (loading: boolean) => void;
}

const hasOwner = (leader: CreateOrUpdateBusinessOwnerRequest) => !!leader.relationshipOwner;

export const ONBOARDING_LEADERS_KEY = 'ONBOARDING_LEADERS_KEY';

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();

  const [loading, next] = wrapAction(props.onNext);
  const [showAddingNewLeader, setShowAddingNewLeader] = createSignal(false);
  const [showOtherOwnersQuestion, setShowOtherOwnersQuestion] = createSignal(true);
  const [editingLeaderId, setEditingLeaderId] = createSignal('');

  const [ownersList, fetchingOwnersList, , , refetchOwnersList] = useResource(listBusinessOwners, []);
  const [updating, updateOwner] = wrapAction(updateBusinessOwner);

  const leaders = createMemo(() => {
    const value = ownersList() ?? [];
    return value;
  });

  const [hasOtherOwners, setHasOtherOwners] = createSignal(true);

  // Note: not all 'leaders' are owners
  const complete = createMemo(() => {
    return leaders().length && !hasOtherOwners() && leaders().some(hasOwner);
  });

  createEffect(() => {
    if (props.business?.type === 'SOLE_PROPRIETORSHIP') {
      setHasOtherOwners(false);
      setShowOtherOwnersQuestion(false);
    }
    if (leaders().length === 0 || !leaders()[0]?.taxIdentificationNumber) {
      props.setTitle(
        props.currentUser.relationshipToBusiness?.owner
          ? `As an owner of ${props.business?.legalName}, we need to know a little more about you`
          : `As a representative of ${props.business?.legalName}, we need to know a little more about you`,
      );
    } else if (showAddingNewLeader()) {
      props.setTitle('To add an owner or manager, we need the following details');
    } else {
      // Skip the ownership question if it's unnecessary
      const totalAccountedFor = leaders().reduce(
        (a, b) => ({
          percentageOwnership: (a.percentageOwnership || 0) + (b.percentageOwnership || 0),
        }),
        {} as BusinessOwner,
      );
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      if (totalAccountedFor.percentageOwnership && totalAccountedFor.percentageOwnership >= 75) {
        setHasOtherOwners(false);
        setShowOtherOwnersQuestion(false);
        props.setTitle(`Is there anyone else that manages ${props.business?.legalName}?`);
      } else {
        props.setTitle(`Is there anyone else that owns or manages ${props.business?.legalName}?`);
      }
    }
  });

  return (
    <Show when={!fetchingOwnersList().loading}>
      <Show when={leaders().length === 0 || !leaders()[0]?.taxIdentificationNumber}>
        <CurrentUserForm
          business={props.business!}
          currentUser={props.currentUser}
          onNext={async (businessOwner: CreateOrUpdateBusinessOwnerRequest) => {
            props.setLoadingModalOpen(true);
            await updateOwner({ ...businessOwner, id: props.currentUser.userId });
            await refetchOwnersList();
            props.setLoadingModalOpen(false);
          }}
        />
      </Show>
      <Show when={showAddingNewLeader()}>
        <AddEditLeaderForm
          business={props.business!}
          leader={leaders().find((l) => l.businessOwnerId === editingLeaderId())}
          isCurrentUser={!!leaders().find((l) => l.businessOwnerId === editingLeaderId())}
          onNext={async (leader: CreateOrUpdateBusinessOwnerRequest) => {
            props.setLoadingModalOpen(true);
            if (editingLeaderId()) {
              await updateOwner({ ...leader, id: editingLeaderId() });
              props.onLeaderUpdate(editingLeaderId());
            } else {
              await createBusinessOwner(leader);
            }

            await refetchOwnersList();
            setShowAddingNewLeader(false);
            props.setLoadingModalOpen(false);
          }}
          kycErrors={props.kycErrors?.[editingLeaderId()]}
        />
      </Show>
      <Show when={leaders().length > 0 && leaders()[0]?.taxIdentificationNumber && !showAddingNewLeader()}>
        <div class={css.tableWrapper}>
          <LeadershipTable
            business={props.business!}
            currentUserEmail={props.currentUser.email}
            leaders={leaders()}
            leaderIdsWithError={
              props.kycErrors
                ? Object.keys(props.kycErrors).filter((key) => (props.kycErrors?.[key] as string[]).length > 0)
                : []
            }
            onAddClick={() => {
              setEditingLeaderId('');
              setShowAddingNewLeader(true);
            }}
            // FIXME
            // eslint-disable-next-line
            onDeleteClick={() => console.log('tbd')}
            onEditClick={(id) => {
              setEditingLeaderId(id);
              setShowAddingNewLeader(true);
            }}
          />
          <div class={css.rightContent}>
            <div class={css.title}>You must include:</div>
            <Show when={props.business?.type !== 'SOLE_PROPRIETORSHIP'}>
              <div class={css.copy}>
                <div>
                  <Icon name="information" />
                </div>
                <div>Everyone who owns 25% or more of the company.</div>
              </div>
            </Show>
            <div class={css.copy}>
              <div>
                <Icon name="information" />
              </div>
              <div>
                At least one individual whose role or title allows them to sign contracts for your business.
                <div class={css.examples}>
                  Examples include: Chief Executive Officer, Chief Financial Officer, Chief Operating Officer,
                  Management Member, General Partner, President, Vice President, or Treasurer.
                </div>
              </div>
            </div>
          </div>
        </div>
        <Show when={showOtherOwnersQuestion()}>
          <div class={css.field}>
            <Text message="Is there anyone else who owns 25% or more of the company?" />
            <RadioGroup value={hasOtherOwners()} name="more-owners" onChange={setHasOtherOwners}>
              <Radio value={true}>
                <Text message="Yes" />
              </Radio>
              <Radio value={false}>
                <Text message="No" />
              </Radio>
            </RadioGroup>
          </div>
        </Show>
        <div class={css.field}>
          <Button
            wide={media.small}
            type="primary"
            disabled={hasOtherOwners() && (!complete() || loading())}
            loading={loading() || updating()}
            onClick={() => {
              next();
            }}
          >
            <Text message="Next" />
          </Button>
        </div>
      </Show>
    </Show>
  );
}
