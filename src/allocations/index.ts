import { lazy } from '_common/utils/lazy';

export const Allocations = lazy(() => import(/* webpackChunkName: "allocations" */ './Allocations'));
