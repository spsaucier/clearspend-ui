import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputDate } from '_common/components/InputDate';
import { SelectState } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import { InputPhone } from '_common/components/InputPhone';
import { formatSSN } from '_common/formatters/ssn';
import type { CreateOrUpdateBusinessOwnerRequest } from 'generated/capital';

import type { ExceptionData } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './TeamForm.css';

interface TeamFormProps {
  onNext: (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => Promise<unknown>;
}

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(convertFormData(data)).catch((e: ExceptionData) => {
        messages.error({ title: 'Something went wrong.', message: e.data.message });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section
        title="Principal owner"
        description="Provide the details for the principal owner of your business. You can add multiple owners."
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
            <Input
              name="ssn"
              value={values().ssn}
              maxLength={9}
              error={Boolean(errors().ssn)}
              onChange={handlers.ssn}
              formatter={formatSSN}
            />
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
          <FormItem label="Phone" error={errors().phone}>
            <InputPhone name="phone" value={values().phone} error={Boolean(errors().phone)} onChange={handlers.phone} />
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
            <SelectState value={values().state} error={Boolean(errors().state)} onChange={handlers.state} />
          </FormItem>
          <FormItem label="Zip code" error={errors().zip}>
            <Input
              name="zip-code"
              value={values().zip}
              error={Boolean(errors().zip)}
              maxLength={5}
              onChange={handlers.zip}
            />
          </FormItem>
        </div>
        <div class={css.actions}>
          <Button size="sm" icon="add" type="primary" disabled view="ghost" class={css.add}>
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
