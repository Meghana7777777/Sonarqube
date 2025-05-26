import React, { ComponentProps } from 'react';
import { Form, FormInstance } from 'antd';
// import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseFormProps = Omit<ComponentProps<typeof Form>, 'onFinish'> & { onFinish?: (values: any) => void };

export type BaseFormInstance = FormInstance;

export interface BaseFormInterface<T> extends React.FC<T> {

  Item: typeof Form.Item;
  List: typeof Form.List;
  useForm: typeof Form.useForm;
  Provider: typeof Form.Provider;
}

export const ScxForm: BaseFormInterface<BaseFormProps> = ({ onFinishFailed, layout = 'vertical', ...props }) => {
  return <Form layout={layout} {...props} />;
};

ScxForm.Item = Form.Item;
ScxForm.List = Form.List;
ScxForm.useForm = Form.useForm;
ScxForm.Provider = Form.Provider;
