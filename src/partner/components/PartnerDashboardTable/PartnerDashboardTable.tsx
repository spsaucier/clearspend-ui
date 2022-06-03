import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { Empty } from 'app/components/Empty';
import type { PartnerBusiness } from 'generated/capital';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Table, TableColumn } from '_common/components/Table';
import { BusinessStatus, OnboardingStep } from 'app/types/businesses';

interface PartnerDashboardTableProps {
  data: readonly Readonly<PartnerBusiness>[];
}

export function PartnerDashboardTable(props: Readonly<PartnerDashboardTableProps>) {
  const COLUMNS: readonly TableColumn<PartnerBusiness>[] = [
    {
      name: 'name',
      render: (item) => item.legalName || item.businessName || '',
    },
    {
      name: 'status',
      render: (item) => calculateClientStatus(item),
    },
    {
      name: 'balance',
      render: (item) => formatCurrency(item.ledgerBalance?.amount!),
    },
  ];

  const calculateClientStatus = (client: PartnerBusiness) => {
    var result = 'Inactive';
    if (client.onboardingStep === OnboardingStep.COMPLETE && client.status === BusinessStatus.ACTIVE) {
      result = 'Active';
    } else if (client.status === BusinessStatus.ONBOARDING) {
      result = 'Onboarding Incomplete';
    }
    return result;
  };

  return (
    <Show when={props.data.length} fallback={<Empty message={<Text message="There are no client accounts" />} />}>
      <Table columns={COLUMNS} data={props.data!} darkMode={true} />
    </Show>
  );
}
