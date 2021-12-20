import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useBool } from '_common/utils/useBool';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { SelectEmployee } from 'employees/components/SelectEmployee';
import { InputCurrency } from '_common/components/InputCurrency';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  Allocation,
  UserData,
  MccGroup,
  CreateUserRequest,
  CreateUserResponse,
  CreateAllocationRequest,
} from 'generated/capital';

import { AllocationSelect } from '../AllocationSelect';
import { PAYMENT_TYPES, SwitchPaymentTypes } from '../SwitchPaymentTypes';
import { SwitchMccCategories } from '../SwitchMccCategories';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './EditAllocationForm.css';

interface EditAllocationFormProps {
  users: readonly Readonly<UserData>[];
  allocations: readonly Readonly<Allocation>[];
  mccCategories: readonly Readonly<MccGroup>[];
  onAddEmployee: (userData: Readonly<CreateUserRequest>) => Promise<Readonly<CreateUserResponse>>;
  onSave: (data: Readonly<CreateAllocationRequest>) => Promise<unknown>;
}

export function EditAllocationForm(props: Readonly<EditAllocationFormProps>) {
  const [loading] = wrapAction(props.onSave);
  const i18n = useI18n();
  const messages = useMessages();

  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>(getFormOptions());

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await props.onAddEmployee(data);
    handlers.owner(resp.userId);
    toggleEmployeeDrawer();
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    await props.onSave(convertFormData(values(), PAYMENT_TYPES, props.mccCategories)).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  return (
    <Form class={css.form}>
      <Section title={<Text message="Allocation details" />}>
        <FormItem
          label={<Text message="Parent allocation" />}
          extra={<Text message="Choose the allocation that will fund your new allocation." />}
          error={errors().parent}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().parent}
            placeholder={String(i18n.t('Select allocation'))}
            error={Boolean(errors().parent)}
            onChange={handlers.parent}
          />
        </FormItem>
        <FormItem label={<Text message="Label" />} error={errors().name} class={css.field}>
          <Input
            name="allocation-label"
            value={values().name}
            placeholder={String(i18n.t('Enter allocation label (e.g. Marketing Team)'))}
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Balance" />}
        description={<Text message="Fund your allocation from the parent allocation." />}
      >
        <FormItem
          label={<Text message="Amount" />}
          extra={<Text message="The amount can not exceed the balance of the parent allocation." />}
          error={errors().amount}
          class={css.field}
        >
          <InputCurrency
            name="amount"
            placeholder={String(i18n.t('Enter amount'))}
            value={values().amount}
            error={Boolean(errors().amount)}
            onChange={handlers.amount}
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
            users={props.users}
            onAddClick={toggleEmployeeDrawer}
            onChange={handlers.owner}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Default Card Controls" />}
        description={
          <Text
            message={
              'Set default limits for how much can be spent with cards in this allocation. ' +
              'These can be customized when issuing new cards.'
            }
          />
        }
      >
        <FormItem multiple label={<Text message="Categories" />}>
          <SwitchMccCategories
            value={values().categories}
            items={props.mccCategories}
            class={css.box}
            onChange={handlers.categories}
          />
        </FormItem>
        <FormItem multiple label={<Text message="Payment types" />}>
          <SwitchPaymentTypes value={values().channels} class={css.box} onChange={handlers.channels} />
        </FormItem>
      </Section>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Create Allocation" />} onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
