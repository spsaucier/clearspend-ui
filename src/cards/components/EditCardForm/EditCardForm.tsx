import { createMemo, Show, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { useBool } from '_common/utils/useBool';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Select, Option } from '_common/components/Select';
import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Drawer } from '_common/components/Drawer';
import type { UUIDString } from 'app/types/common';
import { useMessages } from 'app/containers/Messages/context';
import { Section } from 'app/components/Section';
import { SwitchBox } from 'app/components/SwitchBox';
import { PageActions } from 'app/components/Page';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import type { Allocation } from 'allocations/types';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { formatName } from 'employees/utils/formatName';
import type { BaseUser, CreateUserResp } from 'employees/types';

import { CardTypeSelect } from '../CardTypeSelect';
import type { IssueCard, CardType } from '../../types';

import css from './EditCardForm.css';

function validTypes(value: readonly CardType[]): boolean | string {
  return !!value.length || String(i18n.t('Required field'));
}

interface FormValues {
  allocation: string;
  employee: string;
  types: CardType[];
  personal: boolean;
}

interface EditCardFormProps {
  userId?: UUIDString;
  allocationId?: UUIDString;
  users: readonly Readonly<BaseUser>[];
  allocations: readonly Readonly<Allocation>[];
  onAddEmployee: (firstName: string, lastName: string, email: string) => Promise<Readonly<CreateUserResp>>;
  onSave: (params: Readonly<IssueCard>) => Promise<unknown>;
}

export function EditCardForm(props: Readonly<EditCardFormProps>) {
  const messages = useMessages();
  const [showEmployee, toggleShowEmployee] = useBool();

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>({
    defaultValues: {
      allocation: props.allocationId || '',
      employee: props.userId || '',
      types: [],
      personal: false,
    },
    rules: { allocation: [required], employee: [required], types: [validTypes] },
  });

  const onAddEmployee = async (firstName: string, lastName: string, email: string) => {
    const resp = await props.onAddEmployee(firstName, lastName, email);
    handlers.employee(resp.userId);
    toggleShowEmployee();
  };

  const onSubmit = async () => {
    if (hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave({
        // TODO
        programId: '033955d1-f18e-497e-9905-88ba71e90208' as UUIDString,
        allocationId: data.allocation as UUIDString,
        userId: data.employee as UUIDString,
        currency: 'USD',
        cardType: data.types,
        isPersonal: data.personal,
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something going wrong') });
      });
  };

  const allocation = createMemo(() => {
    const id = values().allocation;
    return Boolean(id) ? props.allocations.find((item) => item.allocationId === id) : undefined;
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
          error={errors().allocation}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().allocation}
            placeholder={String(i18n.t('Select allocation'))}
            error={Boolean(errors().allocation)}
            onChange={handlers.allocation}
          />
        </FormItem>
        <FormItem label={<Text message="Employee" />} error={errors().employee} class={css.field}>
          {/* TODO: implement search by API */}
          <Select
            name="employee"
            value={values().employee}
            placeholder={String(i18n.t('Search by employee name'))}
            popupRender={(list) => (
              <>
                {list}
                <button id="add-employee" class={css.addEmployee} onClick={toggleShowEmployee}>
                  <Icon name="add-circle-outline" size="sm" class={css.addEmployeeIcon} />
                  Add New Employee
                </button>
              </>
            )}
            error={Boolean(errors().employee)}
            onChange={handlers.employee}
          >
            <For each={props.users}>{(item) => <Option value={item.userId}>{formatName(item)}</Option>}</For>
          </Select>
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
            <Input placeholder={String(i18n.t('$ Enter the amount'))} />
          </FormItem>
        </SwitchBox>
        <SwitchBox disabled checked={false} label={<Text message="Monthly limit" />} class={css.switchBox}>
          <FormItem
            label={<Text message="Amount" />}
            extra={<Text message="Max value: {amount}" amount={formatCurrency(0)} />}
          >
            <Input placeholder={String(i18n.t('$ Enter the amount'))} />
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
