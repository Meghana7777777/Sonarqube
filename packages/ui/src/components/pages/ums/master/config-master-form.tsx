import { Col, Form, Input, Row, Select } from 'antd';
import { FormInstance } from 'antd/lib';
import React, { useEffect } from 'react';

interface Iprops {
  formRef: FormInstance<any>;
  initialValues: any;
  
}

export const ConfigMasterForm = (props: Iprops) => {
  const { formRef, initialValues } = props;

  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Form form={props.formRef} layout="vertical">
     
      <Form.Item label="ID" name="id" hidden></Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label=" Name" name="name" rules={[{ required: true, message: ' Name is required' }]}>
            <Input placeholder=" Name" />
          </Form.Item>
        </Col>

        {/* Master Code Field */}
        <Col span={12}>
          <Form.Item label=" Code" name="code" rules={[{ required: true, message: ' Code is required' }]}>
            <Input placeholder="Code" />
          </Form.Item>
        </Col>
      </Row>

    </Form>
  );
};

export default ConfigMasterForm;
