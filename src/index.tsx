import { render } from 'solid-js/web';

import { Button } from '_common/components/Button';

function App() {
  return (
    <div>
      <Button>Test</Button>
    </div>
  );
}

render(App, document.getElementById('root')!);
