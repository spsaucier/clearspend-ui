import { createContext, splitProps, type JSX } from 'solid-js';

import { getTopLeftCoordinatesForElement } from './utils';

interface FormProps extends JSX.FormHTMLAttributes<HTMLFormElement> {
  class?: string;
  children: JSX.Element;
  onSubmit?: () => void;
}

export function Form(props: Readonly<FormProps>) {
  const [local, others] = splitProps(props, ['children', 'onSubmit']);

  const errorRefYPositions = new Map<string, HTMLDivElement>();

  const addErrorRefYPosition = (key: string, element: HTMLDivElement) => {
    errorRefYPositions.set(key, element);
  };

  const removeErrorRefYPosition = (key: string) => {
    errorRefYPositions.delete(key);
  };
  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    local.onSubmit?.();
    scrollToErrors();
  };

  const scrollToErrors = () => {
    const errorRefYPositionValues = Array.from(errorRefYPositions.values());
    if (errorRefYPositionValues.length > 0) {
      window.scrollTo({
        left: 0,
        top: Math.min(...errorRefYPositionValues.map((v) => getTopLeftCoordinatesForElement(v).top)),
        behavior: 'smooth',
      });
    }
  };

  return (
    <FormContext.Provider value={{ addErrorRefYPosition, removeErrorRefYPosition, scrollToErrors }}>
      <form {...others} onSubmit={onSubmit}>
        {local.children}
      </form>
    </FormContext.Provider>
  );
}

interface FormContextProps {
  addErrorRefYPosition?: (key: string, element: HTMLDivElement) => void;
  removeErrorRefYPosition?: (key: string) => void;
  scrollToErrors?: () => void;
}
export const FormContext = createContext<FormContextProps>({});
