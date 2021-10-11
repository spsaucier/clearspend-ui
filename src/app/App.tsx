import { Routes, Route } from 'solid-app-router';

import { TestPage } from 'test';
import { SignUp } from 'signup';
import { Onboarding } from 'onboarding';

import { Login } from './pages/Login';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding/kyb" element={<Onboarding />} />
        <Route path="/onboarding/kyc" element={<Onboarding />} />
        <Route path="/onboarding/account" element={<Onboarding />} />
        <Route path="/onboarding/money" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}
