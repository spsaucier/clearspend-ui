import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { saveUser } from '../../services';

export default function EmployeeEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const onSave = async (firstName: string, lastName: string, email: string) => {
    await saveUser({ firstName, lastName, email });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    navigate(location.state?.prev || '/employees');
  };

  return (
    <Page title={<Text message="New Employee" />}>
      <Section title={<Text message="Employee Info" />}>
        <EditEmployeeForm onSave={onSave} />
      </Section>
    </Page>
  );
}
