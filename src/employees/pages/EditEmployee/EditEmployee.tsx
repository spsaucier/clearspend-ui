import { useI18n, Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { saveUser } from '../../services';

export default function EditEmployee() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const onSave = async (firstName: string, lastName: string, email: string) => {
    await saveUser({ firstName, lastName, email });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    navigate('/'); // '/employees'
  };

  return (
    <Page title={<Text message="New Employee" />}>
      <Section title={<Text message="Employee Info" />}>
        <EditEmployeeForm onSave={onSave} />
      </Section>
    </Page>
  );
}
