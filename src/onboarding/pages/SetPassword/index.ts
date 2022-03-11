import { lazy } from '_common/utils/lazy';

export const SetPassword = lazy(() => import(/* webpackChunkName: "set-password" */ './SetPassword'));
