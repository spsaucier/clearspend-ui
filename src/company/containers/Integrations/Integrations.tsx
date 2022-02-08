import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';

export function Integrations() {
  return (
    <div>
      <Button
        type="primary"
        size="md"
        icon="add"
        onClick={() => {
          // TODO: start integration process here
        }}
      >
        <Text message="Connect QBO" />
      </Button>
    </div>
  );
}
