import { createMemo } from 'solid-js';

import { join } from '_common/utils/join';

import { parsePhone, preparePhone, formatPhone } from '../../formatters/phone';
import { Input, type InputProps } from '../Input';

const DEFAULT_COUNTRY_CODE = '1';
const PHONE_LENGTH_WITHOUT_COUNTRY = 10;

export interface InputPhoneProps
  extends Omit<InputProps, 'prefix' | 'type' | 'maxLength' | 'formatter' | 'parser' | 'onChange'> {
  onChange: (value: string) => void;
}

export function InputPhone(props: Readonly<InputPhoneProps>) {
  const onChange = (value: string) => props.onChange(value);
  const phone = createMemo(() => parsePhone(props.value || `+${DEFAULT_COUNTRY_CODE}`));

  return (
    <>
      <input name="phone-prefix" type="hidden" value={phone().code} />
      <Input
        {...props}
        class={join(props.class, 'fs-mask')}
        value={phone().value}
        prefix={<span>+{phone().code}</span>}
        type="tel"
        maxLength={PHONE_LENGTH_WITHOUT_COUNTRY}
        formatter={formatPhone}
        parser={(value) => preparePhone(phone().code + value)}
        onChange={onChange}
      />
    </>
  );
}
