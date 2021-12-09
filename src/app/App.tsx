import { Routes, Route } from 'solid-app-router';
import mixpanel from 'mixpanel-browser';
import { createEffect } from 'solid-js';

import { SignUp } from 'signup';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login } from './pages/Login';

export function App() {
  createEffect(() => {
    mixpanel.init('fae11a3a59ea09ae6e4e9192a99220fb', { debug: true });
  });
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*all" element={<Main />} />
      </Routes>
      <Messages />
    </div>
  );
}
