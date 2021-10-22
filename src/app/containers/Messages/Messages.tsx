import { For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import { Message } from '_common/components/Message';
import { join } from '_common/utils/join';

import { useMessages } from './context';

import css from './Messages.css';

const ENTER_KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: 'translate3d(100px, 0, 0)' },
  { opacity: 1, transform: 'translate3d(0, 0, 0)' },
];

const EXIT_KEYFRAMES = [...ENTER_KEYFRAMES].reverse();

interface MessagesProps {
  class?: string;
}

export function Messages(props: Readonly<MessagesProps>) {
  const context = useMessages();

  const onAnimate = (keyframes: Keyframe[]) => {
    return (el: Element, done: () => void) => {
      const a = el.animate(keyframes, { easing: 'ease-in-out', duration: 150 });
      a.finished.then(done);
    };
  };

  return (
    <div class={join(css.root, props.class)}>
      <TransitionGroup onEnter={onAnimate(ENTER_KEYFRAMES)} onExit={onAnimate(EXIT_KEYFRAMES)}>
        <For each={context.messages()}>
          {(message) => (
            <Message
              type={message.type}
              title={message.title}
              message={message.message}
              class={css.message}
              onClose={message.onClose}
            />
          )}
        </For>
      </TransitionGroup>
    </div>
  );
}
