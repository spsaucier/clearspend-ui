import { createResource, createMemo } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';
import { getAllocations } from 'allocations/services';

import { EditCardForm } from '../../components/EditCardForm';
import { saveCard } from '../../services';
import type { IssueCard } from '../../types';

export default function EditCard() {
  const messages = useMessages();
  const navigate = useNavigate();

  const [data] = createResource(getAllocations, { initialValue: [] });
  const allocations = createMemo(() => (!data.error ? data() : []));

  const onSave = async (params: Readonly<IssueCard>) => {
    await saveCard(params);
    messages.success({ title: 'Changes successfully saved.' });
    navigate('/cards');
  };

  return (
    <Page title="New Card">
      <EditCardForm allocations={allocations()} onSave={onSave} />
    </Page>
  );
}
