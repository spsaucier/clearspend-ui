import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { Radio, RadioGroup } from '_common/components/Radio';
import { BusinessTypeCategory } from 'app/types/businesses';

import { Header } from '../Header';
import { Description } from '../Description';

interface BusinessTypeCategoryFormValues {
  businessTypeCategory: BusinessTypeCategory;
}

interface BusinessTypeCategoryFormProps {
  onNext: (businessTypeCategory: BusinessTypeCategory) => void;
}

export function BusinessTypeCategoryForm(props: Readonly<BusinessTypeCategoryFormProps>) {
  const { values, errors, handlers, wrapSubmit } = createForm<BusinessTypeCategoryFormValues>({
    defaultValues: { businessTypeCategory: BusinessTypeCategory.UNKNOWN },
    rules: { businessTypeCategory: [required] },
  });

  const onSubmit = (data: Readonly<BusinessTypeCategoryFormValues>) => props.onNext(data.businessTypeCategory);

  return (
    <div>
      <Header>What type of business do you have?</Header>
      <Description>Please select the legal entity type of your business.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="" error={errors().businessTypeCategory}>
          <RadioGroup
            name="business-type"
            value={values().businessTypeCategory}
            onChange={(value) => handlers.businessTypeCategory(value as BusinessTypeCategory)}
          >
            <Radio value={BusinessTypeCategory.INDIVIDUAL}>Individual</Radio>
            <Radio value={BusinessTypeCategory.COMPANY}>Company</Radio>
            <Radio value={BusinessTypeCategory.NONPROFIT}>Nonprofit organization</Radio>
          </RadioGroup>
        </FormItem>
        <Button
          wide
          type="primary"
          htmlType="submit"
          disabled={values().businessTypeCategory === BusinessTypeCategory.UNKNOWN}
        >
          Next
        </Button>
      </Form>
    </div>
  );
}
