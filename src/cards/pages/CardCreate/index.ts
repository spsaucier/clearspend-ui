import { lazy } from '_common/utils/lazy';

export const CardCreate = lazy(() => import(/* webpackChunkName: "cards-edit" */ './CardCreate'));
