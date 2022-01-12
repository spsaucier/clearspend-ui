import { Routes, Route } from 'solid-app-router';
import { createEffect } from 'solid-js';

import { SignUp } from 'signup';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { sendAnalyticsEvent, AnalyticsEventType } from './utils/analytics';

export function App() {
  createEffect(() => {
    sendAnalyticsEvent({
      type: AnalyticsEventType.Init,
      name: 'fae11a3a59ea09ae6e4e9192a99220fb',
      data: { debug: true },
    });
  });
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/:token" element={<ResetPassword />} />
        <Route path="/*all" element={<Main />} />
      </Routes>
      <Messages />
    </div>
  );
}
