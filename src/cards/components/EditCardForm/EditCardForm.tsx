import { createMemo, createEffect, Show, untrack, batch } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Drawer } from '_common/components/Drawer';
import { useMessages } from 'app/containers/Messages/context';
import { Section } from 'app/components/Section';
import { SwitchBox } from 'app/components/SwitchBox';
import { PageActions } from 'app/components/Page';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { SwitchLimits } from 'allocations/components/SwitchLimits';
import { SwitchMccCategories } from 'allocations/components/SwitchMccCategories';
import { SwitchPaymentTypes } from 'allocations/components/SwitchPaymentTypes';
import { getAllocation } from 'allocations/services';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import {
  getCategories,
  getChannels,
  getATMLimits,
  getPurchasesLimits,
  getDefaultLimits,
  checkSameLimits,
} from 'allocations/utils/convertFormLimits';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { SelectEmployee } from 'employees/components/SelectEmployee';
import { formatName } from 'employees/utils/formatName';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  Allocation,
  AllocationDetailsResponse,
  CreateUserRequest,
  CreateUserResponse,
  IssueCardRequest,
  UserData,
  MccGroup,
  Amount,
} from 'generated/capital';

import { CardTypeSelect } from '../CardTypeSelect';
import { ResetLimits } from '../ResetLimits';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './EditCardForm.css';

interface EditCardFormProps {
  userId?: string;
  allocationId?: string;
  users: readonly Readonly<UserData>[];
  allocations: readonly Readonly<Allocation>[];
  mccCategories: readonly Readonly<MccGroup>[];
  onAddEmployee: (userData: Readonly<CreateUserRequest>) => Promise<Readonly<CreateUserResponse>>;
  onSave: (params: Readonly<IssueCardRequest>) => Promise<Readonly<void>>;
}

export function EditCardForm(props: Readonly<EditCardFormProps>) {
  let skipUpdates = false;

  const messages = useMessages();
  const [showEmployee, toggleShowEmployee] = useBool();
  const [loading, save] = wrapAction(props.onSave);

  const [allocationData, , , setAllocationId, , mutateAllocationData] = useResource(
    getAllocation,
    props.allocationId,
    Boolean(props.allocationId),
  );

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>(
    getFormOptions({ userId: props.userId, allocationId: props.allocationId }),
  );

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await props.onAddEmployee(data);
    handlers.employee(resp.userId);
    toggleShowEmployee();
  };

  const onReset = () => {
    skipUpdates = true;
    reset();
    skipUpdates = false;
  };

  const onSubmit = async () => {
    skipUpdates = true;
    if (loading() || hasErrors(trigger())) return;
    await save(convertFormData(values(), props.mccCategories)).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
    skipUpdates = false;
  };

  const allocation = createMemo(() => {
    const id = values().allocationId;
    return Boolean(id) ? props.allocations.find(allocationWithID(id)) : undefined;
  });

  const maxAmount = createMemo(() => {
    return allocation()?.account.ledgerBalance || ({ currency: 'USD', amount: 0 } as Amount);
  });

  const ownerName = createMemo(() => {
    const id = values().employee;
    const user = Boolean(id) && values().personal ? props.users.find((item) => item.userId === id) : undefined;
    return user && formatName(user);
  });

  createEffect(() => {
    const prevID = untrack(allocationData)?.allocation.allocationId;
    const currID = allocation()?.allocationId;
    if (!currID && prevID) mutateAllocationData(null);
    else if (currID && currID !== prevID) setAllocationId(currID);
  });

  const updateLimits = (data: Required<AllocationDetailsResponse> | null) => {
    batch(() => {
      handlers.categories(data ? getCategories(data, props.mccCategories) : []);
      handlers.channels(data ? getChannels(data) : []);
      handlers.purchasesLimits(data ? getPurchasesLimits(data) : getDefaultLimits());
      handlers.atmLimits(data ? getATMLimits(data) : getDefaultLimits());
    });
  };

  createEffect(() => {
    const data = allocationData();
    if (!skipUpdates) updateLimits(data);
  });

  const onResetLimits = () => {
    updateLimits(allocationData());
  };

  const isSameLimits = createMemo(() => checkSameLimits(values(), allocationData(), props.mccCategories));

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
          class={css.box}
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
        <FormItem multiple label={<Text message="Purchases" />}>
          <SwitchLimits
            name="purchases"
            value={values().purchasesLimits}
            maxAmount={maxAmount()}
            class={css.box}
            onChange={handlers.purchasesLimits}
          />
        </FormItem>
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
        <FormItem multiple label={<Text message="ATM transactions" />}>
          <SwitchLimits
            name="atm"
            value={values().atmLimits}
            maxAmount={maxAmount()}
            class={css.box}
            onChange={handlers.atmLimits}
          />
        </FormItem>
        <ResetLimits disabled={isSameLimits()} class={css.box} onClick={onResetLimits} />
      </Section>
      <Drawer open={showEmployee()} title={<Text message="New Employee" />} onClose={toggleShowEmployee}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Create Card" />} onCancel={onReset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
