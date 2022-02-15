import { createSignal, Show } from 'solid-js';

import { IntegrateApp } from 'accounting/pages/IntegrateApp';
import { IntegrationOptions } from 'accounting/components/IntegrationOptions';
import type { IntegrationOptionCardValues } from 'accounting/components/IntegrationOptionCard/types';

export function Integrations() {
  const [integrationApp, setIntegrationApp] = createSignal<IntegrationOptionCardValues | null>(null);

  return (
    <Show when={integrationApp() == null} fallback={<IntegrateApp integrationApp={integrationApp()!} />}>
      <IntegrationOptions setIntegrationApp={setIntegrationApp} />
    </Show>
  );
}
