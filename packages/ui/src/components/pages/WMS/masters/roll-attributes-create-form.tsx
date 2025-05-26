import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Space } from "antd";
import { useEffect, useState } from "react";

interface IRollAttributes {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
}

export const RollAttributesCreateForm = (props: IRollAttributes) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef } = props;
  useEffect(() => {
    formRef.setFieldsValue(intialValues)
  }, [intialValues])

  return (
    <Form initialValues={initialvalues} form={formRef}>
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The  Roll Attribute' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter Roll Attribute The Code' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>



    </Form>
  );
}
export default RollAttributesCreateForm;
