import { useMediaContext } from '_common/api/media/context';
import { Form, FormItem } from '_common/components/Form';
import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';
import { Section } from 'app/components/Section';

import { BankAccount } from '../BankAccount';

import css from './TransferMoney.css';

export function TransferMoney() {
  const media = useMediaContext();

  return (
    <Form>
      <Section
        title="Add balance"
        description="To have an active account, you need a minimum balance of $100.00."
        class={css.section}
      >
        <div class={css.wrapper}>
          <FormItem label="Amount">
            <Input placeholder="$0.00" />
          </FormItem>
        </div>
      </Section>
      <Section title="Select account" class={css.section}>
        <div class={css.wrapper}>
          <BankAccount />
          <Button type="primary" ghost icon="add" size="sm" class={css.button}>
            Add New Bank Account
          </Button>
        </div>
        <Button type="primary" wide={media.small} class={css.button}>
          Next
        </Button>
      </Section>
    </Form>
  );
}
