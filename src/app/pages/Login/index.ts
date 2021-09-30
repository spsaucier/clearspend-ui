import { lazy } from '_common/utils/lazy';

export const Login = lazy(() => import(/* webpackChunkName: "login" */ './Login'));
