import { Col, Form, FormInstance, Input, Row } from "antd";
import { useEffect, useState } from "react";

interface ISuppliersDetails {
  selectedRecord?: any;
  // isEditing?: boolean;
  formRef: FormInstance<any>;
  initialvalues: any;
  isEdit: boolean;
}

export const SupplierCreateForm = (props: ISuppliersDetails) => {
  const { initialvalues, formRef, isEdit } = props;

  useEffect(() => {
    if (initialvalues) {
      formRef.setFieldsValue(initialvalues);
    } else {
      formRef.resetFields();
    }
  }, [initialvalues, formRef]);

  return (
    <Form initialValues={initialvalues} form={formRef} layout="vertical">
      <Form.Item style={{ display: "none" }} name="id">
        <Input type="hidden" />
      </Form.Item>

      <Row style={{ textAlign: "center" }}>
        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Supplier Code"
            name="supplierCode"
            rules={[
              { required: true, message: "Enter The Supplier Code" },
              {
                pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
                message:
                  "Supplier Code cannot start or end with space, and must not contain consecutive spaces or be empty",
              },
            ]}
          >
            <Input 
              placeholder="Please Enter Supplier Code" 
              disabled={isEdit}            />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ textAlign: "center" }}>
        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Supplier Name"
            name="supplierName"
            rules={[
              { required: true, message: "Enter The Supplier Name" },
              {
                pattern: /^(?!\s)(?!.*\s{2,}).*$/,
                message:
                  "Supplier Name cannot start with space, have consecutive spaces, or be empty",
              },
            ]}
          >
            <Input placeholder="Please Enter Supplier Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ textAlign: "center" }}>
        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please Enter Supplier  Phone Number" },
              {
                pattern: /^[0-9]+$/,
                message: "Phone Number must contain only numbers",
              },
            ]}
          >
            <Input
              placeholder="Please Supplier Enter Phone Number"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ textAlign: "center" }}>
        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Address"
            name="supplierAddress"
            rules={[{ required: true, message: "Please Enter Supplier Address" }]}
          >
            <Input placeholder="Please Enter Supplier Address" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SupplierCreateForm;
