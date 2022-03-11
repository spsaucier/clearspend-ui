import type { JSXElement } from 'solid-js';

interface ExternalLinkProps {
  to: string;
  class?: string;
  children: JSXElement;
}

export function ExternalLink(props: Readonly<ExternalLinkProps>) {
  return (
    <a href={props.to} target="_blank" rel="noopener noreferrer" class={props.class}>
      {props.children}
    </a>
  );
}
