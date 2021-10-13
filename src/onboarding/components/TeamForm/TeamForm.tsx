import { useNavigate } from 'solid-app-router';

import { Section } from 'app/components/Section';
import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputDate } from '_common/components/InputDate';
import { Select } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';

import css from './TeamForm.css';

interface FormValues {
  birthdate: ReadonlyDate | undefined;
}

export function TeamForm() {
  const navigate = useNavigate();
  const media = useMediaContext();

  const { values, errors, handlers } = createForm<FormValues>({
    defaultValues: {
      birthdate: undefined,
    },
  });

  return (
    <Form>
      <Section
        title="Principle owner"
        description="Provide the details for the principle owner of your business. You can add multiple owners."
        class={css.section}
      >
        <div class={css.wrapper}>
          <FormItem label="First name">
            <Input name="first-name" />
          </FormItem>
          <FormItem label="Last name">
            <Input name="last-name" />
          </FormItem>
          <FormItem label="Date of birth" error={errors().birthdate}>
            <InputDate
              name="birthdate"
              value={values().birthdate}
              error={Boolean(errors().birthdate)}
              onChange={handlers.birthdate}
            />
          </FormItem>
          <FormItem label="Social security number">
            <Input name="ssn" />
          </FormItem>
          <FormItem label="Email">
            <Input name="email" type="email" />
          </FormItem>
          <FormItem label="Home address">
            <Input name="address" />
          </FormItem>
          <FormItem label="Apartment, unit, floor etc...">
            <Input />
          </FormItem>
          <FormItem label="City">
            <Input name="city" />
          </FormItem>
          <FormItem label="State">
            <Select placeholder="Choose state">{/* TODO */}</Select>
          </FormItem>
          <FormItem label="Zip code">
            <Input name="zip" />
          </FormItem>
        </div>
        <div class={css.actions}>
          <Button size="sm" icon="add" type="primary" ghost class={css.add}>
            Add another owner
          </Button>
          <Button type="primary" wide={media.small} onClick={() => navigate('/onboarding/account')}>
            Next
          </Button>
        </div>
      </Section>
    </Form>
  );
}
