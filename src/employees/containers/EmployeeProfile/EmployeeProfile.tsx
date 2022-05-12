import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { wrapAction } from '_common/utils/wrapAction';
import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';
import { Section } from 'app/components/Section';
import { useBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import type { User } from 'generated/capital';

import { ProfileInfo } from '../../components/ProfileInfo';
import { archiveUser } from '../../services';

import css from './EmployeeProfile.css';

interface EmployeeProfileProps {
  data: Readonly<Required<User>>;
  canManage: boolean;
  onReload: () => Promise<void>;
}

export function EmployeeProfile(props: Readonly<EmployeeProfileProps>) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const messages = useMessages();
  const { currentUser } = useBusiness();

  const [archiving, archive] = wrapAction(archiveUser);

  const onArchive = () => {
    archive(props.data.userId)
      .then(() => {
        messages.success({ title: i18n.t('Employee successfully archived') });
        return props.onReload();
      })
      .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
  };

  return (
    <>
      <Section title={<Text message="Employee Info" />} class={css.section}>
        <ProfileInfo data={props.data} />
        <Show when={props.canManage && !props.data.archived}>
          <Button
            size="lg"
            icon="edit"
            class={css.updateButton}
            onClick={() => navigate(`/employees/edit/${props.data.userId}`)}
          >
            <Text message="Update Info" />
          </Button>
        </Show>
      </Section>
      <Show when={props.canManage && props.data.userId !== currentUser().userId && !props.data.archived}>
        <Section
          title={<Text message="Archive Employee" />}
          description={
            <Text
              message={
                'Archiving an employee cancels their cards and removes access to all of ClearSpend. ' +
                'Archiving an employee does not affect pending transactions or transaction records.'
              }
            />
          }
          class={css.section}
        >
          <Confirm
            position="top-center"
            question={
              <Text message="Are you sure you want to permanently archive this employee? This cannot be undone." />
            }
            confirmText={<Text message="Continue" />}
            onConfirm={onArchive}
          >
            {({ onClick }) => (
              <Button size="lg" icon="archive" type="danger" view="second" loading={archiving()} onClick={onClick}>
                <Text message="Archive employee" />
              </Button>
            )}
          </Confirm>
        </Section>
      </Show>
    </>
  );
}
