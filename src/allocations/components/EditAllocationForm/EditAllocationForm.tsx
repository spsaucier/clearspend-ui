import { Show } from 'solid-js';

import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Select } from '_common/components/Select';
import { formatAmount } from '_common/formatters/amount';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import type { UUIDString } from 'app/types/common';

import { AllocationSelect } from '../AllocationSelect';
import type { Allocation, CreateAllocation } from '../../types';

import css from './EditAllocationForm.css';

interface FormValues {
  name: string;
  parent: string;
  amount: string;
  owner: string;
}

interface EditAllocationFormProps {
  allocations: readonly Readonly<Allocation>[];
  onSave: (data: Readonly<CreateAllocation>) => Promise<unknown>;
}

export function EditAllocationForm(props: Readonly<EditAllocationFormProps>) {
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { name: '', parent: '', amount: '', owner: '' },
    rules: { name: [required] },
  });

  const onSubmit = async () => {
    if (hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave({
        programId: '033955d1-f18e-497e-9905-88ba71e90208' as UUIDString,
        name: data.name,
        amount: { currency: 'USD', amount: 0 },
        parentAllocationId: (data.parent || undefined) as UUIDString,
      })
      .catch(() => {
        messages.error({ title: 'Something going wrong' });
      });
  };

  return (
    <Form class={css.form}>
      <Section title="Allocation details">
        <FormItem label="Label" error={errors().name} class={css.field}>
          <Input
            name="allocation-label"
            value={values().name}
            placeholder="Enter allocation label (e.g. Marketing Team)"
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
        <FormItem
          label="Parent allocation"
          extra="Choose the allocation that will fund your new allocation."
          error={errors().parent}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().parent}
            placeholder="Select allocation"
            error={Boolean(errors().parent)}
            onChange={handlers.parent}
          />
        </FormItem>
      </Section>
      <Section title="Balance" description="Fund your allocation from the parent allocation.">
        <FormItem
          label="Amount"
          extra="The amount can not exceed the balance of the parent allocation."
          error={errors().amount}
          class={css.field}
        >
          <Input
            name="amount"
            placeholder="$ Enter the amount"
            value={values().amount}
            formatter={formatAmount}
            error={Boolean(errors().amount)}
            onChange={handlers.amount}
          />
        </FormItem>
      </Section>
      <Section
        title="Owner(s)"
        description="Allocation owners can issue new cards, edit spend controls, and view spend."
      >
        <FormItem label="Allocation owner(s)" error={errors().owner} class={css.field}>
          <Select
            value={values().owner}
            placeholder="Search by employee name"
            disabled
            error={Boolean(errors().owner)}
            onChange={handlers.owner}
          >
            {undefined}
          </Select>
        </FormItem>
      </Section>
      <Show when={isDirty()}>
        <PageActions action="Create Allocation" onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
