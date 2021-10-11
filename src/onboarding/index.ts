import { lazy } from '_common/utils/lazy';

export const Onboarding = lazy(() => import(/* webpackChunkName: "onboarding" */ './Onboarding'));
