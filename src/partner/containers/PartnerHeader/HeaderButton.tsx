import { Button, ButtonProps, IconProps } from '_common/components/Button/Button';
import { join } from '_common/utils/join';

import css from './HeaderButton.css';

export function HeaderButton(props: Readonly<ButtonProps & { hideIcon?: boolean; isActive?: boolean }>) {
  const icon = props.hideIcon ? {} : { icon: { name: 'arrow-right', pos: 'right' } };
  return (
    <Button
      {...props}
      {...(icon as IconProps)}
      class={join(css.root, props.isActive && css.active)}
      size={props.size ?? 'lg'}
    >
      {props.children}
    </Button>
  );
}
