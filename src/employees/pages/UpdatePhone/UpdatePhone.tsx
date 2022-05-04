import { Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { createForm, hasErrors, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { InputPhone } from '_common/components/InputPhone';
import { send2faEnrollmentCode } from 'app/services/auth';
import { validPhone } from '_common/components/Form/rules/patterns';
import { formatPhone } from '_common/formatters/phone';
import { useMessages } from 'app/containers/Messages/context';
import { i18n } from '_common/api/intl';

import css from './UpdatePhone.css';

interface FormValues {
  phone: string;
}

export default function UpdatePhone() {
  const navigate = useNavigate();
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { phone: '' },
    rules: { phone: [required, validPhone] },
  });

  const onUpdate = async () => {
    if (hasErrors(trigger())) return;

    await send2faEnrollmentCode({
      destination: values().phone,
      method: 'sms',
    });

    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('We have sent a confirmation code to {phone}', { phone: formatPhone(values().phone) }),
    });

    navigate('/profile/phone-verify', { state: { phone: values().phone } });
  };

  return (
    <Page title={<Text message="Two-factor authentication" />}>
      <Section
        title={<Text message="What is your mobile phone number?" />}
        description={'Your phone number will be used only for security'}
      >
        <Form class={css.wrapper}>
          <FormItem label={<Text message="Enter mobile phone number" />} error={errors().phone}>
            <InputPhone value={values().phone} error={Boolean(errors().phone)} onChange={handlers.phone} />
          </FormItem>
        </Form>
      </Section>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Next" />} onCancel={reset} onSave={onUpdate} />
      </Show>
    </Page>
  );
}
