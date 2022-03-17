import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button/FlatButton';

interface SorryButFormValues {
  ownerEmail: string;
}

interface SorryButFormProps {
  onNext: (ownerEmail: string) => void;
}

export function SorryButForm(props: Readonly<SorryButFormProps>) {
  const { values, errors, handlers, wrapSubmit } = createForm<SorryButFormValues>({
    defaultValues: { ownerEmail: '' },
    rules: { ownerEmail: [required] },
  });

  const onSubmit = (data: Readonly<SorryButFormValues>) => props.onNext(data.ownerEmail);

  return (
    <div>
      <Header>
        <Text message="Sorry, but we need a company representative to open your account" />
      </Header>
      <Description>
        <Text message="A company representative is a business owner with at least 25% ownership, a senior manager, or any other individual that controls and manages the business." />
      </Description>
      {/* TODO: Re-add this form when CAP-718 done */}
      <Show when={false}>
        <Form onSubmit={wrapSubmit(onSubmit)}>
          <FormItem label="Share with an owner or manager" error={errors().ownerEmail}>
            <Input
              name="email"
              type="email"
              value={values().ownerEmail}
              error={Boolean(errors().ownerEmail)}
              onChange={handlers.ownerEmail}
            />
          </FormItem>
          <div style={{ height: '24px' }} />
          <FlatButton type="primary" htmlType="submit">
            <Text message="Next" />
          </FlatButton>
        </Form>
      </Show>
    </div>
  );
}
