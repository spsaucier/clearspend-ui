import { createContext } from 'solid-js';

interface IDropdownContext {
  onItemClick?: () => void;
}

export const DropdownContext = createContext<Readonly<IDropdownContext>>({});
