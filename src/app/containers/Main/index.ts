import { lazy } from '_common/utils/lazy';

export const Main = lazy(() => import(/* webpackChunkName: "app" */ './Main'));
