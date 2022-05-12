import { lazy } from '_common/utils/lazy';

export const EmployeeUpdate = lazy(() => import(/* webpackChunkName: "employees-update" */ './EmployeeUpdate'));
