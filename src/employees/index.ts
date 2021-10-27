import { lazy } from '_common/utils/lazy';

export const Employees = lazy(() => import(/* webpackChunkName: "employees" */ './Employees'));
