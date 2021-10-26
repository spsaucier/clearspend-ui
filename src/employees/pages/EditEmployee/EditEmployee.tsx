// import { useParams } from 'solid-app-router';

import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { wait } from '_common/utils/wait';

import { EditEmployeeForm } from '../../components/EditEmployeeForm';

export default function EditEmployee() {
  // const params = useParams<{ id?: string }>();

  const onSave = async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    await wait(3000);
  };

  return (
    <Page title="New Employee">
      <Section title="Employee Info">
        <EditEmployeeForm onSave={onSave} />
      </Section>
    </Page>
  );
}
