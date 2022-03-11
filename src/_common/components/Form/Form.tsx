import { splitProps, type JSX } from 'solid-js';

interface FormProps extends JSX.FormHTMLAttributes<HTMLFormElement> {
  class?: string;
  children: JSX.Element;
  onSubmit?: () => void;
}

export function Form(props: Readonly<FormProps>) {
  const [local, others] = splitProps(props, ['children', 'onSubmit']);

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    local.onSubmit?.();
  };

  return (
    <form {...others} onSubmit={onSubmit}>
      {local.children}
    </form>
  );
}
