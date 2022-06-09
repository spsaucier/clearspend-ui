import { Text } from 'solid-i18n';
import { useNavigate, useParams } from 'solid-app-router';
import { createSignal } from 'solid-js';

import { Button } from '_common/components/Button';
import { InputCode } from '_common/components/InputCode';
import { Modal, ModalCard } from '_common/components/Modal';
import { PagePreAuth } from 'app/components/PagePreAuth';
import { ResetPasswordForm } from 'app/components/ResetPasswordForm';
import { Header } from 'signup/components/Header';
import { Link } from '_common/components/Link';
import { HttpStatus } from '_common/api/fetch/types';
import type { PasswordErrors } from 'employees/pages/ChangePassword/ChangePassword';
import { useMessages } from 'app/containers/Messages/context';
import { handlePasswordErrors } from 'app/utils/password';

import { resetPassword } from '../../services/auth';

import css from './ResetPassword.css';

export default function ResetPassword() {
  const params = useParams<{ token: string }>();
  const messages = useMessages();
  const navigate = useNavigate();

  const [trustChallenge, setTrustChallenge] = createSignal<string>();
  const [twoFactorId, setTwoFactorId] = createSignal<string>();
  const [open2faPrompt, setOpen2faPrompt] = createSignal(false);
  const [twoFactorCode, setTwoFactorCode] = createSignal<string>();
  const [newPassword, setNewPassword] = createSignal<string>();

  const onReset = async (newPasswordFromForm?: string) => {
    if (newPasswordFromForm) {
      setNewPassword(newPassword);
    }

    try {
      const res = await resetPassword({
        newPassword: newPasswordFromForm ?? newPassword(),
        changePasswordId: params.token,
        trustChallenge: trustChallenge(),
        twoFactorId: twoFactorId(),
        twoFactorCode: twoFactorCode(),
      }).catch((e: PasswordErrors) => {
        handlePasswordErrors(e, messages);
      });

      if (res && res.status === HttpStatus.StepUpRequired) {
        if ('trustChallenge' in res.data) {
          setTrustChallenge(res.data.trustChallenge);
          setTwoFactorId(res.data.twoFactorId);
          setTwoFactorCode();
          setOpen2faPrompt(true);
        }
      } else if (res && res.status === HttpStatus.NoContent) {
        messages.success({
          title: 'Reset Password Success',
          message: 'Your password has been successfully changed. You may now log in with your new password.',
        });
        navigate('/');
      }
    } catch (e: unknown) {
      setTrustChallenge();
      setTwoFactorId();
      setTwoFactorCode();
    }
  };

  return (
    <PagePreAuth>
      <>
        <Header size="small">Reset Password</Header>
        <ResetPasswordForm onSubmit={(password) => onReset(password)} />
        <Link darkMode href="/login" class={css.secondary}>
          <Text message="Log In" />
        </Link>
      </>
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
                onReset();
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
    </PagePreAuth>
  );
}
