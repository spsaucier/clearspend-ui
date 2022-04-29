import { createSignal, createMemo, For, Show } from 'solid-js';
import { Match, Switch } from 'solid-js/web';
import { Text, useI18n } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';
import { FilesDropArea } from '_common/components/FilesDropArea';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { getActivityById, uploadReceipt, fetchReceipt, deleteReceipt } from 'app/services/activity';
import { FileTypes } from 'app/types/common';
import type { AccountActivityResponse } from 'generated/capital';

import { ReceiptPreview } from '../../components/ReceiptPreview';
import { isAllowedReceipts } from '../../utils/isAllowedReceipts';
import { ReceiptsModal } from '../ReceiptsModal';

import { getReceiptData } from './utils';

import css from './TransactionReceipts.css';

const RECEIPT_FILE_TYPES = [FileTypes.JPG, FileTypes.PNG, FileTypes.PDF];

interface TransactionReceiptsProps {
  data: Readonly<AccountActivityResponse>;
  onUpdate: (data: Readonly<AccountActivityResponse[]>) => void;
}

export function TransactionReceipts(props: Readonly<TransactionReceiptsProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const [initialIdx, setInitialIdx] = createSignal<number>();

  let input!: HTMLInputElement;

  const receiptIds = createMemo<readonly string[]>(() => props.data.receipt?.receiptId || []);
  const [receipts, status, , , reload, mutate] = useResource(() => Promise.all(receiptIds().map(fetchReceipt)));

  const [uploading, upload] = wrapAction((files: readonly File[]) =>
    Promise.all(files.map((file) => uploadReceipt(props.data.accountActivityId!, getReceiptData(file)))),
  );

  const onUpload = (files: readonly File[]) => {
    upload(files)
      .then(() => getActivityById(props.data.accountActivityId!))
      .then((updatedTransaction) => {
        props.onUpdate([updatedTransaction]);
        return reload();
      })
      .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
  };

  const onChooseFiles = () => input.click();
  const onChangeFiles = (event: Event) => {
    setInitialIdx();
    return onUpload(Array.from((event.target as HTMLInputElement).files || []));
  };

  const [deletingId, setDeletingId] = createSignal<string>();

  const onDelete = (id: string) => {
    setDeletingId(id);
    deleteReceipt(id)
      .then(() => {
        mutate((prev) => prev.filter((item) => item.id !== id));
        return getActivityById(props.data.accountActivityId!);
      })
      .then((updatedTransaction) => {
        props.onUpdate([updatedTransaction]);
        if (typeof initialIdx() !== 'undefined') {
          setInitialIdx(0);
        }
        setDeletingId();
      })
      .catch(() => {
        messages.error({ title: String(i18n.t('Something went wrong')) });
        setDeletingId();
      });
  };

  const allowReceiptUpload = createMemo(() => isAllowedReceipts(props.data.merchant, props.data.status));

  return (
    <>
      <Show when={allowReceiptUpload()}>
        <div>
          <Text message="Receipt" class={css.label!} />
          <input
            ref={input}
            type="file"
            accept={RECEIPT_FILE_TYPES.join(',')}
            class={css.input}
            onChange={onChangeFiles}
          />
        </div>
        <Switch>
          <Match when={status().error}>
            <div class={css.error}>
              <Text message="Something went wrong" />
              <Button size="sm" view="second" loading={status().loading} onClick={reload}>
                <Text message="Reload" />
              </Button>
            </div>
          </Match>
          <Match when={status().loading && !receipts()}>
            <Loading />
          </Match>
          <Match when={receipts()}>
            {(items) => (
              <FilesDropArea types={RECEIPT_FILE_TYPES} dropText={<Text message="Drop images" />} onDrop={onUpload}>
                <Show
                  when={items.length}
                  fallback={
                    <div class={css.empty}>
                      <Button
                        type="primary"
                        view="second"
                        icon="add-receipt"
                        loading={uploading() || status().loading}
                        onClick={onChooseFiles}
                      >
                        <Text message="Add Receipt" />
                      </Button>
                      <Text message="or drag and drop" class={css.dropText!} />
                    </div>
                  }
                >
                  <div class={css.previews}>
                    <For each={items}>
                      {(receipt, i) => (
                        <div class={css.previewWrap}>
                          <ReceiptPreview size="lg" data={receipt} onClick={() => setInitialIdx(i())} />
                          <Confirm
                            question={<Text message="Are you sure you want to delete this receipt?" />}
                            confirmText={<Text message="Delete" />}
                            onConfirm={() => onDelete(receipt.id)}
                          >
                            {(args) => (
                              <Button
                                type="danger"
                                view="second"
                                icon="trash"
                                class={css.remove}
                                loading={deletingId() === receipt.id}
                                {...args}
                              />
                            )}
                          </Confirm>
                        </div>
                      )}
                    </For>
                    <Button
                      view="second"
                      icon="add-receipt"
                      loading={uploading()}
                      class={css.squareButton}
                      onClick={onChooseFiles}
                    >
                      <Text message="Add Receipt" />
                    </Button>
                  </div>
                </Show>
              </FilesDropArea>
            )}
          </Match>
        </Switch>
      </Show>

      <Show when={!status().loading && receipts()?.length && typeof initialIdx() !== 'undefined'}>
        <ReceiptsModal
          initialIdx={initialIdx()!}
          deleting={!!deletingId()}
          onClose={() => setInitialIdx()}
          receipts={receipts()!}
          onDelete={onDelete}
        />
      </Show>
    </>
  );
}
