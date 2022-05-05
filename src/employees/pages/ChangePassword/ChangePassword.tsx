import { Show, createSignal } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { createForm, hasErrors, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { minLength, samePassword } from 'signup/components/PasswordForm/rules';
import { changePassword } from 'app/services/auth';
import { HttpStatus } from '_common/api/fetch/types';
import { Button } from '_common/components/Button';
import { Modal, ModalCard } from '_common/components/Modal';

import { InputCode } from '../../../_common/components/InputCode/InputCode';

import css from './ChangePassword.css';

interface FormValues {
  current: string;
  password: string;
  confirm: string;
}

interface PasswordErrors {
  data?: {
    fieldErrors?: {
      [key: string]: {
        code: string;
        message: string;
      }[];
    };
    generalErrors?: {
      [key: string]: {
        code: string;
        message: string;
      }[];
    };
  };
  status: number;
}

export default function ChangePassword() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();
  const [trustChallenge, setTrustChallenge] = createSignal<string>();
  const [twoFactorId, setTwoFactorId] = createSignal<string>();
  const [open2faPrompt, setOpen2faPrompt] = createSignal(false);
  const [twoFactorCode, setTwoFactorCode] = createSignal<string>();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { current: '', password: '', confirm: '' },
    rules: { current: [required], password: [minLength], confirm: [samePassword] },
  });

  const onUpdate = async () => {
    if (hasErrors(trigger())) return;

    try {
      const res = await changePassword({
        currentPassword: values().current,
        newPassword: values().password,
        trustChallenge: trustChallenge(),
        twoFactorId: twoFactorId(),
        twoFactorCode: twoFactorCode(),
      }).catch((e: PasswordErrors) => {
        if (e.data?.fieldErrors?.password && e.data.fieldErrors.password[0]?.code === '[previouslyUsed]password') {
          messages.error({
            title: i18n.t('Unable to update password'),
            message: i18n.t('You cannot use a previously used password'),
          });
        } else {
          messages.error({
            title: i18n.t('Failed to update password'),
            message:
              // eslint-disable-next-line @typescript-eslint/no-magic-numbers
              e.status === 404
                ? i18n.t('Are you sure you entered the correct password?')
                : e.data?.fieldErrors?.password
                ? e.data.fieldErrors.password[0]?.message
                : '',
          });
        }
        // eslint-disable-next-line no-console
        console.error(e);
        throw new Error(JSON.stringify(e));
      });
      if (res.status === HttpStatus.StepUpRequired) {
        if ('trustChallenge' in res.data) {
          setTrustChallenge(res.data.trustChallenge);
          setTwoFactorId(res.data.twoFactorId);
          setTwoFactorCode();
          setOpen2faPrompt(true);
        }
      } else if (res.status === HttpStatus.NoContent) {
        messages.success({
          title: i18n.t('Success'),
          message: i18n.t('The password has been successfully updated.'),
        });
        navigate('/profile');
      }
    } catch (e: unknown) {
      reset();
      setTrustChallenge();
      setTwoFactorId();
      setTwoFactorCode();
    }
  };

  return (
    <Page title={<Text message="Password" />}>
      <Section title={<Text message="Update password" />} description={'Please enter your current and new password.'}>
        <Form class={css.wrapper}>
          <FormItem label={<Text message="Current password" />} error={errors().current}>
            <Input
              name="password"
              type="password"
              value={values().current}
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
              autoComplete="chrome-off"
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
              autoComplete="chrome-off"
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
      <Modal isOpen={open2faPrompt()} onClose={() => setOpen2faPrompt(false)}>
        <ModalCard
          onClose={() => setOpen2faPrompt(false)}
          title={<Text message="Enter 2FA Code" />}
          actions={
            <Button
              size="lg"
              type="primary"
              onClick={() => {
                setOpen2faPrompt(false);
                onUpdate();
              }}
              data-name="submit-code"
            >
              <Text message="Submit Code" />
            </Button>
          }
        >
          <p>
            <Text message="We have sent a code to your phone via SMS." />
          </p>
          <InputCode value={twoFactorCode() || ''} onChange={setTwoFactorCode} codeLength={6} />
        </ModalCard>
      </Modal>
    </Page>
  );
}
