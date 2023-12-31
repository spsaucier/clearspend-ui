import { Routes, Route } from 'solid-app-router';

import { Employees } from 'employees';
import { EmployeeView } from 'employees/pages/EmployeeView';
import { EmployeeEdit } from 'employees/pages/EmployeeEdit';
import { EmployeeUpdate } from 'employees/pages/EmployeeUpdate';
import { Profile } from 'employees/pages/Profile';
import { ProfileSettings } from 'employees/pages/ProfileSettings';
import { ChangePassword } from 'employees/pages/ChangePassword';
import { ConfirmPhone, UpdatePhone } from 'employees/pages/UpdatePhone';
import { Allocations } from 'allocations';
import { AllocationEdit } from 'allocations/pages/AllocationEdit';
import { Cards } from 'cards';
import { CardView } from 'cards/pages/CardView';
import { CardActivate } from 'cards/pages/CardActivate';
import { CardCreate } from 'cards/pages/CardCreate';
import { CompanySettings } from 'company';
import { Accounting } from 'accounting';
import AccountingSetup from 'accounting/pages/AccountingSetup/AccountingSetup';
import { Enable2fa } from 'onboarding/pages/Enable2fa';
import { PartnerDashboardPage } from 'partner/pages/PartnerDashboard';
import { ChartOfAccounts } from 'accounting/pages/ChartOfAccounts';

import { MainLayout } from '../../components/MainLayout';
import { Sidebar } from '../../components/Sidebar';
import { Dashboard } from '../../pages/Dashboard';

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/accounting-setup" element={<AccountingSetup />} />
      <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
      <Route path="/enable-2fa" element={<Enable2fa />} />
      <Route path="/partner" element={<PartnerDashboardPage />} />
      <Route
        path="/*all"
        element={
          <MainLayout side={<Sidebar />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/add" element={<EmployeeEdit />} />
              <Route path="/employees/view/:id" element={<EmployeeView />} />
              <Route path="/employees/edit/:id" element={<EmployeeUpdate />} />

              <Route path="/allocations" element={<Allocations />} />
              <Route path="/allocations/:id" element={<Allocations />} />
              <Route path="/allocations/edit" element={<AllocationEdit />} />

              <Route path="/cards" element={<Cards />} />
              <Route path="/cards/new" element={<CardCreate />} />
              <Route path="/cards/view/:id" element={<CardView />} />
              <Route path="/cards/activate/:id" element={<CardActivate />} />

              <Route path="/settings" element={<CompanySettings />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="/profile/password" element={<ChangePassword />} />
              <Route path="/profile/phone" element={<UpdatePhone />} />
              <Route path="/profile/phone-verify" element={<ConfirmPhone />} />

              <Route path="/accounting" element={<Accounting />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}
