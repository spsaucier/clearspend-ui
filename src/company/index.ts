import { lazy } from '_common/utils/lazy';

export const CompanySettings = lazy(() => import(/* webpackChunkName: "company-settings" */ './CompanySettings'));
