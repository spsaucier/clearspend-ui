import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { createForm, hasErrors, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { minLength, samePassword } from 'signup/components/PasswordForm/rules';

import css from './ChangePassword.css';

interface FormValues {
  current: string;
  password: string;
  confirm: string;
}

export default function ChangePassword() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { current: '', password: '', confirm: '' },
    rules: { current: [required], password: [minLength], confirm: [samePassword] },
  });

  const onUpdate = async () => {
    if (hasErrors(trigger())) return;

    // TODO: Add service

    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The password has been successfully updated.'),
    });
    navigate('/profile');
  };

  return (
    <Page title={<Text message="Password" />}>
      <Section
        title={<Text message="Update password" />}
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
      >
        <Form class={css.wrapper}>
          <FormItem label={<Text message="Current password" />} error={errors().current}>
            <Input
              name="password"
              type="password"
              value={values().current}
              autoComplete="off"
              placeholder={String(i18n.t('Password'))}
              error={Boolean(errors().current)}
              onChange={handlers.current}
            />
          </FormItem>
          <FormItem label={<Text message="New password" />} error={errors().password}>
            <Input
              name="new-password"
              type="password"
              value={values().password}
              autoComplete="off"
              placeholder={String(i18n.t('New password'))}
              error={Boolean(errors().password)}
              onChange={handlers.password}
            />
          </FormItem>
          <FormItem label={<Text message="Confirm new password" />} error={errors().confirm}>
            <Input
              name="confirm-password"
              type="password"
              value={values().confirm}
              autoComplete="off"
              placeholder={String(i18n.t('Confirm new password'))}
              error={Boolean(errors().confirm)}
              onChange={handlers.confirm}
            />
          </FormItem>
        </Form>
      </Section>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Update Password" />} onCancel={reset} onSave={onUpdate} />
      </Show>
    </Page>
  );
}
