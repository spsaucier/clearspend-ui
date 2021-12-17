import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useBool } from '_common/utils/useBool';
import { Drawer } from '_common/components/Drawer';
import { wrapAction } from '_common/utils/wrapAction';
import { PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { SelectEmployee } from 'employees/components/SelectEmployee';
import { useUsersList } from 'employees/stores/usersList';
import { saveUser } from 'employees/services';
import type { Allocation, CreateUserRequest } from 'generated/capital';

import { updateAllocation } from '../../services';

import css from './Settings.css';

interface FormValues {
  name: string;
  owner: string;
}

interface SettingsProps {
  allocation: Readonly<Allocation>;
  onReload: () => Promise<unknown>;
}

export function Settings(props: Readonly<SettingsProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, addUser] = wrapAction(saveUser);
  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const users = useUsersList({ initValue: [] });

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { name: props.allocation.name, owner: props.allocation.ownerId },
    rules: { name: [required], owner: [required] },
  });

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await addUser(data);
    await users.reload();
    handlers.owner(resp.userId);
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    toggleEmployeeDrawer();
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const data = values();
    const updated = await updateAllocation(props.allocation.allocationId, { name: data.name, ownerId: data.owner });
    await props.onReload();
    reset({ name: updated.allocation!.name, owner: updated.owner!.userId });

    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('Changes successfully saved.'),
    });
  };

  return (
    <Form>
      <Section title={<Text message="Allocation details" />}>
        <FormItem label={<Text message="Label" />} class={css.field} error={errors().name}>
          <Input
            name="allocation-label"
            value={values().name}
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Owner(s)" />}
        description={
          <Text
            message={
              'Add additional allocation owners. ' +
              'By default, owners of the parent allocation will be able to view this allocation.'
            }
          />
        }
      >
        <FormItem label={<Text message="Allocation owner(s)" />} error={errors().owner} class={css.field}>
          <SelectEmployee
            value={values().owner}
            error={Boolean(errors().owner)}
            users={users.data!}
            onAddClick={toggleEmployeeDrawer}
            onChange={handlers.owner}
          />
        </FormItem>
      </Section>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Update Allocation" />} onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
