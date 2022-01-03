import { i18n } from '_common/api/intl';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount, MerchantCategoryChartData } from 'generated/capital';

import css from './MerchantCategory.css';

const NAMES: Partial<
  Record<NonNullable<MerchantCategoryChartData['merchantType']>, string | HTMLElement | (string | HTMLElement)[]>
> = {
  UTILITIES: i18n.t('Utilities'),
  GROCERY_STORES_SUPERMARKETS: i18n.t('Groceries'),
  EATING_PLACES_RESTAURANTS: i18n.t('Restaurants'),
  UNKNOWN: i18n.t('Others'),
};

interface MerchantCategoryProps {
  color: string;
  type: MerchantCategoryChartData['merchantType'];
  amount: Readonly<Amount>;
}

export function MerchantCategory(props: Readonly<MerchantCategoryProps>) {
  return (
    <li class={css.root}>
      <span class={css.dot} style={{ background: props.color }} />
      <span>{NAMES[props.type!] || '--'}</span>
      <span class={css.amount}>{formatCurrency(props.amount.amount)}</span>
    </li>
  );
}
