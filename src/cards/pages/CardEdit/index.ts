import { lazy } from '_common/utils/lazy';

export const CardEdit = lazy(() => import(/* webpackChunkName: "cards-edit" */ './CardEdit'));
