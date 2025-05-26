import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Space } from "antd";

interface IRackDetails {
  //selectedRecord?: any;
  formRef: FormInstance<any>
}

export const UsersGroupCreateForm = (props: IRackDetails) => {
  const {formRef } = props;

  return (
    <Form form={formRef}>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Group Name"
            name="groupname"
            rules={[{ required: true, message: 'Enter The Group Name' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="User Id"
            name="userid"
            rules={[{ required: true, message: 'Enter The User Id' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      
     
        
    </Form>
  );
}
export default UsersGroupCreateForm;
