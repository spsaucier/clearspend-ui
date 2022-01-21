import { lazy } from '_common/utils/lazy';

export const CardActivate = lazy(() => import(/* webpackChunkName: "cards-activate" */ './CardActivate'));
