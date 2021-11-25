import { Routes, Route } from 'solid-app-router';

import { Employees } from 'employees';
import { EmployeeView } from 'employees/pages/EmployeeView';
import { EmployeeEdit } from 'employees/pages/EmployeeEdit';
import { Allocations } from 'allocations';
import { AllocationEdit } from 'allocations/pages/AllocationEdit';
import { Cards } from 'cards';
import { CardView } from 'cards/pages/CardView';
import { CardEdit } from 'cards/pages/CardEdit';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { AccessInfo } from '../../components/AccessInfo';
import { Dashboard } from '../../pages/Dashboard';
import { Test } from '../Test';

export function MainRoutes() {
  return (
    <MainLayout side={<Sidebar />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/edit" element={<EmployeeEdit />} />
        <Route path="/employees/view/:id" element={<EmployeeView />} />

        <Route path="/allocations" element={<Allocations />} />
        <Route path="/allocations/edit" element={<AllocationEdit />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/edit" element={<CardEdit />} />
        <Route path="/cards/view/:id" element={<CardView />} />

        <Route path="/test/access" element={<AccessInfo />} />

        {/* TODO: Remove */}
        <Route path="/test/test" element={<Test />} />
      </Routes>
    </MainLayout>
  );
}
