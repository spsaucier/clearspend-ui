import { formatCurrency } from '_common/api/intl/formatCurrency';
import { MerchantLogo } from 'transactions/components/MerchantLogo';
import type { Amount, Merchant as MerchantType } from 'generated/capital';

import css from './Merchant.css';

interface MerchantProps {
  icon?: string;
  merchant: Readonly<MerchantType>;
  amount: Readonly<Amount>;
}

export function Merchant(props: Readonly<MerchantProps>) {
  return (
    <li class={css.root}>
      <MerchantLogo data={props.merchant} />
      <span class={css.name}>{props.merchant.name}</span>
      <span class={css.amount}>{formatCurrency(props.amount.amount)}</span>
    </li>
  );
}
