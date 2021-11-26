import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation } from '../../services';
import { useAllocations } from '../../stores/allocations';
import type { CreateAllocation } from '../../types';

export default function AllocationEdit() {
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const allocations = useAllocations({ initValue: [] });

  const onSave = async (allocation: CreateAllocation) => {
    await saveAllocation(allocation);
    messages.success({ title: 'Changes successfully saved.' });
    navigate(location.state?.prev || '/allocations');
  };

  return (
    <Page title="New Allocation">
      {/* TODO !type */}
      <EditAllocationForm allocations={allocations.data!} onSave={onSave} />
    </Page>
  );
}
