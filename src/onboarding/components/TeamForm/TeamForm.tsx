import { Text } from 'solid-i18n';
import { Show, createSignal, createEffect, createMemo } from 'solid-js';

import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import type { Business, CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { Radio, RadioGroup } from '_common/components/Radio';
import { createBusinessOwner, listBusinessOwners, updateBusinessOwner } from 'onboarding/services/onboarding';
import { useResource } from '_common/utils/useResource';
import { Icon } from '_common/components/Icon';

import { LeadershipTable } from '../LeadershipTable';

import { CurrentUserForm } from './CurrentUserForm';
import { AddEditLeaderForm } from './AddEditLeaderForm';

import css from './TeamForm.css';

interface TeamFormProps {
  onNext: (data: Readonly<CreateOrUpdateBusinessOwnerRequest[]>) => Promise<unknown>;
  signupUser: User;
  setTitle: (title: string) => void;
  business: Business | null;
}

const hasOwner = (leader: CreateOrUpdateBusinessOwnerRequest) => !!leader.relationshipOwner;

export const ONBOARDING_LEADERS_KEY = 'ONBOARDING_LEADERS_KEY';

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();

  const [loading, next] = wrapAction(props.onNext);
  const [showAddingNewLeader, setShowAddingNewLeader] = createSignal(false);
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
    if (!leaders().length) {
      props.setTitle(
        props.signupUser.relationshipToBusiness?.owner
          ? `As an owner of ${props.business?.legalName}, we need to know a little more about you`
          : `As a representative of ${props.business?.legalName}, we need to know a little more about you`,
      );
    } else if (showAddingNewLeader()) {
      props.setTitle('To add a new owner or manager, we need the following details:');
    } else {
      props.setTitle(`Is there anyone else that owns or manages ${props.business?.legalName}?`);
    }
  });

  return (
    <Show when={!fetchingOwnersList().loading}>
      <Show when={leaders().length === 0}>
        <CurrentUserForm
          signupUser={props.signupUser}
          onNext={async (businessOwner: CreateOrUpdateBusinessOwnerRequest) => {
            await updateOwner({ ...businessOwner, id: props.signupUser.userId });
            await refetchOwnersList();
          }}
        />
      </Show>
      <Show when={showAddingNewLeader()}>
        <AddEditLeaderForm
          leader={leaders().find((l) => l.businessOwnerId === editingLeaderId())}
          isSignupUser={!!leaders().find((l) => l.businessOwnerId === editingLeaderId())}
          onNext={async (leader: CreateOrUpdateBusinessOwnerRequest) => {
            if (editingLeaderId()) {
              await updateOwner({ ...leader, id: editingLeaderId() });
            } else {
              await createBusinessOwner(leader);
            }

            await refetchOwnersList();
            setShowAddingNewLeader(false);
          }}
        />
      </Show>
      <Show when={leaders().length > 0 && !showAddingNewLeader()}>
        <div class={css.tableWrapper}>
          <LeadershipTable
            currentUserEmail={props.signupUser.email}
            leaders={leaders()}
            onAddClick={() => setShowAddingNewLeader(true)}
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
            <div class={css.copy}>
              <div>
                <Icon name="information" />
              </div>
              <div>Everyone who owns 25% or more of the company.</div>
            </div>
            <div class={css.copy}>
              <div>
                <Icon name="information" />
              </div>
              <div>
                At least one invidual whose role or title allows them to sign contracts for your business.
                <div class={css.examples}>
                  Examples include: Chief Executive Officer, Chief Financial Officer, Chief Operating Officer,
                  Management Member, General Partner, President, Vice President, or Treasurer.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class={css.field}>
          <Text message="Is there anyone else who owns 25% or more of the company?" />
          <RadioGroup name="more-owners" onChange={(v) => setHasOtherOwners(v as boolean)}>
            <Radio value={true}>
              <Text message="Yes" />
            </Radio>
            <Radio value={false}>
              <Text message="No" />
            </Radio>
          </RadioGroup>
        </div>
        <div>
          <Button
            wide={media.small}
            type="primary"
            disabled={hasOtherOwners() && (!complete() || loading())}
            loading={loading() || updating()}
            onClick={() => {
              next(leaders());
            }}
          >
            <Text message="Next" />
          </Button>
        </div>
      </Show>
    </Show>
  );
}
