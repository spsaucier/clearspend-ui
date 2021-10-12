import { useNavigate } from 'solid-app-router';

import { Section } from 'app/components/Section';
import { Form, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Select, Option } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';

import css from './BusinessForm.css';

export function BusinessForm() {
  const navigate = useNavigate();
  const media = useMediaContext();

  return (
    <Form>
      <Section title="Business details" class={css.section}>
        <div class={css.wrapper}>
          <FormItem label="Legal entity name">
            <Input />
          </FormItem>
          <FormItem label="Legal entity type">
            <Select placeholder="Choose entity type">
              <Option value="corporation">Corporation</Option>
            </Select>
          </FormItem>
          <FormItem label="Business EIN">
            <Input />
          </FormItem>
          <FormItem label="Corporate phone number">
            <Input type="tel" />
          </FormItem>
        </div>
      </Section>
      <Section title="Business address" class={css.section}>
        <div class={css.wrapper}>
          <FormItem
            label="Business physical address"
            extra="No P.O. boxes or virtual addresses. U.S. addresses only. We will not send mail to this address."
          >
            <Input />
          </FormItem>
          <FormItem label="Apartment, unit, floor etc...">
            <Input />
          </FormItem>
          <FormItem label="City">
            <Input />
          </FormItem>
          <FormItem label="State">
            <Select placeholder="Choose state">{/* TODO */}</Select>
          </FormItem>
          <FormItem label="Zip code">
            <Input />
          </FormItem>
        </div>
        <Button type="primary" wide={media.small} onClick={() => navigate('/onboarding/kyc')}>
          Next
        </Button>
      </Section>
    </Form>
  );
}
