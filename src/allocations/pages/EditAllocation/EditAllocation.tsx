import { createResource, createMemo } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { getAllocations, saveAllocation } from '../../services';

export default function EditAllocation() {
  const messages = useMessages();
  const navigate = useNavigate();
  const [data] = createResource(getAllocations, { initialValue: [] });

  const onSave = async (name: string, parent: string) => {
    await saveAllocation(name, parent);
    messages.success({ title: 'Changes successfully saved.' });
    navigate('/allocations');
  };

  const allocations = createMemo(() => (!data.error ? data() : []));

  return (
    <Page title="New Allocation">
      <EditAllocationForm allocations={allocations()} onSave={onSave} />
    </Page>
  );
}
