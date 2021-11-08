import { createEffect } from 'solid-js';
import { createPieChart } from 'micro-charts';
import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { useWindowResize } from '../../api/media/useWindowResize';

import css from './PieChart.css';

function draw(canvas: HTMLCanvasElement, data: readonly Readonly<IPieChartData>[]) {
  createPieChart(canvas, data, {});
}

interface PieChartProps {
  size: number;
  data: readonly Readonly<IPieChartData>[];
}

export function PieChart(props: Readonly<PieChartProps>) {
  let canvas!: HTMLCanvasElement;

  createEffect(() => draw(canvas, props.data));
  useWindowResize(() => draw(canvas, props.data));

  return (
    <div class={css.root} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      <canvas ref={canvas} class={css.canvas} />
      <div class={css.inner} />
    </div>
  );
}
