import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Space } from "antd";
import { useEffect, useState } from "react";

interface IMoverDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues:any;
}

export const MoversCreateForm = (props: IMoverDetails) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const {initialvalues,formRef } = props;
  
  useEffect(() => {
    formRef.setFieldsValue(intialValues)
  }, [intialValues])
  return (
    <Form initialValues={initialvalues} form={formRef} layout="vertical">
      <Form.Item style={{display:'none'}} name="id">
        <Input type="hidden"/>
      </Form.Item>
      <Row style={{ textAlign: 'center' }}>
        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Movers Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Mover Name cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter Mover Name"/>
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
              message: 'Mover code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter Mover Code"/>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: 'Enter Capacity' }]}>
            <Input placeholder="Please Enter Mover Capacity" type="number" min={0}/>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="UOM"
            name="uom"
            rules={[{ required: true, message: 'Select the UOM' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'UOM cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
           <Input placeholder="Please Enter UOM"/>
          </Form.Item>
        </Col>
      </Row>
      
     
        
    </Form>
  );
}
export default MoversCreateForm;
