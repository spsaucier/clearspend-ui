import { Show } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Radio, RadioGroup } from '_common/components/Radio';
import { BusinessType, BusinessTypeCategory, BusinessTypeI18n } from 'app/types/businesses';
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

const getBusinessTypeFromCategory = (
  businessTypeCategory: BusinessTypeCategory,
  selectedBusinessType: BusinessType,
) => {
  switch (businessTypeCategory) {
    case BusinessTypeCategory.NONPROFIT:
      return BusinessType.INCORPORATED_NON_PROFIT;
    case BusinessTypeCategory.INDIVIDUAL:
      return BusinessType.SOLE_PROPRIETORSHIP;
    case BusinessTypeCategory.COMPANY:
    default:
      return selectedBusinessType;
  }
};

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
    props.onNext(
      data.businessTypeCategory,
      getBusinessTypeFromCategory(data.businessTypeCategory, data.businessType),
      data.isOwnerOf25,
      data.isExecutive,
    );
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
      <Description>Our lawyers made us ask, but we promise: this is not a credit check.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem
          label="Please select the legal entity type of your business."
          darkMode={true}
          error={errors().businessTypeCategory}
        >
          <RadioGroup
            name="business-type"
            value={values().businessTypeCategory}
            onChange={handlers.businessTypeCategory}
          >
            <Radio value={BusinessTypeCategory.INDIVIDUAL}>Individual/Sole Proprietorship</Radio>
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
              <Option value={BusinessType.SINGLE_MEMBER_LLC}>{BusinessTypeI18n[BusinessType.SINGLE_MEMBER_LLC]}</Option>
              <Option value={BusinessType.MULTI_MEMBER_LLC}>{BusinessTypeI18n[BusinessType.MULTI_MEMBER_LLC]}</Option>
              <Option value={BusinessType.PRIVATE_PARTNERSHIP}>
                {BusinessTypeI18n[BusinessType.PRIVATE_PARTNERSHIP]}
              </Option>
              <Option value={BusinessType.PUBLIC_PARTNERSHIP}>
                {BusinessTypeI18n[BusinessType.PUBLIC_PARTNERSHIP]}
              </Option>
              <Option value={BusinessType.PRIVATE_CORPORATION}>
                {BusinessTypeI18n[BusinessType.PRIVATE_CORPORATION]}
              </Option>
              <Option value={BusinessType.PUBLIC_CORPORATION}>
                {BusinessTypeI18n[BusinessType.PUBLIC_CORPORATION]}
              </Option>
              <Option value={BusinessType.OTHER}>{BusinessTypeI18n[BusinessType.OTHER]}</Option>
            </Select>
          </FormItem>
        </Show>
        <Show
          when={
            values().businessTypeCategory === BusinessTypeCategory.COMPANY &&
            values().businessType !== BusinessType.UNKNOWN
          }
        >
          <FormItem label="Are you owner with at least 25% ownership?" error={errors().isOwnerOf25} darkMode={true}>
            <RadioGroup name="is-owner" value={values().isOwnerOf25} onChange={handlers.isOwnerOf25}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </RadioGroup>
          </FormItem>
        </Show>
        <Show
          when={
            values().businessTypeCategory === BusinessTypeCategory.NONPROFIT ||
            (values().businessTypeCategory === BusinessTypeCategory.COMPANY &&
              values().businessType !== BusinessType.UNKNOWN)
          }
        >
          <FormItem
            darkMode={true}
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
            error={errors().isExecutive}
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
