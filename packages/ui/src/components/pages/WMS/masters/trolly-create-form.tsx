import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Space } from "antd";
import { useEffect, useState } from "react";

interface ITrollyDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
  trollyId: any;
}

export const TrollyCreateForm = (props: ITrollyDetails) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef, trollyId } = props;
  useEffect(() => {
    if (intialValues) {
      formRef.setFieldsValue(intialValues)
    } else {
      formRef.resetFields();
    }
  }, [intialValues])

  return (
    <Form initialValues={initialvalues} form={formRef} layout="vertical">
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Trolly Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Trolly Name cannot start with space, have consecutive spaces, or be empty',
            },]}>
            <Input disabled={trollyId} placeholder="Please Enter Trolly Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            // normalize={(v, _, p) => v.toUpperCase()}
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter The Trolley Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Trolly code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input disabled={trollyId} placeholder="Enter The Trolley Code" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: 'Please Enter Capacity' }]}>
            <Input placeholder="Please Enter Capacity" type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>
      {/* <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="UOM"
            name="uom"
            rules={[{ required: true, message: 'Select the UOM' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'UOM cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter UOM" />
          </Form.Item>
        </Col>
      </Row> */}
      {/* <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Bin Id"
            name="binId"

            rules={[{ required: true, message: 'Enter the Bin code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Bin Id cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter BIN ID" />
          </Form.Item>
        </Col>
      </Row> */}





    </Form>
  );
}
export default TrollyCreateForm;
