import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { Page } from 'app/components/Page';
import { useMessages } from 'app/containers/Messages/context';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';
import { saveUser } from '../../services';
import type { FormValues } from '../../components/EditEmployeeForm/types';

export default function EmployeeEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const onSave = async (data: FormValues) => {
    const { firstName, lastName, email, phone, ...address } = data;
    await saveUser({ firstName, lastName, email, phone, address: { ...address, country: 'USA' } });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    navigate(location.state?.prev || '/employees');
  };

  return (
    <Page title={<Text message="New Employee" />}>
      <EditEmployeeForm onSave={onSave} />
    </Page>
  );
}
