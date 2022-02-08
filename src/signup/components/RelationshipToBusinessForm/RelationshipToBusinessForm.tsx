import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { RelationshipToBusiness } from 'app/types/businesses';
import { CheckboxGroup, Checkbox } from '_common/components/Checkbox';

import { Header } from '../Header';
import { Description } from '../Description';

interface RelationshipToBusinessFormValues {
  relationshipToBusiness: Readonly<RelationshipToBusiness[]>;
}

interface RelationshipToBusinessFormProps {
  onNext: (relationshipToBusiness: Readonly<RelationshipToBusiness[]>) => void;
  onBack: () => void;
}

export function RelationshipToBusinessForm(props: Readonly<RelationshipToBusinessFormProps>) {
  const { values, errors, handlers, wrapSubmit } = createForm<RelationshipToBusinessFormValues>({
    defaultValues: { relationshipToBusiness: [RelationshipToBusiness.REPRESENTATIVE] },
    rules: { relationshipToBusiness: [required] },
  });

  const onSubmit = (data: Readonly<RelationshipToBusinessFormValues>) => props.onNext(data.relationshipToBusiness);

  return (
    <div>
      <Header>What is your role?</Header>
      <Description>Please select the roles that best describe you.zzz</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="" error={errors().relationshipToBusiness}>
          <CheckboxGroup
            name="business-structure"
            value={values().relationshipToBusiness as string[]}
            onChange={(value: string[]) => handlers.relationshipToBusiness(value as Readonly<RelationshipToBusiness[]>)}
          >
            <Checkbox value={RelationshipToBusiness.OWNER}>Owner</Checkbox>
            <Checkbox value={RelationshipToBusiness.EXECUTIVE}>Executive</Checkbox>
            <Checkbox value={RelationshipToBusiness.DIRECTOR}>Director</Checkbox>
            <Checkbox value={RelationshipToBusiness.OTHER}>Other</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <Button wide type="primary" htmlType="submit" disabled={values().relationshipToBusiness.length === 1}>
          Next
        </Button>
        <Button wide type="default" view="ghost" onClick={() => props.onBack()}>
          Go Back
        </Button>
      </Form>
    </div>
  );
}
