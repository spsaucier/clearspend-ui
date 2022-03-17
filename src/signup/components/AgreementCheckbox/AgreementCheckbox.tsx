import { Text } from 'solid-i18n';

import { Checkbox } from '_common/components/Checkbox';
import { Link } from '_common/components/Link';

interface AgreementCheckboxProps {
  value: boolean;
  onChange?: (checked: boolean) => void;
}

export function AgreementCheckbox(props: Readonly<AgreementCheckboxProps>) {
  return (
    <Checkbox darkMode checked={props.value} onChange={props.onChange}>
      <Text
        message={
          'I am at least 18 years old and agree to ClearSpend’s ' +
          '<linkTS>Terms of Service</linkTS> and <linkPP>Privacy Policy</linkPP>.'
        }
        linkTS={(text) => (
          <Link darkMode href="https://www.clearspend.com/terms">
            {text}
          </Link>
        )}
        linkPP={(text) => (
          <Link darkMode href="https://www.clearspend.com/privacy">
            {text}
          </Link>
        )}
      />
    </Checkbox>
  );
}
