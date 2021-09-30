import { Routes, Route, Link } from 'solid-app-router';

import { TestPage } from 'test';

import { Login } from './pages/Login';

import css from './App.css';

export function App() {
  return (
    <div>
      <nav>
        <Link href="/" class={css.nav}>
          Home
        </Link>
        <Link href="/login" class={css.nav}>
          Login
        </Link>
        <Link href="/test" class={css.nav}>
          Test
        </Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}
