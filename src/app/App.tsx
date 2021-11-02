import { Routes, Route } from 'solid-app-router';

import { SignUp } from 'signup';

import { Main } from './containers/Main';
import { Messages } from './containers/Messages';
import { Login } from './pages/Login';

export function App() {
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
