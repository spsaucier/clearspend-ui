import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Select } from '_common/components/Select';
import { formatAmount, parseAmount } from '_common/formatters/amount';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import { wrapAction } from '_common/utils/wrapAction';
import type { Allocation, CreateAllocationRequest } from 'generated/capital';

import { AllocationSelect } from '../AllocationSelect';

import css from './EditAllocationForm.css';

interface FormValues {
  name: string;
  parent: string;
  amount: string;
  owner: string;
}

interface EditAllocationFormProps {
  allocations: readonly Readonly<Allocation>[];
  onSave: (data: Readonly<CreateAllocationRequest>) => Promise<unknown>;
}

export function EditAllocationForm(props: Readonly<EditAllocationFormProps>) {
  const [loading] = wrapAction(props.onSave);
  const i18n = useI18n();
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { name: '', parent: '', amount: '', owner: '' },
    rules: { name: [required], parent: [required] },
  });

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave({
        name: data.name,
        amount: { currency: 'USD', amount: parseAmount(data.amount) },
        parentAllocationId: data.parent,
        ownerId: data.owner,
        limits: [],
        disabledMccGroups: [],
        disabledTransactionChannels: [],
      })
      .catch(() => {
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
          <Input
            name="amount"
            placeholder={String(i18n.t('$ Enter the amount'))}
            value={values().amount}
            formatter={formatAmount}
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
          <Select
            value={values().owner}
            placeholder={String(i18n.t('Search by employee name'))}
            disabled
            error={Boolean(errors().owner)}
            onChange={handlers.owner}
          >
            {undefined}
          </Select>
        </FormItem>
      </Section>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Create Allocation" />} onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
