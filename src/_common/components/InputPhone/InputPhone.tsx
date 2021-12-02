import { formatPhone } from '_common/formatters/phone';

import type { InputProps } from '../Input';
import { Input } from '../Input/Input';

export function InputPhone(props: Readonly<InputProps>) {
  return <Input {...props} type="tel" formatter={formatPhone} />;
}
