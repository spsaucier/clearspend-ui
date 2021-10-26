import { lazy } from '_common/utils/lazy';

export const EditAllocation = lazy(() => import(/* webpackChunkName: "allocations-edit" */ './EditAllocation'));
