import { lazy } from 'solid-js';

export const TestPage = lazy(() => import(/* webpackChunkName: "test" */ './TestPage'));
