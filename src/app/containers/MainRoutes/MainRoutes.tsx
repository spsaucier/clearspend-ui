import { Routes, Route } from 'solid-app-router';

import { Employees } from 'employees';
import { EmployeeView } from 'employees/pages/EmployeeView';
import { EmployeeEdit } from 'employees/pages/EmployeeEdit';
import { Profile } from 'employees/pages/Profile';
import { ProfileSettings } from 'employees/pages/ProfileSettings';
import { ChangePassword } from 'employees/pages/ChangePassword';
import { Allocations } from 'allocations';
import { AllocationEdit } from 'allocations/pages/AllocationEdit';
import { Cards } from 'cards';
import { CardView } from 'cards/pages/CardView';
import { CardActivate } from 'cards/pages/CardActivate';
import { CardEdit } from 'cards/pages/CardEdit';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { Dashboard } from '../../pages/Dashboard';

export function MainRoutes() {
  return (
    <MainLayout side={<Sidebar />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/edit" element={<EmployeeEdit />} />
        <Route path="/employees/view/:id" element={<EmployeeView />} />

        <Route path="/allocations" element={<Allocations />} />
        <Route path="/allocations/:id" element={<Allocations />} />
        <Route path="/allocations/edit" element={<AllocationEdit />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/edit" element={<CardEdit />} />
        <Route path="/cards/view/:id" element={<CardView />} />
        <Route path="/cards/activate/:id" element={<CardActivate />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/profile/password" element={<ChangePassword />} />
      </Routes>
    </MainLayout>
  );
}
