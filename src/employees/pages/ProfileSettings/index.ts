import { lazy } from '_common/utils/lazy';

export const ProfileSettings = lazy(() => import(/* webpackChunkName: "profile-settings" */ './ProfileSettings'));
