import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation } from '../../services';
import { useAllocations } from '../../stores/allocations';
import type { CreateAllocation } from '../../types';

export default function EditAllocation() {
  const messages = useMessages();
  const navigate = useNavigate();

  const allocations = useAllocations({ initValue: [] });

  const onSave = async (allocation: CreateAllocation) => {
    await saveAllocation(allocation);
    messages.success({ title: 'Changes successfully saved.' });
    navigate('/'); // '/allocations'
  };

  return (
    <Page title="New Allocation">
      {/* TODO !type */}
      <EditAllocationForm allocations={allocations.data!} onSave={onSave} />
    </Page>
  );
}
