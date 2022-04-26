import { createMemo, For, Show, onMount } from 'solid-js';
import { Text } from 'solid-i18n';
import { createSlider } from 'solid-slider';
import { Portal } from 'solid-js/web';

import { Modal } from '_common/components/Modal';
import { Confirm } from '_common/components/Confirm';
import { PdfView } from '_common/components/PdfView';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { FileTypes } from 'app/types/common';
import { FILE_EXTENSIONS } from 'app/constants/files';

import { ReceiptPreview } from '../../components/ReceiptPreview';
import type { ReceiptData } from '../../types';

import css from './ReceiptsModal.css';

const MS_FOR_SLIDE_TRANSITION = 300;

export function ReceiptsModal(props: {
  initialIdx: number;
  receipts: Readonly<ReceiptData>[];
  onDelete: (id: string) => void;
  deleting: boolean;
  onClose: () => void;
}) {
  let ref!: HTMLDivElement;
  const options = { initial: props.initialIdx };
  const [create, { current, next, prev, moveTo, slider }] = createSlider(options);
  onMount(() => {
    create(ref);
  });

  const currentReceipt = createMemo(() => props.receipts[current()]!);
  const receiptsCount = createMemo(() => props.receipts.length || 0);

  const onDelete = async () => {
    const idToDelete = currentReceipt().id;
    if (receiptsCount() > 1) {
      await new Promise((resolve) => {
        prev();
        setTimeout(resolve, MS_FOR_SLIDE_TRANSITION);
      });
    }
    await props.onDelete(idToDelete);
    if (receiptsCount() <= 1) {
      props.onClose();
    } else {
      setTimeout(() => {
        slider().destroy();
        create(ref);
      }, MS_FOR_SLIDE_TRANSITION);
    }
  };

  return (
    <Portal>
      <Modal isOpen={typeof props.initialIdx !== 'undefined' && Boolean(receiptsCount())} onClose={props.onClose}>
        <div class={css.root}>
          <div class={css.top}>
            <Text message="{current} of {total}" current={current() + 1} total={receiptsCount()} />
            <span class={css.close} onClick={() => props.onClose()}>
              <Text message="Close" />
              <Icon name="cancel" />
            </span>
          </div>
          <div class={css.previews}>
            <For each={props.receipts}>
              {(receipt, i) => (
                <ReceiptPreview data={receipt!} active={i() === current()} onClick={() => moveTo(i())} />
              )}
            </For>
          </div>
          <div class={css.content}>
            <Show when={current() > 0}>
              <Button view="ghost" icon="arrow-left" class={css.prev} onClick={prev} />
            </Show>
            <div ref={ref} class={css.keenSlider}>
              <For each={props.receipts}>
                {(receipt) => (
                  <div class={css.keenSliderSlide}>
                    <Show when={receipt.type === FileTypes.PDF} fallback={<img src={receipt.uri} alt="Receipt" />}>
                      <PdfView uri={receipt.uri} />
                    </Show>
                  </div>
                )}
              </For>
            </div>
            <Show when={current() + 1 < receiptsCount()}>
              <Button view="ghost" icon="arrow-right" class={css.next} onClick={next} />
            </Show>
          </div>
          <div class={css.actions}>
            <Button
              size="lg"
              icon="download"
              href={currentReceipt().uri}
              download={`${currentReceipt().id}.${FILE_EXTENSIONS[currentReceipt().type]}`}
            >
              <Text message="Download" />
            </Button>
            <Confirm
              position="top-right"
              question={<Text message="Are you sure you want to delete this receipt?" />}
              confirmText={<Text message="Delete" />}
              onConfirm={() => onDelete()}
            >
              {(args) => (
                <Button size="lg" type="danger" view="second" icon="trash" loading={props.deleting} {...args}>
                  <Text message="Delete" />
                </Button>
              )}
            </Confirm>
          </div>
        </div>
      </Modal>
    </Portal>
  );
}
