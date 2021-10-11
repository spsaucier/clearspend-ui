import './index.css';

import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';

import { MediaProvider } from '_common/api/media/provider';
import { App } from 'app';

render(
  () => (
    <MediaProvider>
      <Router>
        <App />
      </Router>
    </MediaProvider>
  ),
  document.getElementById('root')!,
);
