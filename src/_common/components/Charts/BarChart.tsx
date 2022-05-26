import { createEffect } from 'solid-js';
import { createBarChart } from 'micro-charts';
import type { IBarChartData, IBarChartOptions } from 'micro-charts/lib/barchart/types';

import { useResize } from './useResize';
import { CHART_FONT, CHART_ROW_COLOR, CHART_ROW_FONT_SIZE, CHART_ROW_STROKE } from './constants';

import css from './BarChart.css';

const DEFAULT_BAR_WIDTH_PX = 14;

function draw(canvas: HTMLCanvasElement, props: Readonly<BarChartProps>) {
  createBarChart(canvas, props.data, {
    barColors: props.colors,
    barWidth: props.barWidth || DEFAULT_BAR_WIDTH_PX,
    barRadius: 0,
    stacked: props.stacked,
    top: 100,
    bottom: 0,
    rowCount: 4,
    rowStroke: CHART_ROW_STROKE,
    rowColor: CHART_ROW_COLOR,
    rowFont: CHART_FONT,
    rowFontSize: CHART_ROW_FONT_SIZE,
    rowRenderValue: (value: number) => `${value}%`,
    onHoverChange: props.onHover,
  });
}

interface BarChartProps {
  height: number;
  colors: readonly string[];
  stacked?: boolean;
  barWidth?: number;
  data: readonly Readonly<IBarChartData>[];
  onHover?: Required<IBarChartOptions>['onHoverChange'];
}

export function BarChart(props: Readonly<BarChartProps>) {
  let canvas!: HTMLCanvasElement;

  createEffect(() => draw(canvas, props));

  useResize(
    () => canvas,
    () => draw(canvas, props),
  );

  return (
    <div class={css.root} style={{ height: `${props.height}px` }}>
      <canvas ref={canvas} class={css.canvas} />
    </div>
  );
}
