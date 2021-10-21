import { For } from 'solid-js';

import { Section } from 'app/components/Section';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputDate } from '_common/components/InputDate';
import { Select, Option } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';

import { USA_STATES } from '../../constants/usa';
import type { UpdateBusinessOwner } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './TeamForm.css';

interface TeamFormProps {
  onNext: (data: Readonly<UpdateBusinessOwner>) => Promise<unknown>;
}

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();
  const [loading, next] = wrapAction(props.onNext);

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    next(convertFormData(data)).catch(() => {
      // TODO: How to show general errors?
      // eslint-disable-next-line no-alert
      alert('Something going wrong');
    });
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section
        title="Principle owner"
        description="Provide the details for the principle owner of your business. You can add multiple owners."
        class={css.section}
      >
        <div class={css.wrapper}>
          <FormItem label="First name" error={errors().firstName}>
            <Input
              name="first-name"
              value={values().firstName}
              error={Boolean(errors().firstName)}
              onChange={handlers.firstName}
            />
          </FormItem>
          <FormItem label="Last name" error={errors().lastName}>
            <Input
              name="last-name"
              value={values().lastName}
              error={Boolean(errors().lastName)}
              onChange={handlers.lastName}
            />
          </FormItem>
          <FormItem label="Date of birth" error={errors().birthdate}>
            <InputDate
              name="birthdate"
              value={values().birthdate}
              error={Boolean(errors().birthdate)}
              onChange={handlers.birthdate}
            />
          </FormItem>
          <FormItem label="Social security number" error={errors().ssn}>
            <Input name="ssn" value={values().ssn} error={Boolean(errors().ssn)} onChange={handlers.ssn} />
          </FormItem>
          <FormItem label="Email" error={errors().email}>
            <Input
              name="email"
              type="email"
              value={values().email}
              error={Boolean(errors().email)}
              onChange={handlers.email}
            />
          </FormItem>
          <FormItem label="Home address" error={errors().line1}>
            <Input
              name="address-line-1"
              value={values().line1}
              autoComplete="off"
              error={Boolean(errors().line1)}
              onChange={handlers.line1}
            />
          </FormItem>
          <FormItem label="Apartment, unit, floor etc..." error={errors().line2}>
            <Input
              name="address-line-2"
              value={values().line2}
              autoComplete="off"
              error={Boolean(errors().line2)}
              onChange={handlers.line2}
            />
          </FormItem>
          <FormItem label="City" error={errors().city}>
            <Input name="city" value={values().city} error={Boolean(errors().city)} onChange={handlers.city} />
          </FormItem>
          <FormItem label="State" error={errors().state}>
            <Select
              up
              name="state"
              placeholder="Choose state"
              value={values().state}
              error={Boolean(errors().state)}
              onChange={handlers.state}
            >
              <For each={USA_STATES}>{(state) => <Option value={state}>{state}</Option>}</For>
            </Select>
          </FormItem>
          <FormItem label="Zip code" error={errors().zip}>
            <Input name="zip-code" value={values().zip} error={Boolean(errors().zip)} onChange={handlers.zip} />
          </FormItem>
        </div>
        <div class={css.actions}>
          <Button size="sm" icon="add" type="primary" disabled ghost class={css.add}>
            Add another owner
          </Button>
          <Button type="primary" htmlType="submit" wide={media.small} loading={loading()}>
            Next
          </Button>
        </div>
      </Section>
    </Form>
  );
}
