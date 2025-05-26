import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum } from "@xpparel/shared-models";
import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface IPalletDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
}

export const PalletsCreateForm = (props: IPalletDetails) => {
  const { initialvalues, formRef } = props;

  useEffect(() => {
    if (initialvalues) {
      formRef.setFieldsValue(initialvalues);
    } else {
      formRef.resetFields();
    }
  }, [initialvalues, formRef]);
  return (
    <Form initialValues={initialvalues} form={formRef} layout="vertical">
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Pallet Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Pallet Name cannot start with space, have consecutive spaces, or be empty',
            },]}
          >
            <Input  placeholder="Please Enter Pallet Name"/>
          </Form.Item>
        </Col>
        
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please Enter Pallet Code' }, {
            pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
            message: 'Pallet code cannot start or end with space, and must not contain consecutive spaces,or be empty',
          },]}>
            <Input  placeholder="Please Enter Pallet Code"/>
          </Form.Item>
        </Col>
      </Row>

      {/* <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Fabric Capacity"
            name="fabricCapacity"
            rules={[{ required: true, message: 'Enter the fabricapacity' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Fabric UOM"
            name="fabricUom"
            rules={[{ required: true, message: 'Select the Fabric UOM' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Weight Capacity"
            name="weightCapacity"
            rules={[{ required: true, message: 'Enter the weightcapacity' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Weight UOM"
            name="weightUom"
            rules={[{ required: true, message: 'Enter the Weight UOM' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row> */}



      <Row gutter={16}>
        {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Freeze Status"
            name="freezeStatus"
            rules={[{ required: true, message: 'Enter the Freeze Status' }]}
          >
            <Input />
          </Form.Item>
        </Col> */}

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Max Items"
            name="maxItems"
            rules={[{ required: true, message: 'Enter the Max Items' }]}
          >
            <Input  placeholder="Please Enter Max Items" type="number" min={0}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
export default PalletsCreateForm;
