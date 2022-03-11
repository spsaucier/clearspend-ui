import { createSignal, Show } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import logo from 'app/assets/logo-light.svg';
import { formatPhone } from '_common/formatters/phone';
import { complete2faEnrollment, send2faEnrollmentCode } from 'app/services/auth';
import { PhoneForm } from 'signup/components/PhoneForm';
import { VerifyForm } from 'signup/components/VerifyForm';
import { useMessages } from 'app/containers/Messages/context';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import css from './Enable2fa.css';

export default function Enable2fa() {
  const message = useMessages();
  const navigate = useNavigate();
  const [number, setNumber] = createSignal('');

  const onPhoneUpdate = async (phone: string) => {
    if (phone !== '+11111111111') {
      try {
        sendAnalyticsEvent({ name: Events.VERIFY_MOBILE });
        await send2faEnrollmentCode({ destination: phone, method: 'sms' });
        setNumber(phone);
        message.success({ title: `Sent a code to ${formatPhone(phone)}` });
      } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e);
        message.error({ title: 'Error sending code' });
      }
    } else {
      navigate('/');
    }
  };

  const onPhoneCodeResend = async () => {
    try {
      await send2faEnrollmentCode({ destination: number(), method: 'sms' });
      sendAnalyticsEvent({ name: Events.RESEND_PHONE_OTP });
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      message.error({ title: 'Error re-sending code' });
    }
  };

  const onPhoneConfirm = async (otp: string) => {
    try {
      await complete2faEnrollment({ destination: number(), code: otp, method: 'sms' });
      sendAnalyticsEvent({ name: Events.VERIFY_MOBILE });
      message.success({ title: `${formatPhone(number())} set as authentication method` });
      navigate('/');
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      message.error({ title: 'Error setting authentication method' });
      navigate('/');
    }
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={120} height={34} />
      </header>
      <div class={css.content}>
        <Show when={number()} fallback={<PhoneForm onNext={onPhoneUpdate} />}>
          <VerifyForm
            header="Verify your phone number"
            description={
              <Text message="We have sent a confirmation code to <b>{phone}</b>" phone={formatPhone(number())} />
            }
            onResend={onPhoneCodeResend}
            onConfirm={onPhoneConfirm}
          />
        </Show>
      </div>
    </section>
  );
}
