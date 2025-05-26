import { WareHouseModel } from "@xpparel/shared-models";
import { WareHouseService } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, message, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
interface MtTypeProps {
  formRef: FormInstance<any>
  initialValues: any
}

export const MaterialTypeForm = (props: MtTypeProps) => {
  const { formRef, initialValues } = props
  const service = new WareHouseService();
 


  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  

  return (
    <Form
      form={formRef}
      layout="vertical">
      <Form.Item   name='id' hidden></Form.Item>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }} >
          <Form.Item label='Code' name='materialTypeCode' rules={[{ required: true, message: 'Please input your Code' }]}>
            <Input placeholder="Code"></Input>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }} >
          <Form.Item label='Description' name='materialTypeDesc' rules={[{ required: true, message: 'Please input your Description' }]}>
            <Input placeholder="Description"></Input>
          </Form.Item>
        </Col>
        
      </Row>
    </Form>
  )
};
export default MaterialTypeForm;
