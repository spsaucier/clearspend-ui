import { Button, ButtonProps } from '_common/components/Button/Button';

import css from './FlatButton.css';

export function FlatButton(props: Readonly<ButtonProps>) {
  return (
    <Button {...props} class={css.root} size="lg" icon={{ name: 'arrow-right', pos: 'right' }}>
      {props.children}
    </Button>
  );
}
