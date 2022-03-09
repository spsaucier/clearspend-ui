import { lazy } from '_common/utils/lazy';

export const AccountingSetup = lazy(() => import(/* webpackChunkName: "accounting" */ './AccountingSetup'));
