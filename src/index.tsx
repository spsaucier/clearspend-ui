import { render } from 'solid-js/web';

import { Test } from 'test/Test';
import { LoginForm } from 'app/components/LoginForm';

async function loginMock(...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(args);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  await new Promise((res) => setTimeout(res, 2000));
}

function App() {
  return (
    <div>
      <LoginForm onSubmit={loginMock} />
      <br />
      <br />
      <Test />
    </div>
  );
}

render(App, document.getElementById('root')!);
