import { Routes, Route } from 'solid-app-router';
import { createEffect } from 'solid-js';
import * as FS from '@fullstory/browser';
import mixpanel from 'mixpanel-browser';

import { SignUp } from 'signup';
import { SetPassword } from 'onboarding/pages/SetPassword';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login, Login2fa } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

export function App() {
  if (location.hostname !== 'localhost') {
    createEffect(() => {
      mixpanel.init(
        (window as CSWindow).clearspend_env?.MIXPANEL_PROJECT_TOKEN || process.env.MIXPANEL_PROJECT_TOKEN || '',
        {
          debug: false,
          ignore_dnt: true,
        },
      );
      FS.init({
        orgId: 'o-19RE1Q-na1',
        debug: (window as CSWindow).clearspend_env?.NODE_ENV !== 'production',
        // TODO: disable on dev/UAT after PoC
        // devMode: !(window as CSWindow).clearspend_env, // devMode disables FullStory
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
