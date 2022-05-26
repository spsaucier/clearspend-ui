import { Icon } from '../Icon';

import css from './LinkTextButton.css';

interface LinkTextButtonProps {
  href: string;

  text: string;
}

export function LinkTextButton(props: Readonly<LinkTextButtonProps>) {
  return (
    <a class={css.linkTextButton} href={props.href} target="_blank">
      {props.text} <Icon name="arrow-square-out" />
    </a>
  );
}
