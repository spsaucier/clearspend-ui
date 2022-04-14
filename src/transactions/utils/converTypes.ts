import type {
  LedgerActivityResponse,
  AccountActivityResponse,
  LedgerCardAccount,
  LedgerMerchantAccount,
} from 'generated/capital';

export function ledgerToActivity(data: LedgerActivityResponse): AccountActivityResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, hold, sourceAccount, targetAccount, ...rest } = data;
  const cardInfo = sourceAccount?.type === 'CARD' ? (sourceAccount as LedgerCardAccount).cardInfo : undefined;

  return {
    ...rest,
    accountName: cardInfo?.allocationName || '',
    card: cardInfo,
    merchant: targetAccount?.type === 'MERCHANT' ? (targetAccount as LedgerMerchantAccount).merchantInfo : undefined,
  };
}

export function activityToLedger(
  data: AccountActivityResponse,
  original?: LedgerActivityResponse,
): LedgerActivityResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accountName, card, merchant, ...rest } = data;
  return {
    ...rest,
    user: original?.user,
    hold: original?.hold,
    sourceAccount: card && { type: 'CARD', cardInfo: card },
    targetAccount: merchant && { type: 'MERCHANT', merchantInfo: merchant },
  };
}
