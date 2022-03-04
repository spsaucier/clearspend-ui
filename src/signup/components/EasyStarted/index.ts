import { lazy } from '_common/utils/lazy';

export const EasyStarted = lazy(() => import(/* webpackChunkName: "easy-started" */ './EasyStarted'));
