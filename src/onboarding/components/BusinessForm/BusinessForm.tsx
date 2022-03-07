import { createEffect, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputPhone } from '_common/components/InputPhone';
import { Button } from '_common/components/Button';
import { formatEIN } from '_common/formatters/ein';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import type { Business, ConvertBusinessProspectRequest, UpdateBusiness } from 'generated/capital';
import { AddressFormItems } from 'employees/components/AddressFormItems';
import { Select, Option } from '_common/components/Select';
import { BUSINESS_MCC } from 'app/types/mcc';

import type { ExceptionData } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './BusinessForm.css';

const reMapStripeToClearspendFields = (stripeKey: string) => {
  // todo: need a full list from George
  if (stripeKey === 'tax_id') {
    return 'employerIdentificationNumber';
  }
  return stripeKey;
};

interface BusinessFormProps {
  onNext: (data: Readonly<ConvertBusinessProspectRequest | UpdateBusiness>) => Promise<unknown>;
  businessType: Business['businessType'];
  businessPrefills?: Business;
  kybErrors?: readonly Readonly<string>[];
}

export function BusinessForm(props: Readonly<BusinessFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();

  const [loading, next] = wrapAction(props.onNext);
  const { values, handlers, errors, setErrors, wrapSubmit } = createForm<FormValues>(
    getFormOptions(props.businessType, props.businessPrefills),
  );
  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(convertFormData(data)).catch((e: ExceptionData) => {
        messages.error({ title: 'Something went wrong.', message: e.data.message });
      });
    }
  };

  createEffect(() => {
    const kybErrors: { [key: string]: string } = {};
    props.kybErrors?.forEach((fieldError) => {
      const fieldKey = fieldError.includes('.') ? fieldError.split(/[.]+/)[1] : fieldError;
      if (fieldKey) {
        kybErrors[reMapStripeToClearspendFields(fieldKey)] = `Invalid value`;
      }
    });
    setErrors(kybErrors);
  });

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section title="Business details" class={css.section}>
        <div class={css.wrapper}>
          <FormItem label="Legal entity name" error={errors().name}>
            <Input name="business-name" value={values().name} error={Boolean(errors().name)} onChange={handlers.name} />
          </FormItem>
          <FormItem label="Business EIN" error={errors().employerIdentificationNumber}>
            <Input
              name="business-ein"
              value={values().employerIdentificationNumber}
              maxLength={9}
              error={Boolean(errors().employerIdentificationNumber)}
              onChange={handlers.employerIdentificationNumber}
              formatter={formatEIN}
            />
          </FormItem>
          <FormItem label="Corporate phone number" error={errors().phone}>
            <InputPhone
              name="corporate-phone-number"
              value={values().phone}
              error={Boolean(errors().phone)}
              onChange={handlers.phone}
            />
          </FormItem>
        </div>
      </Section>
      <Section title="Business Description" class={css.section}>
        <div class={css.wrapper}>
          <FormItem label="Describe your business" error={errors().description}>
            <Input
              name="business-description"
              value={values().description}
              error={Boolean(errors().description)}
              onChange={handlers.description}
            />
            <div class={css.inputHelp}>
              <Text message="Briefly describe your business in 50 words or less." />
            </div>
          </FormItem>
          <FormItem label={'Merchant category'}>
            <Select
              valueRender={(val, txt) => `${txt} (${val})`}
              placeholder="Search for merchant category"
              name="business-mcc"
              value={`${values().mcc}`}
              error={Boolean(errors().mcc)}
              onChange={(value) => handlers.mcc(value)}
            >
              <For each={BUSINESS_MCC}>{(mcc) => <Option value={`${mcc.value}`}>{mcc.name}</Option>}</For>
            </Select>
            <div class={css.inputHelp}>
              <Text message="Select the merchant category code that best describes your business." />
            </div>
          </FormItem>
        </div>
      </Section>
      <Section
        title="Business address"
        class={css.section}
        description="Please enter the address for your company's main office or headquarters. PO Boxes and virtual addresses are not allowed. This location will be used as the billing address for all cards issued to your employees."
      >
        <AddressFormItems values={values} errors={errors()} handlers={handlers} />
        <Button type="primary" htmlType="submit" wide={media.small} loading={loading()}>
          <Text message="Next" />
        </Button>
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
