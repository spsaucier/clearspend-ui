import { lazy } from '_common/utils/lazy';

export const Accounting = lazy(() => import(/* webpackChunkName: "accounting" */ './Accounting'));
