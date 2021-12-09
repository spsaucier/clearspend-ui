import { cleanPhone, formatPhone } from '_common/formatters/phone';

import type { InputProps } from '../Input';
import { Input } from '../Input/Input';

export function InputPhone(props: Readonly<InputProps>) {
  const defaultPrefix = '1'; // USA
  let prefix = defaultPrefix;
  let value = props.value || '';
  const PHONE_LENGTH_WITHOUT_COUNTRY = 10;
  const DIGITS_OF_PREFIX = 2;
  if (value.length > PHONE_LENGTH_WITHOUT_COUNTRY) {
    prefix = value.slice(1, DIGITS_OF_PREFIX);
    value = value.slice(DIGITS_OF_PREFIX);
  }
  return (
    <>
      <input name="phone-prefix" type="hidden" value={prefix} />
      <Input
        {...props}
        value={formatPhone(value || '')}
        prefix={<span>+{prefix}</span>}
        type="tel"
        maxLength={10}
        formatter={formatPhone}
        onChange={(val, e) => props.onChange?.(cleanPhone(prefix + val), e)}
      />
    </>
  );
}
