import { Icon } from '_common/components/Icon';

import type { Card } from '../../types';

import css from './CardPreview.css';

interface CardPreviewProps {
  data: Readonly<Card>;
}

export function CardPreview(props: Readonly<CardPreviewProps>) {
  return (
    <div class={css.root}>
      <div class={css.icon}>
        <Icon name="card" />
      </div>
      <div>
        <div>
          <span class={css.number}>••••{props.data.lastFour}</span>
        </div>
        <div class={css.allocation}>[allocation]</div>
      </div>
    </div>
  );
}
