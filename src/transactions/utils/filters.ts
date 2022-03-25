import { parseAmount } from '_common/formatters/amount';
import { dateRangeToISO } from 'app/utils/dateRangeToISO';
import type { DateRange } from 'app/types/common';
import type { FilterAmount } from 'generated/capital';

export interface AmountRange {
  amountMin: string;
  amountMax: string;
}

export function getAmountFilter(amount: Readonly<FilterAmount> | undefined): Readonly<AmountRange> {
  return {
    amountMin: amount?.min?.toString() || '',
    amountMax: amount?.max?.toString() || '',
  };
}

export function toFilterAmount<T extends Readonly<AmountRange>>(
  data: Readonly<T>,
): Readonly<{ amount: Readonly<FilterAmount> }> | false {
  const min = parseAmount(data.amountMin);
  const max = parseAmount(data.amountMax);

  return (
    (!Number.isNaN(min) || !Number.isNaN(max)) && {
      amount: {
        min: !Number.isNaN(min) ? min : undefined,
        max: !Number.isNaN(max) ? max : undefined,
      },
    }
  );
}

export function getDateFilter<T extends Partial<DateRange>>(params: Readonly<T>): ReadonlyDate[] {
  return params.from && params.to ? [new Date(params.from), new Date(params.to)] : [];
}

export function toFilterDate(range: ReadonlyDate[]): Readonly<Partial<DateRange>> {
  return Boolean(range.length) ? dateRangeToISO([range[0]!, range[1]!]) : { from: undefined, to: undefined };
}
