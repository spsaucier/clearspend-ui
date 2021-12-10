import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';
import type { CreateAllocationRequest } from 'generated/capital';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation } from '../../services';
import { useAllocations } from '../../stores/allocations';

export default function AllocationEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const allocations = useAllocations({ initValue: [] });

  const onSave = async (allocation: CreateAllocationRequest) => {
    await saveAllocation(allocation);
    messages.success({ title: i18n.t('Changes successfully saved.') });
    navigate(location.state?.prev || '/allocations');
  };

  return (
    <Page title={<Text message="New Allocation" />}>
      <EditAllocationForm allocations={allocations.data!} onSave={onSave} />
    </Page>
  );
}
