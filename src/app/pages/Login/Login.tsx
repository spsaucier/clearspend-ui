import { wait } from '_common/utils/wait';

import { LoginForm } from '../../components/LoginForm';

export default function Login() {
  const submit = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    await wait(2000);
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <div>
      <LoginForm onSubmit={submit} />
    </div>
  );
}
