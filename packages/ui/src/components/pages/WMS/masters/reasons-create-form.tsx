import { InsMasterdataCategoryEnum } from "@xpparel/shared-models";
import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface ITrollyDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
}

export const ReasonsCreateForm = (props: ITrollyDetails) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef } = props;
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
            rules={[{ required: true, message: 'Enter The Reason' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Reason Name cannot start with space, have consecutive spaces, or be empty',
            },]}>
            <Input placeholder="Please Enter Reason Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter The Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Reason code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter Reason Code" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Ext Code"
            name="extCode"
            rules={[{ required: true, message: 'Enter Ext code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Ext code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter Ext Code" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Point Value"
            name="pointValue"
            rules={[{ required: true, message: 'Enter The Point Value' }]}>
            <Input placeholder="Please Enter Point Value"  type="number" min={0}/>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Category"
            name="category"

            rules={[{ required: true, message: 'Select the category' }]}>
            <Select placeholder="Please Select Category" value={InsMasterdataCategoryEnum}>
              {Object.keys(InsMasterdataCategoryEnum).map(key => (
                <option key={key} value={key}>
                  {InsMasterdataCategoryEnum[key].name}
                </option>
              ))}
            </Select>

          </Form.Item>
        </Col>
      </Row>



    </Form>
  );
}
export default ReasonsCreateForm;
