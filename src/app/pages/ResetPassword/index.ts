import { lazy } from '_common/utils/lazy';

export const ResetPassword = lazy(() => import(/* webpackChunkName: "reset-password" */ './ResetPassword'));
