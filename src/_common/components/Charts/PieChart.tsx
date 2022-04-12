import { createSignal, createEffect, type JSXElement } from 'solid-js';
import { createPieChart } from 'micro-charts';
import debounce from '@solid-primitives/debounce';
import type { IPieChartData } from 'micro-charts/lib/piechart/types';
import type { IHoverData } from 'micro-charts/lib/types';

import { useWindowResize } from '../../api/media/useWindowResize';
import { join } from '../../utils/join';

import css from './PieChart.css';

const WAIT_MS = 50;

interface PieChartProps {
  size: number;
  data: readonly Readonly<IPieChartData>[];
  class?: string;
  children?: (id: string | undefined) => JSXElement;
}

export function PieChart(props: Readonly<PieChartProps>) {
  let canvas!: HTMLCanvasElement;

  const [hoverId, setHoverId] = createSignal<string>();
  const onHoverChange = debounce((value: IHoverData<IPieChartData> | undefined) => setHoverId(value?.data.id), WAIT_MS);

  createEffect(() => createPieChart(canvas, props.data, { size: props.size, onHoverChange }));
  useWindowResize(() => createPieChart(canvas, props.data, { size: props.size, onHoverChange }));

  return (
    <div class={join(css.root, props.class)} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      <canvas ref={canvas} class={css.canvas} />
      <div class={css.inner}>{props.children?.(hoverId())}</div>
    </div>
  );
}
