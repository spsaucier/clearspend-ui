import type { JSX } from 'solid-js';

interface FormProps extends JSX.FormHTMLAttributes<HTMLFormElement> {
  class?: string;
  children: JSX.Element;
  onSubmit?: () => void;
}

export function Form(props: Readonly<FormProps>) {
  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    props.onSubmit?.();
  };

  return (
    <form onSubmit={onSubmit} {...props}>
      {props.children}
    </form>
  );
}
