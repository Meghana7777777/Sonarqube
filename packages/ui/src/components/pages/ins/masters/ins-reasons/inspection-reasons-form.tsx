import { InsMasterdataCategoryEnum, InsTypesForMasterEnum } from "@xpparel/shared-models";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";

interface ITrollyDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
  SelectedInsType: InsTypesForMasterEnum;
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
      {<Row style={{ textAlign: 'center' }}>
        <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Reason Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Reason Name cannot start with space, have consecutive spaces, or be empty',
            },]}>
            <Input placeholder="Please Enter Reason Name" />
          </Form.Item>
        </Col>
      </Row>}
      <Row style={{ textAlign: 'center' }}>

        <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter The Reason Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Reason code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}>
            <Input placeholder="Please Enter Reason Code" />
          </Form.Item>
        </Col>
      </Row>
      {props.SelectedInsType === InsTypesForMasterEnum.FABRICINS && (<Row style={{ textAlign: 'center' }}>

        <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>
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
      </Row>)}
      {props.SelectedInsType === InsTypesForMasterEnum.FABRICINS && (<Row style={{ textAlign: 'center' }}>
        <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>

          <Form.Item
            label="Point Value"
            name="pointValue"
            rules={[
              { required: true, message: 'Enter the point value' },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject('Point value cannot be negative'),
              },
            ]}
          >
            <Input type="number" placeholder="Please Enter Point Value" min={0} />
          </Form.Item>

        </Col>
      </Row>)}
      {props.SelectedInsType === InsTypesForMasterEnum.FABRICINS && (<Row style={{ textAlign: 'center' }}>

        <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Select the category' }]}>
            <Select placeholder="Please Select Category">
              {Object.keys(InsMasterdataCategoryEnum).map(key => (
                <Select.Option key={key} value={key}>
                  {InsMasterdataCategoryEnum[key].name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>)}
      <Row style={{ textAlign: 'center' }}>
        {/* <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Inspection Type"
            name="insType"> */}
        {/* // rules={[{ required: false, message: 'Enter the inspection type' }]}>
            // <Select placeholder="Please Select Category">
            //   {Object.keys(InsTypesForMasterEnum).map(key => (
            //     <Select.Option key={key} value={key}>
            //       {InsTypesForMasterEnum[key].name}
            //     </Select.Option>
            //   ))}
            // </Select> */}

        {/* <Input type="hidden" />


          </Form.Item>
        </Col> */}
      </Row>
      {(
        props.SelectedInsType === InsTypesForMasterEnum.FGINS ||
        props.SelectedInsType === InsTypesForMasterEnum.THREADINS ||
        props.SelectedInsType === InsTypesForMasterEnum.YARNINS ||
        props.SelectedInsType === InsTypesForMasterEnum.TRIMINS
      ) && (
          <Row style={{ textAlign: 'center' }}>
            <Col xs={24} sm={24} md={{ span: 20, offset: 2 }} lg={{ span: 15, offset: 3 }}>
              <Form.Item
                label="Reason Description"
                name="reasonDesc"
                rules={[{ required: false, message: 'Enter the reason description' }]}
              >
                <Input.TextArea
                  placeholder="Please Enter Reason Description"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

      {/* {props.SelectedInsType === InsTypesForMasterEnum.FGINS && (<Row style={{ textAlign: 'center' }}>

        <Col xs={{ span: 24 }} lg={{ span: 15 }} offset={3}>
          <Form.Item
            label="Defect Reason"
            name="reasonName"
            rules={[{ required: false, message: 'Enter the defect reason' }]}>
            <Input placeholder="Please Enter Defect Reason" />
          </Form.Item>
        </Col>
      </Row>)} */}
    </Form>
  );
}
export default ReasonsCreateForm;
