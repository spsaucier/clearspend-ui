import { Show, For } from 'solid-js';

import { useBool } from '_common/utils/useBool';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Select, Option } from '_common/components/Select';
import { Icon } from '_common/components/Icon';
import { Switch } from '_common/components/Switch';
import { Drawer } from '_common/components/Drawer';
import type { UUIDString } from 'app/types/common';
import { useMessages } from 'app/containers/Messages/context';
import { Section } from 'app/components/Section';
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
  return !!value.length || 'Required field';
}

interface FormValues {
  allocation: string;
  employee: string;
  types: CardType[];
  personal: boolean;
}

interface EditCardFormProps {
  users: readonly Readonly<BaseUser>[];
  allocations: readonly Readonly<Allocation>[];
  onAddEmployee: (firstName: string, lastName: string, email: string) => Promise<Readonly<CreateUserResp>>;
  onSave: (params: Readonly<IssueCard>) => Promise<unknown>;
}

export function EditCardForm(props: Readonly<EditCardFormProps>) {
  const messages = useMessages();
  const [showEmployee, toggleShowEmployee] = useBool();

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>({
    defaultValues: { allocation: '', employee: '', types: [], personal: false },
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
        messages.error({ title: 'Something going wrong' });
      });
  };

  return (
    <Form class={css.form}>
      <Section title="Company info">
        <FormItem
          label="Allocation"
          extra="Choose the allocation that will fund your new card. "
          error={errors().allocation}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().allocation}
            placeholder="Select allocation"
            error={Boolean(errors().allocation)}
            onChange={handlers.allocation}
          />
        </FormItem>
        <FormItem label="Employee" error={errors().employee} class={css.field}>
          {/* TODO: implement search by API */}
          <Select
            name="employee"
            value={values().employee}
            placeholder="Search by employee name"
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
        title="Card info"
        description={
          'Virtual cards can be accessed through the ClearSpend mobile app or added to your Apple or Android wallet.'
        }
      >
        <FormItem label="Card type(s)" error={errors().types}>
          <CardTypeSelect value={values().types} class={css.types} onChange={handlers.types} />
        </FormItem>
        <FormItem extra="If you select no, then the card will display the name of the company." class={css.field}>
          <Switch name="name-on-card" value={values().personal} onChange={handlers.personal}>
            Employee name on card
          </Switch>
        </FormItem>
      </Section>
      <Drawer open={showEmployee()} title="New Employee" onClose={toggleShowEmployee}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action="Create Card" onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
