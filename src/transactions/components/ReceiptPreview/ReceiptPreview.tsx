import { Show } from 'solid-js';

import { PdfView } from '_common/components/PdfView';
import { FileTypes } from 'app/types/common';

import type { ReceiptData } from '../../types';

import css from './ReceiptPreview.css';

interface ReceiptPreviewProps {
  size?: 'md' | 'lg';
  active?: boolean;
  data: Readonly<ReceiptData>;
  onClick?: (id: string) => void;
}

export function ReceiptPreview(props: Readonly<ReceiptPreviewProps>) {
  return (
    <div
      class={css.root}
      classList={{
        [css.lg!]: props.size === 'lg',
        [css.active!]: props.active,
      }}
      onClick={() => props.onClick?.(props.data.id)}
    >
      <Show when={props.data.type === FileTypes.PDF} fallback={<img src={props.data.uri} alt="Receipt preview" />}>
        <PdfView uri={props.data.uri} />
      </Show>
    </div>
  );
}
