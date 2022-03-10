import { lazy } from '_common/utils/lazy';

export const PdfView = lazy(() => import(/* webpackChunkName: "pdf-view" */ './PdfView'));
