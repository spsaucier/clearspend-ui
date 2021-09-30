import { lazy } from '_common/utils/lazy';

export const TestPage = lazy(() => import(/* webpackChunkName: "test" */ './TestPage'));
