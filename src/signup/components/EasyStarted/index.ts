import { lazy } from '_common/utils/lazy';

export const EasyStarted = lazy(() => import(/* webpackChunkName: "easy-started" */ './EasyStarted'));
export const AccountingPartnershipEasyStarted = lazy(
  () => import(/* webpackChunkName: "accounting-partnership-easy-started" */ './AccountingPartnership'),
);
