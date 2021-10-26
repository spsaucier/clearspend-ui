import { Routes, Route } from 'solid-app-router';

import { EditEmployee } from 'employees/pages/EditEmployee';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { AccessInfo } from '../../components/AccessInfo';
import { Test } from '../../containers/Test';
import { Dashboard } from '../Dashboard';

export default function Main() {
  return (
    <MainLayout side={<Sidebar />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees/edit" element={<EditEmployee />} />
        <Route path="/employees/edit/:id" element={<EditEmployee />} />

        <Route path="/test/access" element={<AccessInfo />} />
        <Route path="/test/test" element={<Test />} />
      </Routes>
    </MainLayout>
  );
}
