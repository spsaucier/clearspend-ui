import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import { InputPhone } from '_common/components/InputPhone';
import { SelectDateOfBirth } from '_common/components/SelectDateOfBirth';
import { formatSSN } from '_common/formatters/ssn';
import type { CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';
import { AddressFormItems } from 'employees/components/AddressFormItems';
import { InputPercentage } from '_common/components/InputPercentage';
import { RelationshipToBusiness } from 'app/types/businesses';
import { CheckboxGroup, Checkbox } from '_common/components/Checkbox';

import type { ExceptionData } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './TeamForm.css';

interface TeamFormProps {
  onNext: (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => Promise<unknown>;
  signupUser: User;
}

export function TeamForm(props: Readonly<TeamFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);
  const isOwner = props.signupUser.relationshipToBusiness?.owner;

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>(
    // NB: do not auto-populate name on additional owner forms
    getFormOptions(isOwner ? props.signupUser : {}),
  );

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
              disabled={isOwner}
            />
          </FormItem>
          <FormItem label="Last name" error={errors().lastName}>
            <Input
              name="last-name"
              value={values().lastName}
              error={Boolean(errors().lastName)}
              onChange={handlers.lastName}
              disabled={isOwner}
            />
          </FormItem>
          <FormItem label="">
            <CheckboxGroup
              name="business-structure"
              value={values().relationshipToBusiness as string[]}
              onChange={(value: string[]) => handlers.relationshipToBusiness(value as RelationshipToBusiness[])}
            >
              <Checkbox value={RelationshipToBusiness.OWNER} disabled={isOwner}>
                Owner
              </Checkbox>
              <Checkbox value={RelationshipToBusiness.EXECUTIVE} disabled={isOwner}>
                Executive
              </Checkbox>
              <Checkbox value={RelationshipToBusiness.DIRECTOR} disabled={isOwner}>
                Director
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="Percentage ownership" error={errors().percentageOwnership}>
            <InputPercentage
              name="percentage-ownership"
              value={values().percentageOwnership}
              error={Boolean(errors().percentageOwnership)}
              onChange={(value) => handlers.percentageOwnership(parseInt(value, 10))}
            />
          </FormItem>
          <FormItem label="Title" error={errors().title}>
            <Input name="title" value={values().title} error={Boolean(errors().title)} onChange={handlers.title} />
          </FormItem>
          <FormItem label="Date of birth" error={errors().birthdate}>
            <SelectDateOfBirth
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
              disabled={isOwner}
            />
          </FormItem>
          <FormItem label="Phone" error={errors().phone}>
            <InputPhone
              name="phone"
              value={values().phone}
              error={Boolean(errors().phone)}
              onChange={handlers.phone}
              disabled={isOwner}
            />
          </FormItem>
          <AddressFormItems values={values} errors={errors()} handlers={handlers} />
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
