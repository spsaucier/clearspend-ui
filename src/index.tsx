import './index.css';

import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import { I18nProvider } from 'solid-i18n';

import { MediaProvider } from '_common/api/media/provider';
import * as i18n from '_common/api/intl';
import { App } from 'app';

render(
  () => (
    <MediaProvider>
      <Router>
        <I18nProvider {...i18n}>
          <App />
        </I18nProvider>
      </Router>
    </MediaProvider>
  ),
  document.getElementById('root')!,
);
