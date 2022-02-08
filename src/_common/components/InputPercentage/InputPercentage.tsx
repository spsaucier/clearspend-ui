import { formatAmount } from '_common/formatters/amount';

import type { InputProps } from '../Input';
import { Input } from '../Input/Input';

export function InputPercentage(props: Readonly<InputProps>) {
  return <Input {...props} formatter={formatAmount} suffix={<span>%</span>} inputMode="numeric" />;
}
