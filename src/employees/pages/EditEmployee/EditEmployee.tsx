import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { saveUser } from '../../services';

export default function EditEmployee() {
  const messages = useMessages();
  const navigate = useNavigate();
  // const params = useParams<{ id?: string }>();

  const onSave = async (firstName: string, lastName: string, email: string) => {
    await saveUser({ firstName, lastName, email });
    messages.success({ title: 'Changes successfully saved.' });
    navigate('/employees');
  };

  return (
    <Page title="New Employee">
      <Section title="Employee Info">
        <EditEmployeeForm onSave={onSave} />
      </Section>
    </Page>
  );
}
