import type { JSX } from 'solid-js';

interface FormProps {
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
    <form class={props.class} onSubmit={onSubmit}>
      {props.children}
    </form>
  );
}
