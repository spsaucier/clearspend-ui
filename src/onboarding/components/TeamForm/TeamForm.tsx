import { Text } from 'solid-i18n';
import { Show, createSignal, createEffect, createMemo } from 'solid-js';
import { nanoid } from 'nanoid';

import { useMessages } from 'app/containers/Messages/context';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import type { Business, CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { Radio, RadioGroup } from '_common/components/Radio';
import { storage } from '_common/api/storage';

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

const hasOwner = (l: CreateOrUpdateBusinessOwnerRequest) => !!l.relationshipOwner;
// const hasExecutive = (l: CreateOrUpdateBusinessOwnerRequest) => !!l.relationshipExecutive;

export const ONBOARDING_LEADERS_KEY = 'ONBOARDING_LEADERS_KEY';

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);
  const [leaders, setLeaders] = createSignal<CreateOrUpdateBusinessOwnerRequest[]>(
    storage.get<CreateOrUpdateBusinessOwnerRequest[]>(ONBOARDING_LEADERS_KEY, []),
  );
  const [moreOwners, setMoreOwners] = createSignal('1');
  const [editingId, setEditingId] = createSignal('');

  const onAddClick = () => setEditingId(nanoid());
  const onDeleteClick = (id: string) => setLeaders((oldVal) => oldVal.filter((o) => o.id !== id));
  const onEditClick = setEditingId;

  const complete = createMemo(() => {
    return leaders().length && !moreOwners() && leaders().some(hasOwner);
    // leaders().some(hasExecutive);
  });

  const submitLeaders = () => {
    next(leaders()).catch(() => {
      messages.error({ title: 'Failed to save leaders' });
    });
  };

  createEffect(() => {
    if (!leaders().length) {
      props.setTitle(
        props.signupUser.relationshipToBusiness?.owner
          ? `As an owner of ${props.business?.legalName}, we need to know a little more about you`
          : `As a representative of ${props.business?.legalName}, we need to know a little more about you`,
      );
    } else if (editingId()) {
      props.setTitle('To add a new owner or manager, we need the following details:');
    } else {
      props.setTitle(`Is there anyone else that owns or manages ${props.business?.legalName}?`);
    }
  });

  return (
    <>
      <Show
        when={leaders().length}
        fallback={
          <CurrentUserForm
            signupUser={props.signupUser}
            onNext={(leader: CreateOrUpdateBusinessOwnerRequest) =>
              new Promise((resolve) => {
                const leaderWithId = { id: nanoid(), ...leader };
                setLeaders([leaderWithId]);
                storage.set(ONBOARDING_LEADERS_KEY, [leaderWithId]);
                messages.success({ title: `Leader added successfully` });
                resolve(leaderWithId);
              })
            }
          />
        }
      >
        <Show
          when={!editingId()}
          fallback={
            <AddEditLeaderForm
              leader={leaders().find((l) => l.id === editingId())}
              isSignupUser={!!leaders().find((l) => l.id === editingId())}
              onNext={(leader: CreateOrUpdateBusinessOwnerRequest) =>
                new Promise((resolve) => {
                  const existingLeader = leaders().find((l) => l.id === editingId());
                  if (existingLeader) {
                    setLeaders((oldLeaders) => [...oldLeaders.filter((l) => l.id !== existingLeader.id), leader]);
                  } else {
                    setLeaders((oldLeaders) => [...oldLeaders, leader]);
                  }
                  setTimeout(() => storage.set(ONBOARDING_LEADERS_KEY, leaders()));
                  setEditingId('');
                  messages.success({ title: `Leader ${existingLeader ? 'edited' : 'added'} successfully` });
                  resolve(leader);
                })
              }
            />
          }
        >
          <LeadershipTable
            currentUserEmail={props.signupUser.email}
            leaders={leaders()}
            onAddClick={onAddClick}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
          />
          <div class={css.field}>
            <Text message="Is there anyone else who owns 25% or more of the company?" />
            <RadioGroup name="moreOwners" onChange={(v) => setMoreOwners(v as string)}>
              <Radio value="1">
                <Text message="Yes" />
              </Radio>
              <Radio value="">
                <Text message="No" />
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Button
              wide={media.small}
              type="primary"
              disabled={!complete() || loading()}
              loading={loading()}
              onClick={submitLeaders}
            >
              <Text message="Next" />
            </Button>
          </div>
        </Show>
      </Show>
    </>
  );
}
