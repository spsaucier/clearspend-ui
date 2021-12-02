import type { JSXElement } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';

import { Popover } from '../Popover';
import type { PopoverPosition } from '../Popover';
import { Button } from '../Button';

import css from './Confirm.css';

export interface FuncProps {
  onClick?: () => void;
}

export interface ConfirmProps {
  question: JSXElement;
  confirmText: JSXElement;
  position?: PopoverPosition;
  class?: string;
  onConfirm: () => void;
  children: (props: FuncProps) => JSXElement;
}

export function Confirm(props: Readonly<ConfirmProps>) {
  let onCancel: (() => void) | undefined;

  const onConfirm = () => {
    onCancel?.();
    props.onConfirm();
  };

  return (
    <Popover
      balloon
      trigger="click"
      position={props.position}
      content={
        <>
          {props.question}
          <div class={css.footer}>
            <Button view="ghost" onClick={onCancel}>
              <Text message="Cancel" />
            </Button>
            <Button type="danger" view="second" icon={{ name: 'confirm', pos: 'right' }} onClick={onConfirm}>
              {props.confirmText}
            </Button>
          </div>
        </>
      }
      class={join(css.root, props.class)}
    >
      {(args) => {
        onCancel = args.onClick;
        return props.children(args);
      }}
    </Popover>
  );
}
