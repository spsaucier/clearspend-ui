import { lazy } from 'solid-js';

export const Login = lazy(() => import(/* webpackChunkName: "login" */ './Login'));
