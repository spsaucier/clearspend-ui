import { formatAmount } from '_common/formatters/amount';

import type { InputProps } from '../Input';
import { Input } from '../Input/Input';

export function InputCurrency(props: Readonly<InputProps>) {
  return (
    <Input
      {...props}
      formatter={formatAmount}
      parser={(t) => t.replace(/,/g, '')}
      prefix={<span>$</span>}
      inputMode="numeric"
    />
  );
}
