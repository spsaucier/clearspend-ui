import { useBusiness } from 'app/containers/Main/context';
import { PartnerDashboardData } from 'partner/components/PartnerDashboardData';

import { PartnerDashboard } from '../../containers/PartnerDashboard';

export default function PartnerDashboardPage() {
  const business = useBusiness();

  return (
    <PartnerDashboard partnerName={business.business().legalName || business.business().businessName || ''}>
      <PartnerDashboardData />
    </PartnerDashboard>
  );
}
