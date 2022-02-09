import { Text } from 'solid-i18n';

import { getQboIntegrationLink } from 'onboarding/services/integrations';
import { Button } from '_common/components/Button';

export function Integrations() {
  return (
    <div>
      <Button
        type="primary"
        size="md"
        icon="add"
        onClick={async () => {
          const result = await getQboIntegrationLink();
          if (result.data) {
            window.open(result.data as string);
          }
        }}
      >
        <Text message="Connect QBO" />
      </Button>
    </div>
  );
}
