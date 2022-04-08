import type { JSXElement } from 'solid-js';
import { Router } from 'solid-app-router';
import { I18nProvider } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { MediaProvider } from '_common/api/media/provider';
import { MessagesProvider } from 'app/containers/Messages/provider';

interface ProvidersProps {
  children: JSXElement;
}

export function Providers(props: Readonly<ProvidersProps>) {
  return (
    <MediaProvider>
      <Router>
        <I18nProvider i18n={i18n}>
          <MessagesProvider>{props.children}</MessagesProvider>
        </I18nProvider>
      </Router>
    </MediaProvider>
  );
}
