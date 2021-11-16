import { lazy } from '_common/utils/lazy';

export const Test = lazy(() => import(/* webpackChunkName: "test" */ './Test'));
