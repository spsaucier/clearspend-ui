import { lazy } from '_common/utils/lazy';

export const Cards = lazy(() => import(/* webpackChunkName: "cards" */ './Cards'));
