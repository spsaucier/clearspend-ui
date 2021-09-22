import { render } from 'solid-js/web';

import { Button } from '_common/components/Button';

function App() {
  console.log('test');

  return (
    <div>
      <Button onClick={console.log}>Test</Button>
    </div>
  );
}

render(App, document.getElementById('root')!);
