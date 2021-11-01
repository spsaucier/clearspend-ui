import { createContext, useContext, Accessor } from 'solid-js';

import type { MessageProps } from '_common/components/Message';

export type MessageOptions = Pick<MessageProps, 'title' | 'message'>;

export interface IMessagesContext {
  messages: Accessor<MessageProps[]>;
  error: (options: Readonly<MessageOptions>) => void;
  success: (options: Readonly<MessageOptions>) => void;
}

export const MessagesContext = createContext<Readonly<IMessagesContext>>();

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) throw new ReferenceError('MessagesContext');

  return context;
}
