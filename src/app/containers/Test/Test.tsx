import { createSignal } from 'solid-js';

import { Button } from '_common/components/Button';

export function Test() {
  const [loading, setLoading] = createSignal(false);

  return (
    <div>
      <Button
        wide
        type="primary"
        loading={loading()}
        onClick={() => {
          setLoading(true);
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          setTimeout(() => setLoading(false), 10000);
        }}
      >
        Verify Now
      </Button>
    </div>
  );
}
