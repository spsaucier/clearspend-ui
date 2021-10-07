import { Routes, Route, Link } from 'solid-app-router';

import { TestPage } from 'test';
import { SignUp } from 'onboarding';

import { Login } from './pages/Login';

import css from './App.css';

export function App() {
  return (
    <div>
      <nav>
        <Link href="/" class={css.nav}>
          Home
        </Link>
        <Link href="/signup" class={css.nav}>
          SignUp
        </Link>
        <Link href="/login" class={css.nav}>
          Login
        </Link>
        <Link href="/test" class={css.nav}>
          Test
        </Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}
