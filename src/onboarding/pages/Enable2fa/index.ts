import { lazy } from '_common/utils/lazy';

export const Enable2fa = lazy(() => import(/* webpackChunkName: "enable-twofactor" */ './Enable2fa'));
