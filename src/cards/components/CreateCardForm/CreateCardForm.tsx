import { createMemo, createEffect, Show, createSignal, Setter, onMount, Switch, Match, For } from 'solid-js';
import { Text } from 'solid-i18n';
import { createObject } from 'solid-proxies';
import { createSlider } from 'solid-slider';

import { i18n } from '_common/api/intl';
import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { useBusiness } from 'app/containers/Main/context';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { getAllocation } from 'allocations/services';
import { checkSameLimits } from 'allocations/utils/convertFormLimits';
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
  UserData,
  User,
  SearchCardData,
  IssueCardRequest,
} from 'generated/capital';
import { getUser } from 'employees/services';
import type { MccGroup } from 'transactions/types';
import { CardType, LegacyIssueCardRequest } from 'cards/types';
import { CustomPageActions } from 'app/components/Page/CustomPageActions';
import { useCards } from 'cards/stores/cards';
import { storage } from '_common/api/storage';
import { MENU_EXPANDED_KEY } from 'app/components/Sidebar/Sidebar';
import { getCard } from 'cards/services';
import { Loading } from 'app/components/Loading';
import type { FormLimits } from 'allocations/types';
import { Accordion } from '_common/components/Accordion/Accordion';
import {
  defaultValues,
  getFormOptions as getCardFormOptions,
} from 'allocations/components/DefaultCardControlsForm/utils';

import { CardTypeSelect } from '../CardTypeSelect';
import { ResetLimits } from '../ResetLimits';
import { formatNameString } from '../../../employees/utils/formatName';
import { LimitsForm } from '../LimitsForm/LimitsForm';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';
import { CreateCardActions } from './CreateCardActions';

import css from './CreateCardForm.css';

interface CreateCardFormProps {
  setCardType: Setter<LegacyIssueCardRequest['cardType']>;
  userId?: string;
  allocationId?: string;
  users: readonly Readonly<UserData>[];
  allocations: readonly Readonly<Allocation>[];
  mccCategories: readonly Readonly<MccGroup>[];
  onAddEmployee: (userData: Readonly<CreateUserRequest>) => Promise<Readonly<CreateUserResponse>>;
  onSave: (params: Readonly<IssueCardRequest>, card: SearchCardData | undefined) => Promise<Readonly<void>>;
}

