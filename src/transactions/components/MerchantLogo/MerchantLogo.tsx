import { join } from '_common/utils/join';
import type { Merchant } from 'generated/capital';

import css from './MerchantLogo.css';

const URL = 'https://ui-avatars.com/api/?background=047857&color=fff&name=';

interface MerchantLogoProps {
  size?: 'sm' | 'md' | 'lg';
  data: Readonly<Merchant>;
  class?: string;
}

export function MerchantLogo(props: Readonly<MerchantLogoProps>) {
  return (
    <img
      src={props.data!.merchantLogoUrl || URL + encodeURIComponent(props.data!.name || '')}
      alt="Merchant logo"
      class={join(css.root, props.class)}
      classList={{
        [css.sm!]: props.size === 'sm',
        [css.lg!]: props.size === 'lg',
      }}
    />
  );
}
