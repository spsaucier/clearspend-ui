import { Button, ButtonProps, IconProps } from '_common/components/Button/Button';

import css from './FlatButton.css';

export function FlatButton(props: Readonly<ButtonProps & { hideIcon?: boolean }>) {
  const icon = props.hideIcon ? {} : { icon: { name: 'arrow-right', pos: 'right' } };
  return (
    <Button {...props} {...(icon as IconProps)} class={css.root} size="lg">
      {props.children}
    </Button>
  );
}
