import { join } from '_common/utils/join';

import type { Direction } from './types';

import css from './Sorter.css';

interface SorterProps {
  value: Direction | undefined;
  class?: string;
}

export function Sorter(props: Readonly<SorterProps>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class={join(css.root, props.class)}>
      <path
        fill="currentColor"
        classList={{ [css.active!]: props.value === 'ASC' }}
        d="M12 5.8c-.3 0-.5.1-.7.4L7.8 9.4c-.2.2-.3.5-.3.7 0 .6.4 1 .9 1 .2 0 .4-.1.6-.3L12 8l3 2.8c.2.2.4.3.6.3.4 0 .9-.4.9-1 0-.3-.1-.6-.3-.7l-3.5-3.3a.9.9 0 0 0-.7-.3z"
      />
      <path
        fill="currentColor"
        classList={{ [css.active!]: props.value === 'DESC' }}
        d="M12 18.2c.3 0 .5-.1.7-.4l3.5-3.3c.2-.2.3-.5.3-.7 0-.6-.4-1-.9-1-.2 0-.4.1-.6.3L12 16l-3-2.8c-.2-.2-.4-.3-.6-.3-.4 0-.9.4-.9 1 0 .3.1.6.3.7l3.5 3.3c.2.2.4.3.7.3z"
      />
    </svg>
  );
}
