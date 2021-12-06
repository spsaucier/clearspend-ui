import { Text } from 'solid-i18n';

import { Section } from 'app/components/Section';
import { Form, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Select } from '_common/components/Select';

import css from './Settings.css';

export function Settings() {
  return (
    <Form>
      <Section title={<Text message="Allocation details" />}>
        <FormItem label={<Text message="Label" />} class={css.field}>
          <Input />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Owner(s)" />}
        description={<Text message="Allocation owners can issue new cards, edit spend controls, and view spend." />}
      >
        <FormItem label={<Text message="Allocation owner(s)" />} class={css.field}>
          <Select>{undefined}</Select>
        </FormItem>
      </Section>
    </Form>
  );
}