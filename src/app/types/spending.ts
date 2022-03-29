import type {
  ChartDataRequest as OriginChartDataRequest,
  ChartDataResponse as OriginChartDataResponse,
} from 'generated/capital';

export type ChartDataRequest = Omit<OriginChartDataRequest, 'chartFilter'>;
export type ChartDataResponse = Required<OriginChartDataResponse>;
