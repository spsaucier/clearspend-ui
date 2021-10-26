import { lazy } from '_common/utils/lazy';

export const EditEmployee = lazy(() => import(/* webpackChunkName: "employees-edit" */ './EditEmployee'));
