import { lazy } from '_common/utils/lazy';

export const UpdatePhone = lazy(() => import(/* webpackChunkName: "profile-phone" */ './UpdatePhone'));
export const ConfirmPhone = lazy(() => import(/* webpackChunkName: "profile-phone-verify" */ './ConfirmPhone'));
