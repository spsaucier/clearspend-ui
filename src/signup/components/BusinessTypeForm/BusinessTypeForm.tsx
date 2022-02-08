import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { Radio, RadioGroup } from '_common/components/Radio';
import { BusinessType } from 'app/types/businesses';

import { Header } from '../Header';
import { Description } from '../Description';

interface BusinessTypeFormValues {
  businessType: BusinessType;
}

interface BusinessTypeFormProps {
  onNext: (businessType: BusinessType) => void;
  onBack: () => void;
}

export function BusinessTypeForm(props: Readonly<BusinessTypeFormProps>) {
  const { values, errors, handlers, wrapSubmit } = createForm<BusinessTypeFormValues>({
    defaultValues: { businessType: BusinessType.UNKNOWN },
    rules: { businessType: [required] },
  });

  const onSubmit = (data: Readonly<BusinessTypeFormValues>) => props.onNext(data.businessType);

  return (
    <div>
      <Header>What is the business structure?</Header>
      <Description>Please select the business structure of your business.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="" error={errors().businessType}>
          <RadioGroup
            name="business-structure"
            value={values().businessType}
            onChange={(value: string) => handlers.businessType(value as BusinessType)}
          >
            <Radio value={BusinessType.SOLE_PROPRIETORSHIP}>Sole proprietorship</Radio>
            <Radio value={BusinessType.SINGLE_MEMBER_LLC}>Single-member LLC</Radio>
            <Radio value={BusinessType.MULTI_MEMBER_LLC}>Multi-member LLC</Radio>
            <Radio value={BusinessType.PRIVATE_PARTNERSHIP}>Private partnership</Radio>
            <Radio value={BusinessType.PUBLIC_PARTNERSHIP}>Public partnership</Radio>
            <Radio value={BusinessType.PRIVATE_CORPORATION}>Private corporation</Radio>
            <Radio value={BusinessType.PUBLIC_CORPORATION}>Public corporation</Radio>
            <Radio value={BusinessType.OTHER}>Other/I’m not sure</Radio>
          </RadioGroup>
        </FormItem>
        <Button wide type="primary" htmlType="submit" disabled={values().businessType === BusinessType.UNKNOWN}>
          Next
        </Button>
        <Button wide type="default" view="ghost" onClick={() => props.onBack()}>
          Go Back
        </Button>
      </Form>
    </div>
  );
}
