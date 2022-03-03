import { onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { SignUp } from 'signup';
import { PagePreAuth } from 'app/components/PagePreAuth/PagePreAuth';
import { VerifyForm } from 'signup/components/VerifyForm';
import { useLoc } from '_common/api/router';
import { sendAnalyticsEvent, AnalyticsEventType, Events } from 'app/utils/analytics';

import { loginWith2fa } from '../../services/auth';

export default function Login2fa() {
  const navigate = useNavigate();
  const { state } = useLoc<{ twoFactorId: string }>();

  onMount(() => SignUp.preload());

  const onCodeConfirm = async (code: string) => {
    const user = await loginWith2fa({ code, twoFactorId: state?.twoFactorId as string });
    sendAnalyticsEvent({ type: AnalyticsEventType.Identify, name: user.userId });
    sendAnalyticsEvent({ name: Events.LOGIN });
    navigate('/');
  };

  return (
    <PagePreAuth>
      <VerifyForm
        header="Welcome back"
        description={
          <Text message="Let's make sure it's really you. We sent a confirmation code to your mobile number." />
        }
        onConfirm={onCodeConfirm}
      />
    </PagePreAuth>
  );
}
