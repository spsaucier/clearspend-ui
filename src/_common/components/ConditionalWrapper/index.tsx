import type { JSX } from 'solid-js';

type ConditionalWrapperProps = {
  children: JSX.Element;
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
};

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
  condition ? wrapper(children) : children;
