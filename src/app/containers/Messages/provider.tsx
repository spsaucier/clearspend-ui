import { JSXElement, createSignal } from 'solid-js';

import type { MessageProps } from '_common/components/Message';

import { MessageOptions, MessagesContext } from './context';

const REMOVE_DELAY = 6000;

function isSameMessages(a: Readonly<MessageProps>, b: Readonly<MessageProps>): boolean {
  return a.type === b.type && a.title === b.title && a.message === b.message;
}

interface MessagesProviderProps {
  children: JSXElement;
}

export function MessagesProvider(props: Readonly<MessagesProviderProps>) {
  const [messages, setMessages] = createSignal<MessageProps[]>([]);

  const remove = (message: Readonly<MessageProps>) => {
    setMessages((items) => items.filter((item) => !isSameMessages(item, message)));
  };

  const add = (type: MessageProps['type'], options: Readonly<MessageOptions>) => {
    const message: Readonly<MessageProps> = { ...options, type, onClose: () => remove(message) };
    if (!messages().some((item) => isSameMessages(item, message))) {
      setMessages((items) => [...items, message]);
      setTimeout(() => remove(message), REMOVE_DELAY);
    }
  };

  const error = (options: Readonly<MessageOptions>) => add('error', options);
  const success = (options: Readonly<MessageOptions>) => add('success', options);

  return <MessagesContext.Provider value={{ messages, error, success }}>{props.children}</MessagesContext.Provider>;
}
