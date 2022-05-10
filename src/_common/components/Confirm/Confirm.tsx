import type { JSXElement } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';

import { Popover } from '../Popover';
import type { PopoverPosition } from '../Popover';
import { Button, type ButtonProps, type IconProps } from '../Button';

import css from './Confirm.css';

const NO_ICON = null;
const DEFAULT_CONFIRM_ICON: IconProps = { name: 'confirm', pos: 'right' };

export interface FuncProps {
  onClick?: () => void;
}

interface BaseProps {
  question: JSXElement;
  confirmText: JSXElement;
  confirmType?: Required<ButtonProps>['type'];
  confirmView?: Required<ButtonProps>['view'];
  confirmIcon?: Required<ButtonProps>['icon'] | null;
  position?: PopoverPosition;
  class?: string;
  onConfirm: () => void;
}

interface ControlledProps extends BaseProps {
  open: boolean;
  onCancel: () => void;
  children: JSXElement;
}

export interface UncontrolledProps extends BaseProps {
  children: (props: FuncProps) => JSXElement;
}

export type ConfirmProps = ControlledProps | UncontrolledProps;

export function Confirm(props: Readonly<ConfirmProps>) {
  let closePopover: (() => void) | undefined;
  const onCancel = () => ('open' in props ? props.onCancel() : closePopover?.());

  const onConfirm = () => {
    onCancel();
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
            <Button
              type={props.confirmType || 'danger'}
              view={props.confirmView || 'second'}
              icon={props.confirmIcon === NO_ICON ? undefined : props.confirmIcon || DEFAULT_CONFIRM_ICON}
              onClick={onConfirm}
            >
              {props.confirmText}
            </Button>
          </div>
        </>
      }
      class={join(css.root, props.class)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...('open' in props ? { open: props.open, onClickOutside: props.onCancel } : ({} as any))}
    >
      {!('open' in props)
        ? (args) => {
            closePopover = args.onClick;
            return props.children(args);
          }
        : (props.children as JSXElement)}
    </Popover>
  );
}
