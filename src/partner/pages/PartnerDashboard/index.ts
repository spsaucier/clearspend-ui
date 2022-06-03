import { lazy } from '_common/utils/lazy';

export const PartnerDashboardPage = lazy(
  () => import(/* webpackChunkName: "partner-dashboard" */ './PartnerDashboardPage'),
);
