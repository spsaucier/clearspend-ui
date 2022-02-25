import { JSXElement, onMount, Show } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { InputCode } from '_common/components/InputCode';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button/FlatButton';

import { createTimer } from './utils';

import css from './VerifyForm.css';

// eslint-disable-next-line css-modules/no-unused-class

const VALID_LENGTH = 6;
const RESEND_TIMEOUT_IN_SEC = 45;

interface FormValues {
  code: string;
}

interface VerifyFormProps {
  header: JSXElement;
  description: JSXElement;
  extraDescription?: JSXElement;
  extraBtn?: JSXElement;
  onResend: () => Promise<unknown>;
  onConfirm: (code: string) => Promise<unknown>;
  darkMode?: boolean;
}

export function VerifyForm(props: Readonly<VerifyFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const [secondsLeft, restartTimer] = createTimer(RESEND_TIMEOUT_IN_SEC);

  const [loading, confirm] = wrapAction(props.onConfirm);
  const [resending, resend] = wrapAction(() => props.onResend().then(restartTimer));

  const { values, errors, handlers, setErrors } = createForm<FormValues>({
    defaultValues: { code: '' },
  });

  const onChange = (value: string) => {
    const code = value.replace(/[^\d]/g, '').substr(0, VALID_LENGTH);
    handlers.code(code);

    if (code.length === VALID_LENGTH && !loading()) {
      confirm(code).catch(() => setErrors({ code: 'Invalid code or something going wrong' }));
    }
  };

  return (
    <div>
      <Header>{props.header}</Header>
      <Description>{props.description}</Description>
      {props.extraDescription}
      <Form>
        <FormItem label="Enter confirmation code" error={errors().code}>
          <InputCode
            ref={input}
            name="code"
            codeLength={VALID_LENGTH}
            value={values().code}
            error={Boolean(errors().code)}
            disabled={loading()}
            onChange={onChange}
            darkMode={true}
          />
        </FormItem>
        <Description class={css.note}>Didn't receive the code?</Description>
        <Show when={props.extraBtn}>{props.extraBtn}</Show>
        <FlatButton loading={loading() || resending()} disabled={secondsLeft() > 0} onClick={resend}>
          Resend confirmation code
          {secondsLeft() > 0 && <span> in {secondsLeft()} sec</span>}
        </FlatButton>
      </Form>
    </div>
  );
}
