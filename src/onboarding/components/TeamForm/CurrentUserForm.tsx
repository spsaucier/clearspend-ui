import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

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

import type { ExceptionData } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

// eslint-disable-next-line css-modules/no-unused-class
import css from './LeaderForm.css';

interface UserFormProps {
  onNext: (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => Promise<unknown>;
  currentUser: User;
}

export function CurrentUserForm(props: Readonly<UserFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);
  const isOwner = props.currentUser.relationshipToBusiness?.owner;

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>(
    getFormOptions({ currentUser: props.currentUser }),
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
        title="Your details"
        description="Tell us the name your momma gave you and where we can mail you love letters (just kidding... maybe)."
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
      </Section>
      <Show when={isOwner}>
        <Section
          title="Your ownership stake"
          description="Please disclose your company ownership amount via percentage."
          class={css.section}
        >
          <div class={css.wrapper}>
            <FormItem label="Percentage ownership" error={errors().percentageOwnership}>
              <InputPercentage
                name="percentage-ownership"
                value={values().percentageOwnership}
                error={Boolean(errors().percentageOwnership)}
                onChange={(value) => handlers.percentageOwnership(parseInt(value, 10))}
              />
            </FormItem>
          </div>
        </Section>
      </Show>
      <Section class={css.section}>
        <div class={css.actions}>
          <Button type="primary" htmlType="submit" wide={media.small} loading={loading()}>
            <Text message="Next" />
          </Button>
        </div>
        <h3 class={css.tipTitle}>
          <Text message="Need to step away?" />
        </h3>
        <p class={css.tipText}>
          <Text message="No worries! We're saving your progress as you go. Easily log back in and start where you left off at another time." />
        </p>
      </Section>
    </Form>
  );
}
