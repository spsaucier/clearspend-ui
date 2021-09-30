import { createSignal } from 'solid-js';

import { Icon } from '_common/components/Icon';
import { Popover } from '_common/components/Popover';
import { Tooltip } from '_common/components/Tooltip';
import { Button } from '_common/components/Button';

import { Test } from './Test';

export default function TestPage() {
  const [open, setOpen] = createSignal(false);
  const onClick = () => setOpen((prev) => !prev);

  const [open1, setOpen1] = createSignal(false);
  const onClick1 = () => setOpen1((prev) => !prev);

  return (
    <div>
      <div>
        <Icon name="confirm" />
        <Icon name="confirm" size="sm" />
        <Icon name="confirm" size="xs" />
      </div>
      <div>
        <Popover content={<div>Some content...</div>}>
          {(triggerProps) => <Button {...triggerProps}>Button</Button>}
        </Popover>
        <Popover trigger="hover" balloon content={<div>Hover...</div>}>
          {(triggerProps) => <Button {...triggerProps}>Hover</Button>}
        </Popover>
        <Popover open={open()} balloon content={<div>Other...</div>} onClickOutside={onClick}>
          <Button onClick={onClick}>Controlled</Button>
        </Popover>
      </div>
      <div>
        <Popover content={<div>Some content...</div>}>
          {(triggerProps) => <Button {...triggerProps}>Button</Button>}
        </Popover>
        <Popover position="top-center" trigger="hover" content={<div>Hover...</div>}>
          {(triggerProps) => <Button {...triggerProps}>Hover</Button>}
        </Popover>
        <Popover open={open1()} content={<div>Other...</div>} onClickOutside={onClick1}>
          <Button onClick={onClick1}>Controlled</Button>
        </Popover>
      </div>
      <br />
      <br />
      <div style={{ margin: '0 100px' }}>
        <Tooltip message="Tooltip message">{(triggerProps) => <Button {...triggerProps}>Button</Button>}</Tooltip>
      </div>
      <br />
      <br />
      <Test />
    </div>
  );
}