export function CreateCardForm(props: Readonly<CreateCardFormProps>) {
  let skipUpdates = false;

  let ref!: HTMLDivElement;
  const options = {
    drag: false,
  };
  const [create, { current, next, prev, moveTo }] = createSlider(options);
  onMount(() => {
    create(ref);
  });

  const cardsStore = useCards({
    params: { pageRequest: { pageNumber: 0, pageSize: 500 }, types: ['PHYSICAL'], statuses: ['ACTIVE', 'INACTIVE'] },
  });

  const { business } = useBusiness();

  const [showEmployee, toggleShowEmployee] = useBool();
  const [loading, save] = wrapAction(props.onSave);
  const [employee, setEmployee] = createSignal<User>();

  const { values, errors, handlers, isDirty, trigger, reset } = createForm<FormValues>(
    getFormOptions({ userId: props.userId, allocationId: props.allocationId }),
  );

  const [allocationData, , , fetchAllocationById] = useResource(
    getAllocation,
    props.allocationId,
    Boolean(props.allocationId),
  );
  const allocationsCache = createObject<{ [key: string]: Readonly<AllocationDetailsResponse> }>({});
  createEffect(() => {
    if (allocationData()) {
      const id = allocationData()?.allocation.allocationId;
      if (id) {
        allocationsCache[id] = allocationData()!;
        setLimitsTo(allocationData());
      }
    }
  });

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
    moveTo(0);
    skipUpdates = false;
  };

  const onSubmit = async () => {
    skipUpdates = true;
    if (loading() || hasErrors(trigger())) {
      if (errors().streetLine1 || errors().locality || errors().region || errors().postalCode) {
        moveTo(1);
      }
      return;
    }
    await save(convertFormData(values(), allocationsLimitsMap, props.mccCategories), existingPhysicalCard());
    skipUpdates = false;
  };

  const ownerName = createMemo(() => {
    const { employee: userId, personal } = values();
    const user = !!userId && personal && props.users.find((item) => item.userId === userId);
    return user ? formatNameString(user) : business().businessName || business().legalName;
  });

  const allocationsLimitsMap = createObject<{ [allocationId: string]: FormLimits }>({});
  const updateAllocationField =
    (allocationId: string, field: 'categories' | 'international' | 'channels' | 'purchasesLimits') =>
    (data: Readonly<FormLimits[typeof field]>) => {
      allocationsLimitsMap[allocationId] = {
        ...defaultValues,
        ...allocationsLimitsMap[allocationId],
        [field]: data,
      };
    };
  const allocationHandlers = (allocationId: string) => ({
    categories: updateAllocationField(allocationId, 'categories'),
    international: updateAllocationField(allocationId, 'international'),
    channels: updateAllocationField(allocationId, 'channels'),
    purchasesLimits: updateAllocationField(allocationId, 'purchasesLimits'),
  });
  const setLimitsTo = (data: AllocationDetailsResponse | null) => {
    if (data?.allocation?.allocationId) {
      allocationsLimitsMap[data.allocation.allocationId] = getCardFormOptions(data, props.mccCategories).defaultValues;
    }
  };

  createEffect(() => {
    const data = allocationData();
    if (!skipUpdates) setLimitsTo(data);
  });

  const onResetLimits = (allocationId: string) => {
    const found = allocationsCache[allocationId];
    if (found) setLimitsTo(found);
  };

  const isSameLimits = (
    vals: Readonly<FormLimits> | undefined,
    cache: Omit<AllocationDetailsResponse, 'allocation'> | undefined,
  ) => {
    if (vals && cache) return checkSameLimits(vals, cache, props.mccCategories);
    return true;
  };

  const handleAddressChange = (v: Address) => {
    handlers.streetLine1(v.streetLine1 || '');
    handlers.streetLine2(v.streetLine2 || '');
    handlers.locality(v.locality || '');
    handlers.region(v.region || '');
    handlers.postalCode(v.postalCode || '');
  };

  const [fullCardData, cardStatus, , setCardParams] = useResource(getCard, '' as string, false);

  const existingPhysicalCard = createMemo(() =>
    cardsStore.data?.content?.find(
      // CANCELLED and VIRTUAL cards are already filtered out
      (c) => c.user?.userId === values().employee,
    ),
  );

  createEffect(() => {
    if (existingPhysicalCard()?.cardId) {
      setCardParams(existingPhysicalCard()?.cardId!);
    }
  });

  const existingPhysicalCardNumber = createMemo(() => {
    if (!existingPhysicalCard()) return false;
    if (!existingPhysicalCard()?.activated) return 'XXXX';
    return existingPhysicalCard()?.cardNumber;
  });

  const nextDisabled = createMemo(() => {
    if (current() === 0 && values().employee) return false;
    if (
      current() === 1 &&
      values().type &&
      (values().type !== 'PHYSICAL' ||
        (values().streetLine1 && values().locality && values().region && values().postalCode))
    )
      return false;
    if (current() <= 1) return true;
    return false;
  });

  const excludedIds = createMemo(() => [
    ...(fullCardData()?.allocationSpendControls.map((l) => l.allocationId) || []),
    ...values().allocations,
  ]);

  return (
    <Form class={css.form}>
      <div
        ref={ref}
        class={css.keenSlider}
        classList={{ [css.sidebarExpanded!]: storage.get<boolean>(MENU_EXPANDED_KEY, false) }}
      >
        <div class={css.keenSliderSlide}>
          {/* Use Show to prevent tabbing from breaking slider */}
          <Show when={current() === 0}>
            <Section title={<Text message="Employee" />}>
              <FormItem error={errors().employee} class={css.field}>
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
          </Show>
        </div>
        <div class={css.keenSliderSlide}>
          <div>
            {/* Use Show to prevent tabbing from breaking slider */}
            <Show when={current() === 1}>
              <Section title={<Text message="Type of card" />}>
                <FormItem multiple error={errors().type}>
                  <CardTypeSelect
                    existingPhysical={existingPhysicalCardNumber()}
                    value={values().type}
                    name={ownerName()}
                    class={css.types}
                    onChange={(type) => {
                      props.setCardType(type);
                      handlers.allocations([]);
                      handlers.type(type);
                    }}
                  />
                </FormItem>
              </Section>
              <Show when={values().type === CardType.PHYSICAL && !existingPhysicalCard()}>
                <Section
                  title={<Text message="Delivery address" />}
                  description={<Text message="Select where you would like the card delivered" />}
                >
                  <FormItem error={errors().streetLine1 || errors().locality || errors().region || errors().postalCode}>
                    <AddressSelect
                      onChange={handleAddressChange}
                      businessAddress={business().address}
                      employeeAddress={employee()?.address}
                    />
                  </FormItem>
                </Section>
              </Show>
            </Show>
          </div>
        </div>
        <div class={css.keenSliderSlide}>
          {/* Use Show to prevent tabbing from breaking slider */}
          <Show when={current() > 1}>
            <div>
              <Show when={!cardStatus().loading} fallback={<Loading />}>
                <Switch
                  fallback={
                    <Section title={<Text message="Allocations" />}>
                      <FormItem
                        extra={<Text message="Choose allocations to fund your card." />}
                        error={errors().allocations}
                        class={css.field}
                      >
                        <AllocationSelect
                          items={props.allocations}
                          excludedIds={excludedIds()}
                          values={values().allocations}
                          placeholder={String(i18n.t('Select allocation'))}
                          error={Boolean(errors().allocations)}
                          onChangeMulti={(ids) => {
                            if (ids.length > values().allocations.length) fetchAllocationById(ids[ids.length - 1]!);
                            handlers.allocations(ids);
                          }}
                        />
                      </FormItem>
                    </Section>
                  }
                >
                  <Match when={values().type === CardType.VIRTUAL}>
                    <Section title={<Text message="Allocation" />}>
                      <FormItem
                        extra={<Text message="Choose an allocation to fund your card." />}
                        error={errors().allocations}
                        class={css.field}
                      >
                        <AllocationSelect
                          items={props.allocations}
                          excludedIds={excludedIds()}
                          value={values().allocations[0]}
                          placeholder={String(i18n.t('Select allocation'))}
                          error={Boolean(errors().allocations)}
                          onChange={(id) => {
                            if (id) fetchAllocationById(id);
                            handlers.allocations(id ? [id] : []);
                          }}
                        />
                      </FormItem>
                    </Section>
                  </Match>
                </Switch>
              </Show>
              <Show when={values().allocations.length}>
                <Section
                  title={<Text message="Spend Controls" />}
                  description={
                    <Text
                      message={
                        'Set limits for how much can be spent with this card for each transaction, ' +
                        'or over the course of a day or month.'
                      }
                    />
                  }
                >
                  <Switch
                    fallback={
                      <Accordion
                        class={css.accordion}
                        items={values().allocations.map((id) => ({
                          title: allocationsCache[id]?.allocation?.name,
                          content: (
                            <>
                              <LimitsForm
                                values={allocationsLimitsMap[id] || defaultValues}
                                handlers={allocationHandlers(id!)}
                                mccCategories={props.mccCategories}
                              />
                              <ResetLimits
                                disabled={isSameLimits(allocationsLimitsMap[id], allocationsCache[id])}
                                class={css.box}
                                onClick={() => onResetLimits(id)}
                              />
                            </>
                          ),
                        }))}
                      />
                    }
                  >
                    <Match when={values().type === CardType.VIRTUAL}>
                      <For each={values().allocations}>
                        {(id) => (
                          <>
                            <LimitsForm
                              values={allocationsLimitsMap[id] || defaultValues}
                              handlers={allocationHandlers(id!)}
                              mccCategories={props.mccCategories}
                            />
                            <ResetLimits
                              disabled={isSameLimits(allocationsLimitsMap[id], allocationsCache[id])}
                              class={css.box}
                              onClick={() => onResetLimits(id)}
                            />
                          </>
                        )}
                      </For>
                    </Match>
                  </Switch>
                </Section>
              </Show>
            </div>
          </Show>
        </div>
      </div>
      <Drawer open={showEmployee()} title={<Text message="New Employee" />} onClose={toggleShowEmployee}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty() || values().employee}>
        <CustomPageActions
          children={
            <CreateCardActions
              next={next}
              prev={prev}
              current={current()}
              action={existingPhysicalCard() ? <Text message="Add allocation(s)" /> : <Text message="Create Card" />}
              onCancel={onReset}
              onSave={onSubmit}
              values={values()}
              errors={errors()}
              nextDisabled={nextDisabled()}
              nextLoading={cardsStore.loading}
            />
          }
        />
      </Show>
    </Form>
  );
}
