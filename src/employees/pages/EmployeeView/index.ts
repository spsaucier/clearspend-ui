import { lazy } from '_common/utils/lazy';

export const EmployeeView = lazy(() => import(/* webpackChunkName: "employees-view" */ './EmployeeView'));
