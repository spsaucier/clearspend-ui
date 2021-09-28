import { createSignal } from 'solid-js';

import { Test } from 'test/Test';
import { LoginForm } from 'app/components/LoginForm';
import { Popover } from '_common/components/Popover';
import { Tooltip } from '_common/components/Tooltip';
import { Button } from '_common/components/Button';

async function loginMock(...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(args);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  await new Promise((res) => setTimeout(res, 2000));
}

export function App() {
  const [open, setOpen] = createSignal(false);
  const onClick = () => setOpen((prev) => !prev);

  const [open1, setOpen1] = createSignal(false);
  const onClick1 = () => setOpen1((prev) => !prev);

  return (
    <div>
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
      <LoginForm onSubmit={loginMock} />
      <br />
      <br />
      <Test />
    </div>
  );
}
