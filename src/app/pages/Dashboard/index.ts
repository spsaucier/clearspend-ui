import { lazy } from '_common/utils/lazy';

export const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));
