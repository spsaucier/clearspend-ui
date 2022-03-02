import { lazy } from '_common/utils/lazy';

export const Login = lazy(() => import(/* webpackChunkName: "login" */ './Login'));
export const Login2fa = lazy(() => import(/* webpackChunkName: "login-twofactor" */ './Login2fa'));
