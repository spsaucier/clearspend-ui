import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { useBool } from '_common/utils/useBool';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Drawer } from '_common/components/Drawer';
import { useMessages } from 'app/containers/Messages/context';
import { Section } from 'app/components/Section';
import { SwitchBox } from 'app/components/SwitchBox';
import { PageActions } from 'app/components/Page';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { SelectEmployee } from 'employees/components/SelectEmployee';
import { InputCurrency } from '_common/components/InputCurrency';
import { formatName } from 'employees/utils/formatName';
import { wrapAction } from '_common/utils/wrapAction';
import type { Allocation, CreateUserRequest, CreateUserResponse, IssueCardRequest, UserData } from 'generated/capital';
import type { CardType } from 'cards/types';

import { CardTypeSelect } from '../CardTypeSelect';

import css from './EditCardForm.css';

function validTypes(value: readonly CardType[]): boolean | string {
  return !!value.length || String(i18n.t('Required field'));
}

interface FormValues {
  allocationId: string;
  employee: string;
  types: CardType[];
  personal: boolean;
}

interface EditCardFormProps {
  userId?: string;
  allocationId?: string;
  users: readonly Readonly<UserData>[];
  allocations: readonly Readonly<Allocation>[];
  onAddEmployee: (userData: Readonly<CreateUserRequest>) => Promise<Readonly<CreateUserResponse>>;
  onSave: (params: Readonly<IssueCardRequest>) => Promise<Readonly<void>>;
}

export function EditCardForm(props: Readonly<EditCardFormProps>) {
  const [loading] = wrapAction(props.onSave);
  const messages = useMessages();
  const [showEmployee, toggleShowEmployee] = useBool();

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>({
    defaultValues: {
      allocationId: props.allocationId || '',
      employee: props.userId || '',
      types: [],
      personal: false,
    },
    rules: { allocationId: [required], employee: [required], types: [validTypes] },
  });

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await props.onAddEmployee(data);
    handlers.employee(resp.userId);
    toggleShowEmployee();
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave({
        // TODO
        programId: '033955d1-f18e-497e-9905-88ba71e90208',
        allocationId: data.allocationId,
        userId: data.employee,
        currency: 'USD',
        cardType: data.types,
        isPersonal: data.personal,
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const allocation = createMemo(() => {
    const id = values().allocationId;
    return Boolean(id) ? props.allocations.find(allocationWithID(id)) : undefined;
  });

  const ownerName = createMemo(() => {
    const id = values().employee;
    const user = Boolean(id) && values().personal ? props.users.find((item) => item.userId === id) : undefined;
    return user && formatName(user);
  });

  return (
    <Form class={css.form}>
      <Section title={<Text message="Company info" />}>
        <FormItem
          label={<Text message="Allocation" />}
          extra={<Text message="Choose the allocation that will fund your new card." />}
          error={errors().allocationId}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().allocationId}
            placeholder={String(i18n.t('Select allocation'))}
            error={Boolean(errors().allocationId)}
            onChange={handlers.allocationId}
          />
        </FormItem>
        <FormItem label={<Text message="Employee" />} error={errors().employee} class={css.field}>
          <SelectEmployee
            value={values().employee}
            error={Boolean(errors().employee)}
            users={props.users}
            onAddClick={toggleShowEmployee}
            onChange={handlers.employee}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Card info" />}
        description={
          <Text message="Virtual cards can be accessed through the ClearSpend mobile app or added to your Apple or Android wallet." />
        }
      >
        <FormItem label={<Text message="Card type(s)" />} error={errors().types}>
          <CardTypeSelect
            value={values().types}
            allocation={allocation()?.name}
            balance={allocation()?.account.ledgerBalance.amount}
            name={ownerName()}
            class={css.types}
            onChange={handlers.types}
          />
        </FormItem>
        <SwitchBox
          name="name-on-card"
          checked={values().personal}
          label={<Text message="Show employee name" />}
          class={css.switchBox}
          onChange={handlers.personal}
        />
      </Section>
      <Section
        title={<Text message="Spend Controls" />}
        description={
          <Text
            message={
              'Set limits for how much can be spent with this card for each transaction, ' +
              'or over the course of a day or o month.'
            }
          />
        }
      >
        <SwitchBox disabled checked={false} label={<Text message="Daily limit" />} class={css.switchBox}>
          <FormItem
            label={<Text message="Amount" />}
            extra={<Text message="Max value: {amount}" amount={formatCurrency(0)} />}
          >
            <InputCurrency placeholder={String(i18n.t('Enter amount'))} />
          </FormItem>
        </SwitchBox>
        <SwitchBox disabled checked={false} label={<Text message="Monthly limit" />} class={css.switchBox}>
          <FormItem
            label={<Text message="Amount" />}
            extra={<Text message="Max value: {amount}" amount={formatCurrency(0)} />}
          >
            <InputCurrency placeholder={String(i18n.t('Enter amount'))} />
          </FormItem>
        </SwitchBox>
      </Section>
      <Drawer open={showEmployee()} title={<Text message="New Employee" />} onClose={toggleShowEmployee}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Create Card" />} onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
