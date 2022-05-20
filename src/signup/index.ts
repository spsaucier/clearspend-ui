import { lazy } from '_common/utils/lazy';

export const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ './SignUp'));
export const AccountingSignUp = lazy(() => import(/* webpackChunkName: "accounting-signup" */ './AccountingSignUp'));
