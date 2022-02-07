import { clipboard } from '_common/api/clipboard';
import { join } from '_common/utils/join';
import { Button } from '_common/components/Button';

import css from './CopyButton.css';

interface CopyButtonProps {
  value: string | (() => string);
  class?: string;
}

export function CopyButton(props: Readonly<CopyButtonProps>) {
  const onClick = () => clipboard.copy(typeof props.value === 'string' ? props.value : props.value());

  return <Button size="sm" view="ghost" icon="copy" class={join(css.root, props.class)} onClick={onClick} />;
}
