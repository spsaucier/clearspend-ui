import { Show, createEffect, createSignal, Match, Switch, createMemo, For } from 'solid-js';
import { Text, useI18n } from 'solid-i18n';
import { createObject } from 'solid-proxies';
import { reset } from 'mixpanel-browser';

import { wrapAction } from '_common/utils/wrapAction';
import { useResource } from '_common/utils/useResource';
import { FormItem } from '_common/components/Form';
import { PageActions } from 'app/components/Page';
import { ResetLimits } from 'cards/components/ResetLimits';
import type { MccGroup } from 'transactions/types';
import { LimitsForm } from 'cards/components/LimitsForm/LimitsForm';
import type { AllocationDetailsResponse, CardAllocationSpendControls, CardDetailsResponse } from 'generated/capital';
import { checkSameLimits } from 'allocations/utils/convertFormLimits';
import { getAllocation } from 'allocations/services';
import type { FormLimits } from 'allocations/types';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { useBusiness } from 'app/containers/Main/context';
import { Accordion } from '_common/components/Accordion/Accordion';
import { defaultValues, getFormOptions } from 'allocations/components/DefaultCardControlsForm/utils';
import { CardType } from 'cards/types';
import { addAllocationsToCard, removeAllocationsFromCard } from 'cards/services';
import { Tag } from '_common/components/Tag';

import { convertToSpendControls } from '../CreateCardForm/utils';
import { useMessages } from '../../../app/containers/Messages/context';

import css from './CardControlsForm.css';

interface CardControlsFormProps {
  data: Readonly<CardDetailsResponse>;
  mccCategories: readonly Readonly<MccGroup>[];
  disabled?: boolean;
  onSave: (data: Readonly<CardAllocationSpendControls>[]) => Promise<unknown>;
}

export function CardControlsForm(props: Readonly<CardControlsFormProps>) {
  const { allocations } = useBusiness();
  const i18n = useI18n();
  const [loading, save] = wrapAction(props.onSave);
  const [isDirty, setIsDirty] = createSignal(false);
  const data = createMemo(() => props.data);
  const messages = useMessages();

  const [allocationIds, setAllocationIds] = createSignal(data().allocationSpendControls?.map((l) => l.allocationId));

  const [allocationData, , , fetchAllocationById] = useResource(
    getAllocation,
    data().linkedAllocationId,
    Boolean(data().linkedAllocationId),
  );
  const allocationsCache = createObject<{ [key: string]: Readonly<AllocationDetailsResponse> }>({});
  createEffect(() => {
    if (allocationData()) {
      const id = allocationData()?.allocation.allocationId;
      if (id) {
        allocationsCache[id] = allocationData()!;
      }
    }
  });
  createEffect(() => {
    allocationIds()?.forEach(async (id) => {
      if (!allocationsCache[id]) {
        fetchAllocationById(id);
      }
    });
  });

  createEffect(() => {
    if (data().allocationSpendControls) {
      data().allocationSpendControls?.forEach((c) => {
        allocationsLimitsMap[c.allocationId] = getFormOptions(c, props.mccCategories).defaultValues;
      });
    }
  });

  const allocationsLimitsMap = createObject<{ [allocationId: string]: FormLimits }>({});
  const updateAllocationField =
    (allocationId: string, field: 'categories' | 'international' | 'channels' | 'purchasesLimits') =>
    (newData: Readonly<FormLimits[typeof field]>) => {
      setIsDirty(true);
      allocationsLimitsMap[allocationId] = {
        ...defaultValues,
        ...allocationsLimitsMap[allocationId],
        [field]: newData,
      };
    };
  const allocationHandlers = (allocationId: string) => ({
    categories: updateAllocationField(allocationId, 'categories'),
    international: updateAllocationField(allocationId, 'international'),
    channels: updateAllocationField(allocationId, 'channels'),
    purchasesLimits: updateAllocationField(allocationId, 'purchasesLimits'),
  });
  const setLimitsTo = (newData: AllocationDetailsResponse | null) => {
    if (newData?.allocation?.allocationId) {
      allocationsLimitsMap[newData.allocation.allocationId] = getFormOptions(
        newData,
        props.mccCategories,
      ).defaultValues;
    }
  };

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

  const onSubmit = async () => {
    const controls = convertToSpendControls(allocationsLimitsMap, props.mccCategories);
    const newAllocationIds = allocationIds() || [];
    const oldAllocationIds = data().allocationSpendControls?.map((l) => l.allocationId) || [];
    const removedAllocations = oldAllocationIds.filter((c) => !newAllocationIds.includes(c));
    const addedAllocations = newAllocationIds.filter((c) => !oldAllocationIds.includes(c));
    const updatedAllocations = controls.filter(
      (c) => !removedAllocations.includes(c.allocationId) && !addedAllocations.includes(c.allocationId),
    );
    try {
      if (data().card.cardId) {
        if (removedAllocations.length) {
          await removeAllocationsFromCard(
            data().card.cardId!,
            removedAllocations.map((allocationId) => ({ allocationId })),
          );
        }
        if (addedAllocations.length) {
          await addAllocationsToCard(
            data().card.cardId!,
            controls.filter((c) => addedAllocations.includes(c.allocationId)),
          );
        }
        await save(updatedAllocations);
      }
    } catch {
      messages.error({ title: i18n.t('Failed to update card') });
    }
    setIsDirty(false);
  };

  const accordionItems = createMemo(() => [
    ...(allocationIds() || []).map((id) => ({
      title:
        data().linkedAllocationId === id ? (
          <div>
            {allocationsCache[id]?.allocation?.name}
            <Tag type="success" size="xs" class={css.titleTag}>
              <Text message="Active" />
            </Tag>
          </div>
        ) : (
          allocationsCache[id]?.allocation?.name
        ),
      content: (
        <>
          <LimitsForm
            values={allocationsLimitsMap[id] || defaultValues}
            handlers={allocationHandlers(id!)}
            mccCategories={props.mccCategories}
          />
          <ResetLimits
            disabled={isSameLimits(allocationsLimitsMap[id], allocationsCache[id])}
            onClick={() => onResetLimits(id)}
          />
        </>
      ),
    })),
  ]);

  return (
    <div class={css.root}>
      <Switch
        fallback={
          <>
            <FormItem extra={<Text message="Choose allocations to fund your card." />}>
              <AllocationSelect
                items={allocations()}
                disabledSelectedIds={[data().linkedAllocationId || data().card.allocationId || '']}
                placeholder={String(i18n.t('Select allocations'))}
                disabled={loading()}
                values={allocationIds()}
                onChangeMulti={(ids) => {
                  setIsDirty(true);
                  if (ids.length > (data().allocationSpendControls || []).length)
                    fetchAllocationById(ids[ids.length - 1]!);
                  setAllocationIds(ids);
                }}
              />
            </FormItem>
            <Accordion items={accordionItems()} />
          </>
        }
      >
        <Match when={data().card.type === CardType.VIRTUAL}>
          <For each={allocationIds()}>
            {(id) => (
              <>
                <LimitsForm
                  values={allocationsLimitsMap[id] || defaultValues}
                  handlers={allocationHandlers(id!)}
                  mccCategories={props.mccCategories}
                />
                <ResetLimits
                  disabled={isSameLimits(allocationsLimitsMap[id], allocationsCache[id])}
                  onClick={() => onResetLimits(id)}
                />
              </>
            )}
          </For>
        </Match>
      </Switch>
      <Show when={isDirty()}>
        <PageActions onCancel={reset} onSave={onSubmit} />
      </Show>
    </div>
  );
}
