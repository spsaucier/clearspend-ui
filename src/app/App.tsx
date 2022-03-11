import { Routes, Route } from 'solid-app-router';
import { createEffect } from 'solid-js';

import { SignUp } from 'signup';
import { SetPassword } from 'onboarding/pages/SetPassword';
import { Enable2fa } from 'onboarding/pages/Enable2fa';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login, Login2fa } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { sendAnalyticsEvent, AnalyticsEventType } from './utils/analytics';

export function App() {
  createEffect(() => {
    sendAnalyticsEvent({
      type: AnalyticsEventType.Init,
      name: (window as CSWindow).clearspend_env?.MIXPANEL_PROJECT_TOKEN || process.env.MIXPANEL_PROJECT_TOKEN,
      data: {
        debug: !(window as CSWindow).clearspend_env?.MIXPANEL_PROJECT_TOKEN,
        ignore_dnt: true,
      },
    });
  });
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/enable-2fa" element={<Enable2fa />} />
        <Route path="/login-2fa" element={<Login2fa />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/:token" element={<ResetPassword />} />
        <Route path="/*all" element={<Main />} />
      </Routes>
      <Messages />
    </div>
  );
}
