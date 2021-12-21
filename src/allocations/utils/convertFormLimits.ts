/* eslint-disable
  no-param-reassign,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-assignment
*/

import { keys } from '_common/utils/keys';
import { isEqual } from '_common/components/Form';
import { parseAmount, formatAmount } from '_common/formatters/amount';
import type { MccGroup, CurrencyLimit, LimitTypeMap, AllocationDetailsResponse } from 'generated/capital';

import { DEFAULT_LIMITS, PAYMENT_TYPES } from '../constants/limits';
import type { Limits, FormLimits, ControlsData } from '../types';

export function getDefaultLimits() {
  return { ...DEFAULT_LIMITS };
}

export function getCategories(data: Readonly<ControlsData>, categories: readonly Readonly<MccGroup>[]) {
  return categories.map((item) => item.mccGroupId).filter((id) => !data.disabledMccGroups!.includes(id!)) as string[];
}

export function getChannels(data: Readonly<ControlsData>) {
  return PAYMENT_TYPES.map((item) => item.key).filter((id) => !data.disabledTransactionChannels!.includes(id as any));
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

export function getPurchasesLimits(data: Readonly<ControlsData>) {
  return formatLimits((data.limits![0]!.typeMap as any).PURCHASE || {});
}

export function getATMLimits(data: Readonly<ControlsData>) {
  return formatLimits((data.limits![0]!.typeMap as any).ATM_WITHDRAW || {});
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
): Readonly<ControlsData> {
  return {
    limits: [
      {
        currency: 'USD',
        typeMap: {
          PURCHASE: prepareLimits(data.purchasesLimits),
          ATM_WITHDRAW: prepareLimits(data.atmLimits),
        } as LimitTypeMap,
      },
    ] as CurrencyLimit[],
    disabledMccGroups: categories
      .map((item) => item.mccGroupId)
      .filter((id) => !data.categories.includes(id!)) as string[],
    disabledTransactionChannels: PAYMENT_TYPES.map((item) => item.key).filter(
      (id) => !data.channels.includes(id),
    ) as ControlsData['disabledTransactionChannels'],
  };
}

export function checkSameLimits(
  data: Readonly<FormLimits>,
  target: Required<AllocationDetailsResponse> | null,
  categories: readonly Readonly<MccGroup>[],
): boolean {
  if (!target) return true;

  return isEqual(
    {
      categories: getCategories(target, categories),
      channels: getChannels(target),
      purchasesLimits: getPurchasesLimits(target),
      atmLimits: getATMLimits(target),
    },
    {
      categories: data.categories,
      channels: data.channels,
      purchasesLimits: data.purchasesLimits,
      atmLimits: data.atmLimits,
    },
  );
}
