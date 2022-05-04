import { Routes, Route } from 'solid-app-router';
import { onMount } from 'solid-js';
import * as FS from '@fullstory/browser';
import mixpanel from 'mixpanel-browser';
import { useScript } from 'solid-use-script';

import { SignUp } from 'signup';
import { SetPassword } from 'onboarding/pages/SetPassword';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login, Login2fa } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

const INTERCOM_SCRIPT = 'https://widget.intercom.io/widget/l381dwob';

export function App() {
  if (location.hostname !== 'localhost') {
    useScript(INTERCOM_SCRIPT);
    onMount(() => {
      mixpanel.init(
        (window as CSWindow).clearspend_env?.MIXPANEL_PROJECT_TOKEN || process.env.MIXPANEL_PROJECT_TOKEN || '',
        {
          debug: false,
          ignore_dnt: true,
        },
      );
      FS.init({
        orgId: 'o-19RE1Q-na1',
        devMode: location.hostname !== 'app.clearspend.com', // disables FullStory
      });
    });
  }
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
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
