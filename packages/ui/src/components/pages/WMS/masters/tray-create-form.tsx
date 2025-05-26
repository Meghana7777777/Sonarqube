import { CommonRequestAttrs, TrollyModel, TrollyResponse } from "@xpparel/shared-models";
import { TrolleysServices } from "@xpparel/shared-services";
import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Select, Space } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface ITrayDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
  trollyData: TrollyModel[];
  trayId:any;
}
export const TraysCreateForm = (props: ITrayDetails) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef ,trollyData, trayId} = props;
  useEffect(() => {
    if (intialValues) {
      formRef.setFieldsValue(intialValues)
    } else {
      formRef.resetFields();
    }
  }, [intialValues])

  const user = useAppSelector((state) => state.user.user.user);
  const { Option } = Select;
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
            rules={[{ required: true, message: 'Enter The Tray Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Tray Name cannot start with space, have consecutive spaces, or be empty',
            },]}
          >
            <Input disabled={trayId} placeholder="Please Enter Tray Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            // normalize={(v, _, p) => v.toUpperCase()}
            label="Code" name="code" rules={[{ required: true, message: 'Enter The Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Tray code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input  disabled={trayId} placeholder="Please Enter Tray Code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: 'Enter Capacity' }]}
          >
            <Input placeholder="Please Enter Tray Capacity" type="number" min={0} />
          </Form.Item>
        </Col>

        {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="UOM" name="uom" rules={[{ required: true, message: 'Select the UOM' }, {
            pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
            message: 'UOM cannot start or end with space, and must not contain consecutive spaces,or be empty',
          },]}>
            <Input placeholder="Please Enter UOM" />
          </Form.Item>
        </Col> */}
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Length" name="length" rules={[{ required: true, message: 'Enter the Length' }]}>
            <Input placeholder="Please Enter Length" type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>

      {/* <Row gutter={16}> */}
      {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Trolly Code"
            name="trollyCode"
            rules={[{ required: true}]}
            initialValue={initialvalues?.trolleyInfo.code}
          >
            <Select  placeholder="Please select Trolly Code" >
              {trollyData.map((value) => (
                <Option key={value.id} value={value.id}>
                  {value.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col> */}


      {/* </xRow> */}

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Width" name="width" rules={[{ required: true, message: 'Enter the Width' }]}>
            <Input placeholder="Please Enter Width" type="number" min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Enter the Height' }]}>
            <Input placeholder="Please Enter Rack Height" type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>

    </Form>
  );
}
export default TraysCreateForm;
