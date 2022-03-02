import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { createForm, hasErrors, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { complete2faEnrollment } from 'app/services/auth';
import { InputCode } from '_common/components/InputCode/InputCode';
import { formatPhone } from '_common/formatters/phone';
import { useLoc } from '_common/api/router';

import css from './UpdatePhone.css';

interface FormValues {
  code: string;
}

const VALID_LENGTH = 6;

export default function ConfirmPhone() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();
  const { state } = useLoc<{ phone: string }>();

  const { values, errors, isDirty, handlers, trigger } = createForm<FormValues>({
    defaultValues: { code: '' },
    rules: { code: [required] },
  });

  const onUpdate = async () => {
    if (hasErrors(trigger())) return;
    const code = values().code.replace(/[^\d]/g, '').substr(0, VALID_LENGTH);

    if (code.length === VALID_LENGTH) {
      await complete2faEnrollment({
        method: 'sms',
        destination: state?.phone,
        code,
      });

      messages.success({
        title: i18n.t('Success'),
        message: i18n.t('Your phone will now be used as your second authentication factor.'),
      });
      navigate('/profile');
    }
  };

  return (
    <Page title={<Text message="Two-factor authentication" />}>
      <Section
        title={<Text message="Verify your phone number" />}
        description={`We have sent a confirmation code to ${state?.phone ? formatPhone(state.phone) : 'your phone'}`}
      >
        <Form class={css.wrapper}>
          <FormItem label={<Text message="Enter confirmation code" />} error={errors().code}>
            <InputCode
              codeLength={VALID_LENGTH}
              value={values().code}
              error={Boolean(errors().code)}
              onChange={handlers.code}
            />
          </FormItem>
        </Form>
      </Section>
      <Show when={isDirty()}>
        <PageActions
          action={<Text message="Update Phone Number" />}
          onCancel={() => navigate('/profile')}
          onSave={onUpdate}
        />
      </Show>
    </Page>
  );
}
