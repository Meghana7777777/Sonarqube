import { PackListIdRequest, PackingListSummaryModel, PreferredStorageMaterialEnum, SecurityCheckRequest } from "@xpparel/shared-models";
import { PackingListService } from "@xpparel/shared-services";
import { Button, Card, Col, DatePicker, DatePickerProps, Form, FormInstance, Input, Modal, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface IRackDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
}

export const RacksCreateForm = (props: IRackDetails) => {
  const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef } = props;
  useEffect(() => {
    if (initialvalues) {
      formRef.setFieldsValue(initialvalues)
    } else {
      formRef.resetFields();
    }
  }, [initialvalues])

  return (
    <Form initialValues={initialvalues} form={formRef} layout="vertical">
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Rack Name" name="name" rules={[{ required: true, message: 'Enter The Rack Name' }, {
            pattern: /^(?!\s)(?!.*\s{2,}).*$/,
            message: 'Rack Name cannot start with space, have consecutive spaces, or be empty',
          },
          ]}>
            <Input placeholder="Please Enter Rack Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Rack Code" name="code" rules={[{ required: true, message: 'Enter The Code' }, {
            pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
            message: 'Rack code cannot start or end with space, and must not contain consecutive spaces,or be empty',
          },]}>
            <Input placeholder="Please Enter Rack Code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Levels" name="levels" rules={[{ required: true, message: 'Enter No Of Levels' }]}>
            <Input placeholder="Please Enter No Of Levels" type="number" min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="No Of Columns" name="columns" rules={[{ required: true, message: 'Enter Columns' }]}>
            <Input placeholder="Please Enter No Of Columns" type="number" min={0} />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Preferred Storage Material"
            name="preferredstoraageMateial"
            rules={[{ required: true, message: 'Select the Preferred Storage Material' }]}
          >
            <Select placeholder="Please Select Preferred Material" value={PreferredStorageMaterialEnum}>
              {Object.keys(PreferredStorageMaterialEnum).map(key => (
                <option key={key} value={key}>
                  {PreferredStorageMaterialEnum[key].name}
                </option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Warehouse Code"
            name="wcode"
            rules={[{ required: true, message: 'Enter The Warehouse Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Warehouse code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}
          >
            <Input placeholder="Please Enter Warehouse Code" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Enter The Priority' }]}>
            <Input placeholder="Please Enter Your Priority" type="number" min={0} />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Capacity in Mts" name="capacityInMts" rules={[{ required: true, message: 'Enter The Capacity' }]}>
            <Input placeholder="Please Enter The Capacity" type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
export default RacksCreateForm;
