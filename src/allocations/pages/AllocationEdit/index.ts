import { lazy } from '_common/utils/lazy';

export const AllocationEdit = lazy(() => import(/* webpackChunkName: "allocations-edit" */ './AllocationEdit'));
