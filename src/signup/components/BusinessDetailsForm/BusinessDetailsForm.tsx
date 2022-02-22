import { Show } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Radio, RadioGroup } from '_common/components/Radio';
import { BusinessType, BusinessTypeCategory } from 'app/types/businesses';
import { Select, Option } from '_common/components/Select';
import { Icon } from '_common/components/Icon';

import { Header } from '../Header';
import { Description } from '../Description';
// eslint-disable-next-line css-modules/no-unused-class
import css from '../../SignUp.css';
import { FlatButton } from '../Button/FlatButton';

interface BusinessDetailsFormValues {
  businessTypeCategory: BusinessTypeCategory;
  businessType: BusinessType;
  isOwnerOf25?: boolean;
  isExecutive?: boolean;
}

interface BusinessDetailsFormProps {
  onNext: (
    businessTypeCategory: BusinessTypeCategory,
    businessType: BusinessType,
    isOwnerOf25?: boolean,
    isExecutive?: boolean,
  ) => void;
}

export function BusinessDetailsForm(props: Readonly<BusinessDetailsFormProps>) {
  const { values, errors, handlers, wrapSubmit } = createForm<BusinessDetailsFormValues>({
    defaultValues: {
      businessTypeCategory: BusinessTypeCategory.UNKNOWN,
      businessType: BusinessType.UNKNOWN,
      isExecutive: undefined,
      isOwnerOf25: undefined,
    },
    rules: { businessTypeCategory: [required] },
  });

  const onSubmit = (data: Readonly<BusinessDetailsFormValues>) => {
    props.onNext(data.businessTypeCategory, data.businessType, data.isOwnerOf25, data.isExecutive);
  };

  const disableNext = (v: BusinessDetailsFormValues) => {
    const incompleteRequiredQuestions =
      v.businessTypeCategory === BusinessTypeCategory.COMPANY &&
      (v.isOwnerOf25 === undefined || v.isExecutive === undefined);
    const noBusinessCategorySelected = v.businessTypeCategory === BusinessTypeCategory.UNKNOWN;
    const noBusinessTypeSelected =
      v.businessType === BusinessType.UNKNOWN &&
      v.businessTypeCategory !== BusinessTypeCategory.INDIVIDUAL &&
      v.businessTypeCategory !== BusinessTypeCategory.NONPROFIT;
    return incompleteRequiredQuestions || noBusinessCategorySelected || noBusinessTypeSelected;
  };

  return (
    <div>
      <Header>Next, we need to know about your business</Header>
      <Description>This to ensure we set up your account with the right XYZ features.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem
          label="Please select the legal entity type of your business."
          darkMode={true}
          error={errors().businessTypeCategory}
        >
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
        <Show when={values().businessTypeCategory === BusinessTypeCategory.COMPANY}>
          <FormItem
            label="Please select the business structure of your business."
            error={errors().businessType}
            darkMode={true}
          >
            <Select
              darkMode={true}
              name="business-structure"
              value={values().businessType}
              onChange={(value: string) => handlers.businessType(value as BusinessType)}
            >
              <Option value={BusinessType.SOLE_PROPRIETORSHIP}>Sole proprietorship</Option>
              <Option value={BusinessType.SINGLE_MEMBER_LLC}>Single-member LLC</Option>
              <Option value={BusinessType.MULTI_MEMBER_LLC}>Multi-member LLC</Option>
              <Option value={BusinessType.PRIVATE_PARTNERSHIP}>Private partnership</Option>
              <Option value={BusinessType.PUBLIC_PARTNERSHIP}>Public partnership</Option>
              <Option value={BusinessType.PRIVATE_CORPORATION}>Private corporation</Option>
              <Option value={BusinessType.PUBLIC_CORPORATION}>Public corporation</Option>
              <Option value={BusinessType.OTHER}>Other/I’m not sure</Option>
            </Select>
          </FormItem>
        </Show>
        <Show
          when={
            values().businessTypeCategory === BusinessTypeCategory.COMPANY &&
            values().businessType !== BusinessType.UNKNOWN
          }
        >
          <FormItem
            label="Are you owner with at least 25% ownership?"
            error={errors().businessTypeCategory}
            darkMode={true}
          >
            <RadioGroup
              name="is-owner"
              value={values().isOwnerOf25}
              onChange={(value) => handlers.isOwnerOf25?.(value as boolean)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </RadioGroup>
          </FormItem>
        </Show>
        <Show
          when={
            values().businessTypeCategory === BusinessTypeCategory.COMPANY &&
            values().businessType !== BusinessType.UNKNOWN
          }
        >
          <FormItem
            label={
              <div>
                <div class={css.radioLabel}>Does your title or role allow you to sign contracts for your business?</div>
                <div class={css.radioExtra}>
                  <Icon name="information" />
                  <div>
                    Examples include: Chief Executive Officer, Chief Financial Officer, Chief Operating Officer,
                    Management Member, General Partner, President, Vice President, or Treasurer.
                  </div>
                </div>
              </div>
            }
            error={errors().businessTypeCategory}
          >
            <RadioGroup
              name="is-executive"
              value={values().isExecutive}
              onChange={(value) => handlers.isExecutive?.(value as boolean)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </RadioGroup>
          </FormItem>
        </Show>
        <div style={{ height: '24px' }} />
        <FlatButton type="primary" htmlType="submit" disabled={disableNext(values())}>
          Next
        </FlatButton>
      </Form>
    </div>
  );
}