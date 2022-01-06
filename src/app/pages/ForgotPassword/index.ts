import { lazy } from '_common/utils/lazy';

export const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot-password" */ './ForgotPassword'));
