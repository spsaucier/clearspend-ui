import { lazy } from '_common/utils/lazy';

export const ChangePassword = lazy(() => import(/* webpackChunkName: "profile-password" */ './ChangePassword'));
