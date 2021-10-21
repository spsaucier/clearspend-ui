import { Routes, Route } from 'solid-app-router';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { AccessInfo } from '../../components/AccessInfo';
import { Dashboard } from '../Dashboard';

export function Main() {
  return (
    <MainLayout side={<Sidebar />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/access" element={<AccessInfo />} />
      </Routes>
    </MainLayout>
  );
}
