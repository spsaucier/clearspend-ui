import { Routes, Route } from 'solid-app-router';

import { MainLayout } from '../../components/MainLayout';
import { Dashboard } from '../Dashboard';

export function Main() {
  return (
    <MainLayout side={<div>TODO</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
}
