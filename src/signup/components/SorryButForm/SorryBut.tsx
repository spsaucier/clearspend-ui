import { Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { useSignup } from 'signup/store';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button';

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
  const { resetStore } = useSignup();
  const navigate = useNavigate();

  const onSubmit = (data: Readonly<SorryButFormValues>) => props.onNext(data.ownerEmail);

  const onStartOver = () => {
    resetStore();
    navigate('/login');
  };

  return (
    <div>
      <Header>
        <Text message="Sorry, but we need a company representative to open your account" />
      </Header>
      <Description>
        <Text message="A company representative is a business owner with at least 25% ownership, a senior manager, or any other individual that controls and manages the business." />
      </Description>
      <Description size="small">
        <Text message="If a company representative is available to sign up your company, they can restart the sign up process by clicking below." />
      </Description>
      <FlatButton type="primary" htmlType="submit" icon={null} onClick={onStartOver}>
        <Text message="Start over" />
      </FlatButton>
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
