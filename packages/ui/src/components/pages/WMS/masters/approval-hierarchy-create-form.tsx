import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Space } from "antd";

interface IRackDetails {
  //selectedRecord?: any;
  formRef: FormInstance<any>
}

export const ApprovalHierarchyCreateForm = (props: IRackDetails) => {
  const { formRef } = props;
  return (
    <Form form={formRef}>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Feature"
            name="feature"
            rules={[{ required: true, message: 'Enter The Feature' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Sub Feature"
            name="subfeature"
            rules={[{ required: true, message: 'Enter The subfeature' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="User Role"
            name="userrole"
            rules={[{ required: true, message: 'Enter User Role' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Order"
            name="order"
            rules={[{ required: true, message: 'Select the Order' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

    </Form>
  );
}
export default ApprovalHierarchyCreateForm;
