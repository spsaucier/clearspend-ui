import { batch, createSignal } from 'solid-js';

import type { AccountActivityResponse } from 'generated/capital';

import type { ReceiptData } from '../types';

export function usePreviewReceipts(onUpdateTransaction: (data: Readonly<AccountActivityResponse>) => void) {
  const [currentId, setCurrentId] = createSignal<string>();
  const [receipts, setReceipts] = createSignal<readonly Readonly<ReceiptData>[]>([]);

  const onSelect = (id: string): void => {
    setCurrentId(id);
  };

  const onView = (items: readonly Readonly<ReceiptData>[], id: string) => {
    batch(() => {
      setCurrentId(id);
      setReceipts(items);
    });
  };

  const onUpdate = (items: readonly Readonly<ReceiptData>[], transaction: Readonly<AccountActivityResponse>) => {
    batch(() => {
      setReceipts(items);
      onUpdateTransaction(transaction);
    });
  };

  const onClose = () => {
    batch(() => {
      setCurrentId(undefined);
      setReceipts([]);
    });
  };

  return [onView, { currentId, receipts, onSelect, onUpdate, onClose }] as const;
}
