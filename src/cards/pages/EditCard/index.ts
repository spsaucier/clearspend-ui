import { lazy } from '_common/utils/lazy';

export const EditCard = lazy(() => import(/* webpackChunkName: "cards-edit" */ './EditCard'));
