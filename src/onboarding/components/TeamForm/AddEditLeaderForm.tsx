import { Text } from 'solid-i18n';
import { createEffect, Show } from 'solid-js';

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
import type { Business, CreateOrUpdateBusinessOwnerRequest } from 'generated/capital';
import { AddressFormItems } from 'employees/components/AddressFormItems';
import { InputPercentage } from '_common/components/InputPercentage';
import { RadioGroup, Radio } from '_common/components/Radio';
import { BusinessType } from 'app/types/businesses';

import type { ExceptionData } from '../../types';
import type { BusinessOwner } from '../LeadershipTable/LeadershipTable';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './LeaderForm.css';

interface AddEditLeaderFormProps {
  onNext: (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => Promise<unknown>;
  leader?: Readonly<BusinessOwner>;
  isCurrentUser?: boolean;
  kycErrors?: readonly Readonly<string>[];
  errors?: string[];
  business: Business;
}

export function AddEditLeaderForm(props: Readonly<AddEditLeaderFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);

  const { values, errors, setErrors, handlers, wrapSubmit } = createForm<FormValues>(
    getFormOptions({ leader: props.leader, business: props.business }),
  );

  createEffect(() => {
    const errorsFromProps: { [key: string]: string } = {};
    [...(props.kycErrors ?? []), ...(props.errors ?? [])].forEach((fieldError) => {
      const fieldKey = fieldError.includes('.') ? fieldError.split(/[.]+/)[1] : fieldError;
      if (fieldKey === 'ssn_last_4') {
        // Temporary until new UI/UX is complete for doc+field optional issue fix for ssn
        errorsFromProps.ssn = 'Invalid. This value does not match the provided documentation.';
      } else if (fieldKey) {
        errorsFromProps[fieldKey] = `Invalid value`;
      }
    });
    setErrors(errorsFromProps);
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(convertFormData(data)).catch((e: ExceptionData) => {
        messages.error({ title: 'Something went wrong.', message: e.data.message });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section title="What is this person's role?" class={css.section}>
        <div class={css.wrapperWide}>
          <FormItem
            label={
              <div>
                <div class={css.radioLabel}>
                  Does their title or role allow them to sign contracts for your business?
                </div>
                <div class={css.radioExtra}>
                  Examples include: Chief Executive Officer, Chief Financial Officer, Chief Operating Officer,
                  Management Member, General Partner, President, Vice President, or Treasurer.
                </div>
              </div>
            }
            error={errors().relationshipExecutive}
          >
            <RadioGroup
              name="is-executive"
              value={values().relationshipExecutive}
              onChange={handlers.relationshipExecutive}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </RadioGroup>
          </FormItem>
          <Show
            when={
              ![BusinessType.SOLE_PROPRIETORSHIP, BusinessType.INCORPORATED_NON_PROFIT].includes(
                props.business.businessType as BusinessType,
              )
            }
          >
            <FormItem label="Are they an owner with at least 25% ownership?" error={errors().relationshipOwner}>
              <RadioGroup
                name="is-owner"
                value={values().relationshipOwner}
                onChange={(value) => handlers.relationshipOwner?.(value as boolean)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </RadioGroup>
            </FormItem>
          </Show>
        </div>
      </Section>
      <Show when={values().relationshipOwner}>
        <Section title="Ownership stake" class={css.section}>
          <div class={css.wrapper}>
            <FormItem label="Percentage ownership" error={errors().percentageOwnership}>
              <InputPercentage
                name="percentage-ownership"
                value={values().percentageOwnership}
                error={Boolean(errors().percentageOwnership)}
                onChange={handlers.percentageOwnership}
              />
            </FormItem>
          </div>
        </Section>
      </Show>
      <Section title="Details" class={css.section}>
        <div class={css.wrapper}>
          <FormItem label="First name" error={errors().firstName}>
            <Input
              name="first-name"
              value={values().firstName}
              error={Boolean(errors().firstName)}
              onChange={handlers.firstName}
              disabled={props.isCurrentUser}
            />
          </FormItem>
          <FormItem label="Last name" error={errors().lastName}>
            <Input
              class="fs-mask"
              name="last-name"
              value={values().lastName}
              error={Boolean(errors().lastName)}
              onChange={handlers.lastName}
              disabled={props.isCurrentUser}
            />
          </FormItem>
          <FormItem label="Title" error={errors().title}>
            <Input name="title" value={values().title} error={Boolean(errors().title)} onChange={handlers.title} />
          </FormItem>
          <FormItem label="Date of birth" error={errors().birthdate}>
            <SelectDateOfBirth
              class="fs-mask"
              name="birthdate"
              value={values().birthdate}
              error={Boolean(errors().birthdate)}
              onChange={handlers.birthdate}
            />
          </FormItem>
          <FormItem label="Social security number" error={errors().ssn}>
            <Input
              class="fs-mask"
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
              class="fs-mask"
              name="email"
              type="email"
              value={values().email}
              error={Boolean(errors().email)}
              onChange={handlers.email}
              disabled={props.isCurrentUser}
            />
          </FormItem>
          <FormItem label="Mobile number" error={errors().phone}>
            <InputPhone
              name="phone"
              value={values().phone}
              error={Boolean(errors().phone)}
              onChange={handlers.phone}
              disabled={props.isCurrentUser}
            />
          </FormItem>
          <AddressFormItems values={values} errors={errors()} handlers={handlers} />
        </div>
      </Section>
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
