import { Routes, Route } from 'solid-app-router';

import { Employees } from 'employees';
import { Employee } from 'employees/pages/Employee';
import { EditEmployee } from 'employees/pages/EditEmployee';
import { Allocations } from 'allocations';
import { EditAllocation } from 'allocations/pages/EditAllocation';
import { Cards } from 'cards';
import { EditCard } from 'cards/pages/EditCard';

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
        <Route path="/employees/edit" element={<EditEmployee />} />
        <Route path="/employees/view/:id" element={<Employee />} />

        <Route path="/allocations" element={<Allocations />} />
        <Route path="/allocations/edit" element={<EditAllocation />} />
        <Route path="/allocations/edit/:id" element={<EditAllocation />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/edit" element={<EditCard />} />
        <Route path="/cards/edit/:id" element={<EditCard />} />

        <Route path="/test/access" element={<AccessInfo />} />
        <Route path="/test/test" element={<Test />} />
      </Routes>
    </MainLayout>
  );
}
