import { lazy } from '_common/utils/lazy';

export const Onboarding = lazy(() => import(/* webpackChunkName: "onboarding" */ './Onboarding'));
export const Enable2fa = lazy(() => import(/* webpackChunkName: "enable-twofactor" */ './Enable2fa'));
