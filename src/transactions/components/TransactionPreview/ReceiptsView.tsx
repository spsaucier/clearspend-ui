import { createSignal, createMemo, For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { PdfView } from '_common/components/PdfView';
import { deleteReceipt, getActivityById } from 'app/services/activity';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { wrapAction } from '_common/utils/wrapAction';
import { FileTypes } from 'app/types/common';
import { FILE_EXTENSIONS } from 'app/constants/files';
import type { AccountActivityResponse } from 'generated/capital';

import css from './ReceiptsView.css';

export interface ReceiptVideModel {
  receiptId: string;
  type: FileTypes;
  uri: string;
}

export function ReceiptsView(props: {
  receipts: Readonly<ReceiptVideModel[]>;
  accountActivityId: string;
  onEmpty: () => void;
  onUpdate: (data: Readonly<AccountActivityResponse>) => void;
}) {
  const [currentReceiptIndex, setCurrentReceiptIndex] = createSignal<number>(0);
  const [visibleReceipts, setVisibleReceipts] = createSignal<ReceiptVideModel[]>([...props.receipts]);
  const currentReceipt = createMemo(() => visibleReceipts()[currentReceiptIndex()]!);

  const [deleting, deleteReceiptAction] = wrapAction(deleteReceipt);

  const selectReceiptAtIndex = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentReceiptIndex(index);
  };

  const nextReceipt = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentReceiptIndex(currentReceiptIndex() + 1);
  };

  const previousReceipt = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentReceiptIndex(currentReceiptIndex() - 1);
  };

  const deleteSelectedReceipt = async (e: MouseEvent) => {
    e.stopPropagation();
    const remainingReceipts = visibleReceipts().filter((r) => r.receiptId !== currentReceipt().receiptId);
    await deleteReceiptAction(currentReceipt().receiptId!);
    props.onUpdate(await getActivityById(props.accountActivityId));
    remainingReceipts.length ? setCurrentReceiptIndex(0) : props.onEmpty();
    setVisibleReceipts(remainingReceipts);
  };

  return (
    <div class={css.root}>
      <div class={css.top}>
        <Text message="{current} of {total}" current={currentReceiptIndex() + 1} total={visibleReceipts().length} />
        <span class={css.close}>
          <Text message="Close" />
          <Icon name="cancel" />
        </span>
      </div>
      <div class={css.previews}>
        <For each={visibleReceipts()}>
          {(receipt, index) => (
            <div
              class={css.preview}
              classList={{ [css.current!]: currentReceiptIndex() === index() }}
              onClick={(e) => selectReceiptAtIndex(e, index())}
            >
              <Show when={receipt.type === FileTypes.PDF} fallback={<img src={receipt.uri} alt="Receipt preview" />}>
                <PdfView uri={receipt.uri} />
              </Show>
            </div>
          )}
        </For>
      </div>
      <>
        <div class={css.content}>
          <Show when={currentReceiptIndex() > 0}>
            <Button view="ghost" icon="arrow-left" class={css.prev} onClick={previousReceipt} />
          </Show>
          <Show
            when={currentReceipt().type === FileTypes.PDF}
            fallback={<img src={currentReceipt().uri} alt="Receipt" />}
          >
            <PdfView uri={currentReceipt().uri} />
          </Show>
          <Show when={currentReceiptIndex() + 1 < visibleReceipts().length}>
            <Button view="ghost" icon="arrow-right" class={css.next} onClick={nextReceipt} />
          </Show>
        </div>
        <div class={css.actions}>
          <Button
            icon="download"
            size="lg"
            onClick={(e) => e.stopPropagation()}
            href={currentReceipt().uri}
            download={`${currentReceipt().receiptId}.${FILE_EXTENSIONS[currentReceipt().type]}`}
          >
            <Text message="Download" />
          </Button>
          <Button
            type="danger"
            view="second"
            icon="trash"
            size="lg"
            onClick={deleteSelectedReceipt}
            loading={deleting()}
          >
            <Text message="Delete" />
          </Button>
        </div>
      </>
    </div>
  );
}
