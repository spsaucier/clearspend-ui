import type {
  LedgerActivityResponse,
  AccountActivityResponse,
  LedgerCardAccount,
  LedgerMerchantAccount,
  LedgerAccount,
} from 'generated/capital';

export function ledgerToActivity(data: LedgerActivityResponse): AccountActivityResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, hold, account, referenceAccount, ...rest } = data;
  const cardInfo = account?.type === 'CARD' ? (account as LedgerCardAccount).cardInfo : undefined;

  return {
    ...rest,
    accountName: cardInfo?.allocationName || '',
    card: cardInfo,
    merchant:
      referenceAccount?.type === 'MERCHANT'
        ? (referenceAccount as LedgerMerchantAccount).merchantInfo
        : account?.type === 'MERCHANT'
        ? (account as LedgerMerchantAccount).merchantInfo
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
    account: isRefund ? merchantAccount : cardAccount,
    referenceAccount: isRefund ? cardAccount : merchantAccount,
  };
}
