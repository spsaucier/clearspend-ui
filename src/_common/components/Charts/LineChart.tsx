import { createEffect } from 'solid-js';
import { createLineChart } from 'micro-charts';
import type { ILineChartData } from 'micro-charts/lib/linechart/types';

import { formatCurrency } from '../../api/intl/formatCurrency';

import { useResize } from './useResize';
import { CHART_FONT, CHART_ROW_FONT_SIZE, CHART_ROW_COLOR, CHART_ROW_STROKE } from './constants';

import css from './LineChart.css';

const ADDITIONAL = 10; // %
const MIN_TOP = 100; // % | $

function draw(canvas: HTMLCanvasElement, data: readonly Readonly<ILineChartData>[]) {
  const [min, max] = data.reduce((res, curr) => [Math.min(res[0], curr.value), Math.max(res[1], curr.value)], [0, 0]);

  createLineChart(canvas, data, {
    top: Math.max(MIN_TOP, Math.ceil((max * ADDITIONAL) / MIN_TOP + max)),
    bottom: Math.min(0, Math.ceil(min)),
    lineStroke: 1,
    lineSmooth: true,
    lineColor: '#5bea83',
    lineFill: ['rgba(239, 246, 255, 0)', '#DEFBE6'],
    pointRadius: 0,
    rowCount: 3,
    rowStroke: CHART_ROW_STROKE,
    rowColor: CHART_ROW_COLOR,
    rowFont: CHART_FONT,
    rowFontSize: CHART_ROW_FONT_SIZE,
    rowRenderValue: (value: number) => formatCurrency(value, { fractions: 0 }),
  });
}

interface LineChartProps {
  height: number;
  data: readonly Readonly<ILineChartData>[];
}

export function LineChart(props: Readonly<LineChartProps>) {
  let canvas!: HTMLCanvasElement;

  createEffect(() => draw(canvas, props.data));
  useResize(
    () => canvas,
    () => draw(canvas, props.data),
  );

  return (
    <div class={css.root} style={{ height: `${props.height}px` }}>
      <canvas ref={canvas} class={css.canvas} />
    </div>
  );
}
