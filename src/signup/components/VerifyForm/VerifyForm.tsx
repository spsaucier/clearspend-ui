import { JSXElement, Show, onMount } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { InputCode } from '_common/components/InputCode';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';

import { createTimer } from './utils';

import css from './VerifyForm.css';

const VALID_LENGTH = 6;
const RESEND_TIMEOUT_IN_SEC = 45;

interface FormValues {
  code: string;
}

interface VerifyFormProps {
  header: JSXElement;
  description: JSXElement;
  onResend: () => Promise<unknown>;
  onConfirm: (code: string) => Promise<unknown>;
  onNext: () => void;
}

export function VerifyForm(props: Readonly<VerifyFormProps>) {
  let input: HTMLInputElement | undefined;
  onMount(() => input?.focus());

  const [secondsLeft, restartTimer] = createTimer(RESEND_TIMEOUT_IN_SEC);

  const [loading, confirm] = wrapAction(props.onConfirm);
  const [resending, resend] = wrapAction(() => props.onResend().then(restartTimer));

  const { values, errors, handlers, setErrors } = createForm<FormValues>({
    defaultValues: { code: '' },
  });

  const onChange = (value: string) => {
    const code = value.replace(/[^\d]/g, '').substr(0, VALID_LENGTH);
    handlers.code(code);

    if (code.length === VALID_LENGTH) {
      confirm(code)
        .then(() => props.onNext())
        .catch(() => setErrors({ code: 'Invalid code.' }));
    }
  };

  return (
    <div>
      <Header>{props.header}</Header>
      <Description>{props.description}</Description>
      <Form>
        <FormItem label="Enter confirmation code">
          <InputCode
            ref={(el) => {
              input = el;
            }}
            name="code"
            value={values().code}
            error={Boolean(errors().code)}
            disabled={loading()}
            onChange={onChange}
          />
        </FormItem>
        <Show
          when={secondsLeft() === 0 || loading()}
          fallback={
            <Description class={css.note}>
              Didn't receive the code? <strong class={css.timer}>Resending code in {secondsLeft()} seconds.</strong>
            </Description>
          }
        >
          <Button wide loading={resending() || loading()} onClick={resend}>
            Resend confirmation code
          </Button>
        </Show>
      </Form>
    </div>
  );
}
