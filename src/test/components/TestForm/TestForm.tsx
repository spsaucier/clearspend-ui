import { createEffect } from 'solid-js';

import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';

import type { TestData } from '../../types';

interface FormValues {
  input: string;
  some: boolean;
  colors: string[];
}

function toFormData(data: TestData): FormValues {
  return {
    input: data.name,
    some: data.active,
    colors: [...data.colors],
  };
}

interface Props {
  data: Readonly<TestData>;
  loading: boolean;
  onSubmit: (data: TestData) => void;
}

export function TestForm(props: Readonly<Props>) {
  const [values, errors, isDirty, handlers, setErrors, submit, reset] = createForm<FormValues>({
    defaultValues: toFormData(props.data),
    rules: { input: [required] },
  });

  createEffect(() => {
    reset(toFormData(props.data));
  });

  const onSubmit = (form: Readonly<FormValues>) => {
    props.onSubmit({
      name: form.input,
      active: form.some,
      colors: [...form.colors],
    });
  };

  return (
    <Form onSubmit={submit(onSubmit)}>
      <FormItem label="Input" error={errors().input}>
        <Input placeholder="Input something..." value={values().input} onChange={handlers.input} />
      </FormItem>
      <FormItem label="Some" extra="Some description..." error={errors().some}>
        <Checkbox checked={values().some} onChange={handlers.some}>
          Something
        </Checkbox>
      </FormItem>
      <FormItem label="Colors" error={errors().colors}>
        <CheckboxGroup value={values().colors} onChange={handlers.colors}>
          <Checkbox value="red">Red</Checkbox>
          <Checkbox value="green">Green</Checkbox>
          <Checkbox value="blue" disabled>
            Blue
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <br />
      <Button htmlType="submit" disabled={!isDirty() || props.loading}>
        {props.loading ? 'Saving...' : 'Test'}
      </Button>
      {isDirty() && <Button onClick={() => reset()}>Reset</Button>}
      <br />
      <br />
      <div>
        <Button onClick={() => handlers.input('test!!!')}>Test Input</Button>
        <Button onClick={() => handlers.some(false)}>Test Checkbox</Button>
        <Button onClick={() => handlers.colors(['red'])}>Test Group</Button>
      </div>
      <Button onClick={() => setErrors({ some: 'Ooos!' })}>Test Errors</Button>
    </Form>
  );
}
