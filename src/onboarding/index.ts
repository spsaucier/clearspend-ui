import { lazy } from '_common/utils/lazy';

export const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ './SignUp'));
