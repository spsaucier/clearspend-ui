import { JSXElement, onMount, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { InputCode } from '_common/components/InputCode';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button/FlatButton';

import { createTimer } from './utils';

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
  onResend?: () => Promise<unknown>;
  onConfirm: (code: string) => Promise<unknown>;
  darkMode?: boolean;
}

export function VerifyForm(props: Readonly<VerifyFormProps>) {
  let input!: HTMLInputElement;
  const i18n = useI18n();

  onMount(() => input.focus());

  const [secondsLeft, restartTimer] = createTimer(RESEND_TIMEOUT_IN_SEC);

  const [loading, confirm] = wrapAction(props.onConfirm);
  const [resending, resend] = wrapAction(() => (props.onResend?.() || Promise.resolve()).then(restartTimer));

  const { values, errors, handlers, setErrors } = createForm<FormValues>({
    defaultValues: { code: '' },
  });

  const onChange = (value: string) => {
    const code = value.replace(/[^\d]/g, '').substr(0, VALID_LENGTH);
    handlers.code(code);

    if (code.length === VALID_LENGTH && !loading()) {
      confirm(code).catch((error: { data: { message?: string } }) => {
        setErrors({
          code: error.data.message?.includes('NonUniqueResultException')
            ? String(i18n.t('Account already exists with this email.'))
            : String(i18n.t('Invalid code or something went wrong')),
        });
      });
    }
  };

  return (
    <div>
      <Header>{props.header}</Header>
      <Description>{props.description}</Description>
      {props.extraDescription}
      <Form>
        <FormItem label={<Text message="Enter confirmation code" />} error={errors().code}>
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
        <Show when={props.onResend}>
          <FlatButton hideIcon={true} loading={loading() || resending()} disabled={secondsLeft() > 0} onClick={resend}>
            <Show when={secondsLeft() > 0} fallback={<Text message="Resend code" />}>
              <Text message="Resend code in {seconds} sec" seconds={secondsLeft()} />
            </Show>
          </FlatButton>
        </Show>
        <Show when={props.extraBtn}>{props.extraBtn}</Show>
      </Form>
    </div>
  );
}
