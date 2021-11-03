import { createEffect } from 'solid-js';
import { createLineChart } from 'micro-charts';
import type { ILineChartData } from 'micro-charts/lib/linechart/types';

import { useWindowResize } from '../../api/media/useWindowResize';

import css from './LineChart.css';

function draw(canvas: HTMLCanvasElement, data: readonly Readonly<ILineChartData>[]) {
  createLineChart(canvas, data, {
    top: 100,
    bottom: 0,
    lineStroke: 1,
    lineSmooth: true,
    lineColor: '#2563eb',
    lineFill: ['rgba(239, 246, 255, 0)', 'rgba(239, 246, 255, 1)'],
    pointRadius: 0,
    rowCount: 3,
    rowStroke: 0.2,
    rowColor: '#9ca3af',
    rowFont: '"Inter", system, -apple-system, BlinkMacSystemFont',
    rowFontSize: 10,
  });
}

interface LineChartProps {
  height: number;
  data: readonly Readonly<ILineChartData>[];
}

export function LineChart(props: Readonly<LineChartProps>) {
  let canvas!: HTMLCanvasElement;

  createEffect(() => draw(canvas, props.data));
  useWindowResize(() => draw(canvas, props.data));

  return (
    <div class={css.root} style={{ height: `${props.height}px` }}>
      <canvas ref={canvas} class={css.canvas} />
    </div>
  );
}
