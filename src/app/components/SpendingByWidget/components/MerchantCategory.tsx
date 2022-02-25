import { formatCurrency } from '_common/api/intl/formatCurrency';
import { formatMerchantType } from 'transactions/utils/formatMerchantType';
import type { Amount, MerchantCategoryChartData } from 'generated/capital';

import css from './MerchantCategory.css';

interface MerchantCategoryProps {
  color: string;
  type: MerchantCategoryChartData['merchantType'];
  amount: Readonly<Amount>;
}

export function MerchantCategory(props: Readonly<MerchantCategoryProps>) {
  return (
    <li class={css.root}>
      <span class={css.dot} style={{ background: props.color }} />
      <span class={css.name}>{formatMerchantType(props.type)}</span>
      <span class={css.amount}>{formatCurrency(props.amount.amount)}</span>
    </li>
  );
}
