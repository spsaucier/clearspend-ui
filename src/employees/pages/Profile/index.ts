import { lazy } from '_common/utils/lazy';

export const Profile = lazy(() => import(/* webpackChunkName: "employees-profile" */ './Profile'));
