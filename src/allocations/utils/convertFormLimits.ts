/* eslint-disable
  no-param-reassign,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
*/

import { keys } from '_common/utils/keys';
import { isEqual } from '_common/components/Form';
import { parseAmount, formatAmount } from '_common/formatters/amount';
import type {
  CurrencyLimit,
  LimitTypeMap,
  CardAllocationSpendControls,
  AllocationDetailsResponse,
} from 'generated/capital';
import type { MccGroup } from 'transactions/types';

import { DEFAULT_LIMITS, PAYMENT_TYPES } from '../constants/limits';
import type { Limits, FormLimits } from '../types';

export function getDefaultLimits() {
  return { ...DEFAULT_LIMITS };
}

export function getCategories(
  data: Omit<AllocationDetailsResponse, 'allocation'>,
  categories: readonly Readonly<MccGroup>[],
) {
  return categories.filter((id) => !data.disabledMccGroups!.includes(id!));
}

export function getChannels(data: Omit<AllocationDetailsResponse, 'allocation'>) {
  return PAYMENT_TYPES.map((item) => item.key).filter((id) => !data.disabledPaymentTypes!.includes(id as any));
}

function formatLimits(limits: Readonly<Limits>) {
  return keys(DEFAULT_LIMITS).reduce<Limits>(
    (result, current) => {
      const limit = limits[current];
      if (limit) result[current] = { amount: formatAmount(String(limit.amount)) };
      return result;
    },
    { ...DEFAULT_LIMITS },
  );
}

export function getPurchasesLimits(data: Omit<AllocationDetailsResponse, 'allocation'>) {
  return formatLimits((data.limits![0]!.typeMap as any).PURCHASE || {});
}

function prepareLimits(limits: Readonly<Limits>) {
  return keys(limits).reduce<Record<string, unknown>>((result, current) => {
    const limit = limits[current];
    if (limit) {
      const amount = parseAmount(limit.amount);
      if (!isNaN(amount)) result[current] = { amount };
    }
    return result;
  }, {});
}

export function convertFormLimits(
  data: Readonly<FormLimits>,
  categories: readonly Readonly<MccGroup>[],
  allocationId?: string,
): Readonly<CardAllocationSpendControls> {
  const result = {
    limits: [
      {
        currency: 'USD',
        typeMap: {
          PURCHASE: prepareLimits(data.purchasesLimits),
        } as LimitTypeMap,
      },
    ] as CurrencyLimit[],
    disabledMccGroups: categories.filter((id) => !data.categories.includes(id!)),
    disabledPaymentTypes: PAYMENT_TYPES.map((item) => item.key).filter(
      (id) => !data.channels.includes(id),
    ) as CardAllocationSpendControls['disabledPaymentTypes'],
    disableForeign: !data.international,
  } as CardAllocationSpendControls;
  if (allocationId) result.allocationId = allocationId;
  return result;
}

export function checkSameLimits(
  data: Readonly<FormLimits>,
  target: Omit<AllocationDetailsResponse, 'allocation'> | null,
  categories: readonly Readonly<MccGroup>[],
): boolean {
  if (!target) return true;
  return isEqual(
    {
      categories: data.categories,
      channels: data.channels,
      purchasesLimits: data.purchasesLimits,
      international: data.international,
    },
    {
      categories: getCategories(target, categories),
      channels: getChannels(target),
      purchasesLimits: getPurchasesLimits(target),
      international: !target.disableForeign,
    },
  );
}
