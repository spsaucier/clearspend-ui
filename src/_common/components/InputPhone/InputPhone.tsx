import { createMemo } from 'solid-js';

import { cleanPhone, formatPhone } from '_common/formatters/phone';

import { Input, type InputProps } from '../Input';

const PHONE_LENGTH_WITHOUT_COUNTRY = 10;
const DIGITS_OF_PREFIX = 2;

export interface InputPhoneProps
  extends Omit<InputProps, 'prefix' | 'type' | 'maxLength' | 'formatter' | 'parser' | 'onChange'> {
  onChange: (value: string) => void;
}

export function InputPhone(props: Readonly<InputPhoneProps>) {
  const onChange = (val: string) => props.onChange(val.length > DIGITS_OF_PREFIX ? val : '');

  const phone = createMemo(() => {
    let prefix = '1'; // USA
    let value = props.value || '';

    if (value.toString().length > PHONE_LENGTH_WITHOUT_COUNTRY) {
      prefix = value.slice(1, DIGITS_OF_PREFIX);
      value = value.slice(DIGITS_OF_PREFIX);
    }

    return { prefix, value };
  });

  return (
    <>
      <input name="phone-prefix" type="hidden" value={phone().prefix} />
      <Input
        {...props}
        value={phone().value}
        prefix={<span>+{phone().prefix}</span>}
        type="tel"
        maxLength={10}
        formatter={formatPhone}
        parser={(val) => cleanPhone(phone().prefix + val)}
        onChange={onChange}
      />
    </>
  );
}
