import { usePartnerClients } from 'partner/stores/partnerPortal';
import { Data } from 'app/components/Data';

import { PartnerDashboardTable } from '../PartnerDashboardTable';

export function PartnerDashboardData() {
  const clientStore = usePartnerClients();

  return (
    <Data
      data={clientStore.data}
      loading={clientStore.loading}
      error={clientStore.error}
      onReload={async () => Promise.all([clientStore.error && clientStore.reload])}
    >
      <PartnerDashboardTable data={clientStore.data || []} />
    </Data>
  );
}
