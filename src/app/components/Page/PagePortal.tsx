import { useContext, JSXElement } from 'solid-js';
import { Portal } from 'solid-js/web';

import { PageContext } from './context';

interface FooterPortalProps {
  children: JSXElement;
}

export function PagePortal(props: Readonly<FooterPortalProps>) {
  const context = useContext(PageContext);
  if (!context.current) throw new Error('PageContext');

  return <Portal mount={context.current}>{props.children}</Portal>;
}
