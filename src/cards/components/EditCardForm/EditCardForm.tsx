import { createMemo, createEffect, Show, untrack, batch, createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { SwitchBox } from 'app/components/SwitchBox';
import { PageActions } from 'app/components/Page';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { getAllocation } from 'allocations/services';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import {
  getCategories,
  getChannels,
  getPurchasesLimits,
  getDefaultLimits,
  checkSameLimits,
} from 'allocations/utils/convertFormLimits';
import { AddressSelect } from 'employees/components/AddressSelect';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { SelectEmployee } from 'employees/components/SelectEmployee';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  Address,
  Allocation,
  AllocationDetailsResponse,
  CreateUserRequest,
  CreateUserResponse,
  IssueCardRequest,
  UserData,
  User,
} from 'generated/capital';
import { getBusiness } from 'app/services/businesses';
import { getUser } from 'employees/services';
import type { MccGroup } from 'transactions/types';
import { CardType } from 'cards/types';

import { CardTypeSelect } from '../CardTypeSelect';
import { ResetLimits } from '../ResetLimits';
import { formatNameString } from '../../../employees/utils/formatName';
import { LimitsForm } from '../LimitsForm/LimitsForm';

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

  const [showEmployee, toggleShowEmployee] = useBool();
  const [loading, save] = wrapAction(props.onSave);
  const [employee, setEmployee] = createSignal<User>();

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>(
    getFormOptions({ userId: props.userId, allocationId: props.allocationId }),
  );

  const [allocationData, , , setAllocationId, , mutateAllocationData] = useResource(
    getAllocation,
    props.allocationId,
    Boolean(props.allocationId),
  );
  const [business] = useResource(getBusiness, null);

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await props.onAddEmployee(data);
    handlers.employee(resp.userId);
    toggleShowEmployee();
  };

  const onChangeEmployee = async () => {
    setEmployee(await getUser(values().employee));
  };

  const onReset = () => {
    skipUpdates = true;
    reset();
    skipUpdates = false;
  };

  const onSubmit = async () => {
    skipUpdates = true;
    if (loading() || hasErrors(trigger())) return;
    await save(convertFormData(values(), props.mccCategories));
    skipUpdates = false;
  };

  const allocation = createMemo(() => {
    const id = values().allocationId;
    return Boolean(id) ? props.allocations.find(allocationWithID(id)) : undefined;
  });

  const ownerName = createMemo(() => {
    const { employee: userId, personal } = values();
    const user = !!userId && personal ? props.users.find((item) => item.userId === userId) : undefined;
    return user && formatNameString(user);
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

  const handleAddressChange = (v: Address) => {
    handlers.streetLine1(v.streetLine1 || '');
    handlers.streetLine2(v.streetLine2 || '');
    handlers.locality(v.locality || '');
    handlers.region(v.region || '');
    handlers.postalCode(v.postalCode || '');
  };

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
            onChange={(e) => {
              handlers.employee(e);
              onChangeEmployee();
            }}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Card info" />}
        description={
          <Text message="Virtual cards can be accessed through the ClearSpend mobile app or added to your Apple or Android wallet." />
        }
      >
        <FormItem multiple label={<Text message="Card type(s)" />} error={errors().types}>
          <CardTypeSelect value={values().types} name={ownerName()} class={css.types} onChange={handlers.types} />
        </FormItem>
        <SwitchBox
          name="name-on-card"
          checked={values().personal}
          label={<Text message="Show employee name" />}
          class={css.box}
          onChange={handlers.personal}
        />
      </Section>
      <Show when={values().types.includes(CardType.PHYSICAL)}>
        <Section
          title={<Text message="Delivery address" />}
          description={<Text message="Select where you would like the card delivered" />}
        >
          <FormItem error={errors().streetLine1 || errors().locality || errors().region || errors().postalCode}>
            <AddressSelect
              onChange={handleAddressChange}
              businessAddress={business()?.address}
              employeeAddress={employee()?.address}
            />
          </FormItem>
        </Section>
      </Show>
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
        <LimitsForm values={values()} handlers={handlers} mccCategories={props.mccCategories} />
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
