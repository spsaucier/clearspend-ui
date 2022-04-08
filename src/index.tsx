import './index.css';

import { render } from 'solid-js/web';

import { IntlPolyfills } from 'app/containers/IntlPolyfills';
import { Providers } from 'app/containers/providers';
import { App } from 'app';

render(
  () => (
    <Providers>
      <IntlPolyfills>
        <App />
      </IntlPolyfills>
    </Providers>
  ),
  document.getElementById('root')!,
);
