import { createMemo, For, Show, type Accessor } from 'solid-js';
import { Text, useI18n } from 'solid-i18n';

import { Modal } from '_common/components/Modal';
import { Confirm } from '_common/components/Confirm';
import { PdfView } from '_common/components/PdfView';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { wrapAction } from '_common/utils/wrapAction';
import { FileTypes } from 'app/types/common';
import { useMessages } from 'app/containers/Messages/context';
import { FILE_EXTENSIONS } from 'app/constants/files';
import { deleteReceipt, getActivityById } from 'app/services/activity';
import type { AccountActivityResponse } from 'generated/capital';

import { ReceiptPreview } from '../../components/ReceiptPreview';
import type { ReceiptData } from '../../types';

import css from './ReceiptsModal.css';

export function ReceiptsModal(props: {
  activityId: string | undefined;
  currentId: Accessor<string | undefined>;
  receipts: Accessor<readonly Readonly<ReceiptData>[]>;
  onSelect: (id: string) => void;
  onUpdate: (receipts: readonly Readonly<ReceiptData>[], transaction: Readonly<AccountActivityResponse>) => void;
  onClose: () => void;
}) {
  const i18n = useI18n();
  const messages = useMessages();

  const currentIndex = createMemo(() => props.receipts().findIndex((item) => item.id === props.currentId()));
  const currentReceipt = createMemo(() => props.receipts()[currentIndex()]!);
  const receiptsCount = createMemo(() => props.receipts().length);

  const [deleting, deleteReceiptAction] = wrapAction(deleteReceipt);

  const onClickNext = () => props.onSelect(props.receipts()[currentIndex() + 1]!.id);
  const onClickPrev = () => props.onSelect(props.receipts()[currentIndex() - 1]!.id);

  const onDelete = () => {
    const currentId = currentReceipt().id;
    deleteReceiptAction(currentId)
      .then(() => {
        const updated = props.receipts().filter((item) => item.id !== currentId);
        if (updated.length) props.onSelect(updated[0]!.id);
        return getActivityById(props.activityId!).then((data) => props.onUpdate(updated, data));
      })
      .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
  };

  return (
    <Modal isOpen={Boolean(props.activityId) && Boolean(receiptsCount())} onClose={props.onClose}>
      <div class={css.root}>
        <div class={css.top}>
          <Text message="{current} of {total}" current={currentIndex() + 1} total={receiptsCount()} />
          <span class={css.close} onClick={() => props.onClose()}>
            <Text message="Close" />
            <Icon name="cancel" />
          </span>
        </div>
        <div class={css.previews}>
          <For each={props.receipts()}>
            {(receipt) => (
              <ReceiptPreview
                data={receipt}
                active={receipt.id === props.currentId()}
                onClick={() => props.onSelect(receipt.id)}
              />
            )}
          </For>
        </div>
        <div class={css.content}>
          <Show when={currentIndex() > 0}>
            <Button view="ghost" icon="arrow-left" class={css.prev} onClick={onClickPrev} />
          </Show>
          <Show
            when={currentReceipt().type === FileTypes.PDF}
            fallback={<img src={currentReceipt().uri} alt="Receipt" />}
          >
            <PdfView uri={currentReceipt().uri} />
          </Show>
          <Show when={currentIndex() + 1 < receiptsCount()}>
            <Button view="ghost" icon="arrow-right" class={css.next} onClick={onClickNext} />
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
            onConfirm={onDelete}
          >
            {(args) => (
              <Button size="lg" type="danger" view="second" icon="trash" loading={deleting()} {...args}>
                <Text message="Delete" />
              </Button>
            )}
          </Confirm>
        </div>
      </div>
    </Modal>
  );
}
