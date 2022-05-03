import { createMemo, Show, batch } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { useResource } from '_common/utils/useResource';
import { Form, createForm, hasErrors } from '_common/components/Form';
import { PageActions } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';
import { ResetLimits } from 'cards/components/ResetLimits';
import type { Amount } from 'generated/capital';
import type { MccGroup } from 'transactions/types';
import { LimitsForm } from 'cards/components/LimitsForm/LimitsForm';

import {
  getChannels,
  getCategories,
  getPurchasesLimits,
  getDefaultLimits,
  checkSameLimits,
} from '../../utils/convertFormLimits';
import { getAllocation } from '../../services';
import type { ControlsData } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './CardControlsForm.css';

interface CardControlsFormProps {
  data: Readonly<ControlsData>;
  maxAmount: Readonly<Amount>;
  allocationId?: string;
  mccCategories: readonly Readonly<MccGroup>[];
  onSave: (data: Readonly<ControlsData>) => Promise<unknown>;
}

export function CardControlsForm(props: Readonly<CardControlsFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const [loading, save] = wrapAction(props.onSave);

  const [allocation] = useResource(getAllocation, props.allocationId, Boolean(props.allocationId));

  const { values, isDirty, handlers, trigger, reset } = createForm<FormValues>(
    getFormOptions(props.data, props.mccCategories),
  );

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;

    const data = values();
    await save(convertFormData(data, props.mccCategories)).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
    reset(data);
  };

  const onResetLimits = () => {
    const data = allocation();
    batch(() => {
      handlers.categories(data ? getCategories(data, props.mccCategories) : []);
      handlers.channels(data ? getChannels(data) : []);
      handlers.purchasesLimits(data ? getPurchasesLimits(data) : getDefaultLimits());
    });
  };

  const isSameLimits = createMemo(() => checkSameLimits(values(), allocation(), props.mccCategories));

  return (
    <Form>
      <LimitsForm
        values={values()}
        maxAmount={props.maxAmount}
        handlers={handlers}
        mccCategories={props.mccCategories}
      />
      <Show when={allocation()}>
        <ResetLimits disabled={isSameLimits()} class={css.box} onClick={onResetLimits} />
      </Show>
      <Show when={isDirty()}>
        <PageActions onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
