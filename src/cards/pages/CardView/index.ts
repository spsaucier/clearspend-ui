import { lazy } from '_common/utils/lazy';

export const CardView = lazy(() => import(/* webpackChunkName: "cards-view" */ './CardView'));
