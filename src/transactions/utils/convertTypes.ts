import type {
  LedgerActivityResponse,
  AccountActivityResponse,
  LedgerCardAccount,
  LedgerMerchantAccount,
  LedgerAccount,
} from 'generated/capital';

export function ledgerToActivity(data: LedgerActivityResponse): AccountActivityResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, hold, sourceAccount, targetAccount, ...rest } = data;
  const cardInfo = sourceAccount?.type === 'CARD' ? (sourceAccount as LedgerCardAccount).cardInfo : undefined;

  return {
    ...rest,
    accountName: cardInfo?.allocationName || '',
    card: cardInfo,
    merchant:
      targetAccount?.type === 'MERCHANT'
        ? (targetAccount as LedgerMerchantAccount).merchantInfo
        : sourceAccount?.type === 'MERCHANT'
        ? (sourceAccount as LedgerMerchantAccount).merchantInfo
        : undefined,
  };
}

export function activityToLedger(
  data: AccountActivityResponse,
  original?: LedgerActivityResponse,
): LedgerActivityResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accountName, card, merchant, ...rest } = data;
  const isRefund = rest.type === 'NETWORK_REFUND';
  const cardAccount = card && { type: 'CARD' as LedgerAccount['type'], cardInfo: card };
  const merchantAccount = merchant && { type: 'MERCHANT' as LedgerAccount['type'], merchantInfo: merchant };

  return {
    ...rest,
    user: original?.user,
    hold: original?.hold,
    sourceAccount: isRefund ? merchantAccount : cardAccount,
    targetAccount: isRefund ? cardAccount : merchantAccount,
  };
}
