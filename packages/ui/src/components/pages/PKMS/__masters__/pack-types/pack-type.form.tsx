import { PackingMethodsEnum } from "@xpparel/shared-models";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { useEffect } from "react";
interface PtTypeProps {
  formRef: FormInstance<any>
  initialValues: any
}

export const PackTypeForm = (props: PtTypeProps) => {
  const { formRef, initialValues } = props



  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
    }
  }, [initialValues]);


  return (
    <Form
      form={formRef}
      layout="vertical">
      <Form.Item label='Id' name='id' hidden></Form.Item>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }} >
          <Form.Item label='Code' name='packTypeCode' rules={[{ required: true, message: 'Please input your Code' }]}>
            <Input placeholder="Code"></Input>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }} >
          <Form.Item label='Description' name='packTypeDesc' rules={[{ required: true, message: 'Please input your Description' }]}>
            <Input placeholder="Description"></Input>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Packing Method" name="packMethod" rules={[{ required: true, message: "Please select Packing Method" }]}>
            <Select placeholder="Select Packing Method">
              {Object.values(PackingMethodsEnum).map((method) => (
                <Select.Option key={method} value={method}>
                  {method}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
};
export default PackTypeForm;
