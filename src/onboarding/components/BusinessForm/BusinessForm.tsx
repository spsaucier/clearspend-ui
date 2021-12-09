import { For } from 'solid-js';

import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputPhone } from '_common/components/InputPhone';
import { Select, SelectState, Option } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { keys } from '_common/utils/keys';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';

import { BUSINESS_TYPES } from '../../constants/usa';
import type { ExceptionData, UpdateBusinessInfo } from '../../types';
import { formatEIN } from '../../../_common/formatters/ein';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './BusinessForm.css';

interface BusinessFormProps {
  onNext: (data: Readonly<UpdateBusinessInfo>) => Promise<unknown>;
}

export function BusinessForm(props: Readonly<BusinessFormProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);

  const { values, handlers, errors, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(convertFormData(data)).catch((e: ExceptionData) => {
        messages.error({ title: 'Something went wrong.', message: e.data.message });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section title="Business details" class={css.section}>
        <div class={css.wrapper}>
          <FormItem label="Legal entity name" error={errors().name}>
            <Input name="business-name" value={values().name} error={Boolean(errors().name)} onChange={handlers.name} />
          </FormItem>
          <FormItem label="Legal entity type" error={errors().type}>
            <Select
              name="business-type"
              placeholder="Choose entity type"
              value={values().type}
              error={Boolean(errors().type)}
              onChange={handlers.type}
            >
              <For each={keys(BUSINESS_TYPES)}>{(type) => <Option value={type}>{BUSINESS_TYPES[type]}</Option>}</For>
            </Select>
          </FormItem>
          <FormItem label="Business EIN" error={errors().ein}>
            <Input
              name="business-ein"
              value={values().ein}
              maxLength={9}
              error={Boolean(errors().ein)}
              onChange={handlers.ein}
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
      <Section title="Business address" class={css.section}>
        <div class={css.wrapper}>
          <FormItem
            label="Business physical address"
            extra="No P.O. boxes or virtual addresses. U.S. addresses only. We will not send mail to this address."
            error={errors().line1}
          >
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
              maxLength={5}
              error={Boolean(errors().zip)}
              onChange={handlers.zip}
            />
          </FormItem>
        </div>
        <Button type="primary" htmlType="submit" wide={media.small} loading={loading()}>
          Next
        </Button>
      </Section>
    </Form>
  );
}
