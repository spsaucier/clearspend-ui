import { createEffect, For } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputPhone } from '_common/components/InputPhone';
import { Button } from '_common/components/Button';
import { formatEIN } from '_common/formatters/ein';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import { getNoop } from '_common/utils/getNoop';
import type { Business, ConvertBusinessProspectRequest, UpdateBusiness } from 'generated/capital';
import { AddressFormItems } from 'employees/components/AddressFormItems';
import { Select, Option } from '_common/components/Select';
import { BUSINESS_MCC } from 'app/types/mcc';
import { BusinessTypeI18n, BusinessType } from 'app/types/businesses';

import { getFormOptions, convertFormData, BUSINESS_DESCRIPTION_MAX_LENGTH } from './utils';
import type { FormValues } from './types';

import css from './BusinessForm.css';

const reMapStripeToClearspendFields = (stripeKey: string) => {
  // todo: need a full list from George
  if (stripeKey === 'tax_id') {
    return 'employerIdentificationNumber';
  }
  return stripeKey;
};

// temp
export type BusinessWithBusinessName = Business & { businessName: string };

interface BusinessFormProps {
  onNext: (data: Readonly<ConvertBusinessProspectRequest | UpdateBusiness>) => Promise<unknown>;
  businessType: Business['businessType'];
  businessPrefills?: BusinessWithBusinessName;
  kybErrors?: readonly Readonly<string>[];
}

export function BusinessForm(props: Readonly<BusinessFormProps>) {
  const i18n = useI18n();
  const media = useMediaContext();

  const [loading, next] = wrapAction(props.onNext);

  const { values, handlers, errors, setErrors, isValid, wrapSubmit } = createForm<FormValues>(
    getFormOptions(props.businessType, props.businessPrefills),
  );

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(convertFormData(data)).catch(getNoop());
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
      <Section title={<Text message="Business details" />} class={css.section}>
        <div class={css.wrapper}>
          <FormItem label={<Text message="Legal entity name" />} error={errors().name}>
            <Input name="business-name" value={values().name} error={Boolean(errors().name)} onChange={handlers.name} />
          </FormItem>
          <FormItem label={<Text message="Legal entity type" />}>
            <Input
              name="business-type"
              value={(BusinessTypeI18n[values().type as BusinessType] as string) || values().type}
              disabled
            />
          </FormItem>
          <FormItem label={<Text message="Business EIN" />} error={errors().employerIdentificationNumber}>
            <Input
              name="business-ein"
              value={values().employerIdentificationNumber}
              maxLength={9}
              error={Boolean(errors().employerIdentificationNumber)}
              onChange={handlers.employerIdentificationNumber}
              formatter={formatEIN}
            />
          </FormItem>
          <FormItem label={<Text message="Corporate phone number" />} error={errors().phone}>
            <InputPhone
              name="corporate-phone-number"
              value={values().phone}
              error={Boolean(errors().phone)}
              onChange={handlers.phone}
            />
          </FormItem>
        </div>
      </Section>
      <Section title={<Text message="Business Description" />} class={css.section}>
        <div class={css.wrapper}>
          <FormItem label={<Text message="Business DBA name (optional)" />} error={errors().businessName}>
            <Input
              name="business-dba-name"
              value={values().businessName}
              error={Boolean(errors().businessName)}
              onChange={handlers.businessName}
            />
          </FormItem>
          <FormItem label={<Text message="Describe your business" />} error={errors().description}>
            <Input
              useTextArea={true}
              name="business-description"
              value={values().description}
              error={Boolean(errors().description) || values().description.length > BUSINESS_DESCRIPTION_MAX_LENGTH}
              onChange={handlers.description}
            />
            <div class={css.inputHelp}>
              <Text message="Briefly describe your business" />
              <div style={{ flex: '1' }} />
              <Text message={`${values().description.length} / ${BUSINESS_DESCRIPTION_MAX_LENGTH}`} />
            </div>
          </FormItem>
          <FormItem label={<Text message="Business website (optional)" />} error={errors().url}>
            <Input name="business-website" value={values().url} error={Boolean(errors().url)} onChange={handlers.url} />
          </FormItem>
          <FormItem label={<Text message="Merchant category" />}>
            <Select
              valueRender={(val, txt) => `${txt} (${val})`}
              placeholder={String(i18n.t('Search for merchant category'))}
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
        title={<Text message="Business address" />}
        class={css.section}
        description={
          <Text
            message={
              "Please enter the address for your company's main office or headquarters. " +
              'PO Boxes and virtual addresses are not allowed. ' +
              'This location will be used as the billing address for all cards issued to your employees.'
            }
          />
        }
      >
        <AddressFormItems values={values} errors={errors()} handlers={handlers} />
        <Button type="primary" htmlType="submit" wide={media.small} loading={loading()} disabled={!isValid()}>
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
