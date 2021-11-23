import { lazy } from '_common/utils/lazy';

export const Employee = lazy(() => import(/* webpackChunkName: "employees-view" */ './Employee'));
