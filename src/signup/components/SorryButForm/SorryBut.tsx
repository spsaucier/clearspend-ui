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
      <Header>Sorry, but we need a company representative to open your account</Header>
      <Description>
        Please select the roles that best describe you. A company representative is a business owner with at least 25%
        ownership or a senior manager or other invidual who controls and manages the business.
      </Description>
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
          Next
        </FlatButton>
      </Form>
    </div>
  );
}
