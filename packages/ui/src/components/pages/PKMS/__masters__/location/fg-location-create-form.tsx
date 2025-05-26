import { CommonRequestAttrs, FgRackCreationModel, FgRackFilterRequest, FgRackOccupiedReq, FgRackOccupiedResModel } from "@xpparel/shared-models";
import { FgLocationService, FgRackServices } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface FgILocationDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>;
  initialValues: any;
}

export const FgLocationCreateForm = (props: FgILocationDetails) => {
  const { initialValues, formRef } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const [rackData, setRackData] = useState<FgRackCreationModel[]>([]);
  const [rackDataOccupied, setOccupiedData] = useState<FgRackOccupiedResModel[]>([]);
  const [optionColumn, setColumnOption] = useState<any[]>([]);
  const { Option } = Select;
  const [selectedLevelPriority, setSelectedLevelPriority] = useState<number | undefined>(undefined);
  const [selectedWhId, setSelectedWhId] = useState(null);

  const services = new FgRackServices();
  const locationsServices = new FgLocationService();
  useEffect(() => {
    initialValues ? formRef.setFieldsValue(initialValues) : formRef.resetFields();
    getRacksDropdown();
    if (initialValues?.rackId)
      bringConsumedLevelandColumnData(initialValues.rackId);

    if (initialValues?.column)
      levelColumnPriority(initialValues.column);
  }, [initialValues])

  const getRacksDropdown = () => {
    const fgRackFilterReq = new FgRackFilterRequest(
      user?.orgData?.companyCode,
      user?.orgData?.unitCode,
      user?.userName,
      user?.userId,
      selectedWhId
    );
    services.getAllRacksData(fgRackFilterReq).then(res => {
      if (res.status) {
        setRackData(res.data);
      }
    }).catch(err => {

    })
  }


  const bringConsumedLevelandColumnData = (rackId: number) => {
    const obj = new FgRackOccupiedReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rackId);
    locationsServices.getMappedRackLevelColumn(obj).then(res => {
      if (res.status) {
        setOccupiedData(res.data);
      }
    }).catch(err => {

    })
  }

  const handleLevelPriorityChange = (value: number) => {
    setSelectedLevelPriority(value);
    formRef.setFieldsValue({ priority: value });
  };

  const levelColumnPriority = (selectedLevel: number) => {
    const levelInfoofColumn = rackDataOccupied.filter(rackDataInfo => rackDataInfo.level == selectedLevel)[0];
    const optionClumn = [];
    for (let j = 1; j <= levelInfoofColumn?.column; j++) {
      optionClumn.push(<Option key={`C${j}`} value={j} disabled={levelInfoofColumn.mappedColumns.includes(j)}>Column - {j}</Option>)
    }
    setColumnOption(optionClumn);
  }


  return (
    <Form initialValues={initialValues} form={formRef} layout="vertical">
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Rack Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Rack Name cannot start with space, have consecutive spaces, or be empty',
            },]}
          >
            <Input placeholder="Please Enter Location Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }} >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter The Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Location code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}
          >
            <Input placeholder="Please Enter Location Code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Supported Pallets Count"
            name="spcount"
            rules={[{ required: true, message: 'Enter Supported Pallets Count' }]}
          >
            <Input placeholder="Please Enter Supported Pallets Count " type="number" min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Rack Name"
            name="rackId"
            rules={[{ required: true, message: 'Select the Rack Id' }]}>
            <Select placeholder="Please Select Rack Name " value={rackData} showSearch allowClear onChange={e => bringConsumedLevelandColumnData(Number(e))}>
              {rackData.map((value) => (
                <Option key={value.id} value={value.id}>
                  {value.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }} >
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: "Select the Level" }]}
          >
            <Select placeholder="Please Select Levels " onChange={levelColumnPriority}>
              {rackDataOccupied.map((levelInfo) => (
                <Option key={levelInfo.level} value={levelInfo.level}>
                  Level - {levelInfo.level}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }} >
          <Form.Item
            label="Column"
            name="column"
            rules={[{ required: true, message: "Select the Column" }]}
          >
            <Select placeholder="Please Select Columns">
              {optionColumn.map((rec) => rec)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Length" name="length" rules={[{ required: true, message: 'Enter length' }]}>
            <Input placeholder="Please Enter Length" type="number" min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Width" name="width" rules={[{ required: true, message: 'Enter width' }]}>
            <Input placeholder="Please Enter Width" type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Enter height' }]}>
            <Input placeholder="Please Enter Height" type="number" min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Latitude" name="latitude" rules={[{ required: true, message: 'Enter latitude' }]}>
            <Input placeholder="Please Enter latitude" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Longitude" name="longitude" rules={[{ required: true, message: 'Enter longitude' }]}>
            <Input placeholder="Please Enter longitude" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FgLocationCreateForm;
