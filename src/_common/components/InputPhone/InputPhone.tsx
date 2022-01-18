import { cleanPhone, formatPhone } from '_common/formatters/phone';

import type { InputProps } from '../Input';
import { Input } from '../Input/Input';

export function InputPhone(props: Readonly<InputProps>) {
  const defaultPrefix = '1'; // USA
  let prefix = defaultPrefix;
  let value = props.value || '';
  const PHONE_LENGTH_WITHOUT_COUNTRY = 10;
  const DIGITS_OF_PREFIX = 2;
  if (value.toString().length > PHONE_LENGTH_WITHOUT_COUNTRY) {
    prefix = value.toString().slice(1, DIGITS_OF_PREFIX);
    value = value.toString().slice(DIGITS_OF_PREFIX);
  }
  return (
    <>
      <input name="phone-prefix" type="hidden" value={prefix} />
      <Input
        {...props}
        value={formatPhone(value.toString() || '')}
        prefix={<span>+{prefix}</span>}
        type="tel"
        maxLength={10}
        formatter={formatPhone}
        parser={(val) => cleanPhone(prefix + val)}
        onChange={(val, e) => props.onChange?.(val, e)}
      />
    </>
  );
}
