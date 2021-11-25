import { lazy } from '_common/utils/lazy';

export const EmployeeEdit = lazy(() => import(/* webpackChunkName: "employees-edit" */ './EmployeeEdit'));
