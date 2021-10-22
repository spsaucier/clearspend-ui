import { Routes, Route } from 'solid-app-router';

import { SignUp } from 'signup';
import { Onboarding } from 'onboarding';

import { Messages } from './containers/Messages';
import { Login } from './pages/Login';
import { Main } from './pages/Main';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*all" element={<Main />} />
      </Routes>
      <Messages />
    </div>
  );
}
