import { CommonRequestAttrs, RackOccupiedRequest, RackOccupiedResponseModel, RacksCreationModel } from "@xpparel/shared-models";
import { BinsServices, RacksServices } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface IBinDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>;
  initialvalues: any;
}

export const BinsCreateForm = (props: IBinDetails) => {
  // const [intialValues, setInitialvalues] = useState<any>();
  const { initialvalues, formRef } = props;
  const services = new RacksServices();
  const binservices = new BinsServices();
  const user = useAppSelector((state) => state.user.user.user);
  const [rackdata, setRackData] = useState<RacksCreationModel[]>([]);
  const [rackdataoccupied, setOccupiedData] = useState<RackOccupiedResponseModel[]>([]);
  const [optionColumn, setColumnOption] = useState<any[]>([]);
  const { Option } = Select;
  const [selectedLevelPriority, setSelectedLevelPriority] = useState<number | undefined>(undefined);
  useEffect(() => {
    initialvalues ? formRef.setFieldsValue(initialvalues) : formRef.resetFields();
    getRacksDropdown();
    if (initialvalues?.rackId)
      bringConsumedLevelandColumnData(initialvalues.rackId);

    if (initialvalues?.column)
      levelColumnPriority(initialvalues?.column);
  }, [initialvalues])

  const getRacksDropdown = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    services.getAllRacksData(obj).then(res => {
      if (res.status) {
        setRackData(res.data);
      }
    }).catch(err => console.log(err.message));
  }


  const bringConsumedLevelandColumnData = (rackId: number) => {
    const obj = new RackOccupiedRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rackId);
    binservices.getMappedRackLevelColumn(obj).then(res => {
      if (res.status) {
        setOccupiedData(res.data);
      }
    }).catch(err => console.log(err.message));
  }

  const handleLevelPriorityChange = (value: number) => {
    setSelectedLevelPriority(value);
    formRef.setFieldsValue({ priority: value });
  };

  const levelColumnPriority = (selectedLevel: number) => {
    const levelInfoofColumn = rackdataoccupied.filter(rackDataInfo => rackDataInfo.level == selectedLevel)[0];
    const optionClumn = [];
    for (let j = 1; j <= levelInfoofColumn?.column; j++) {
      optionClumn.push(<Option key={`C${j}`} value={j} disabled={levelInfoofColumn?.mappedColumns.includes(j)}>Column - {j}</Option>)
    }
    setColumnOption(optionClumn); 
  }


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
            rules={[{ required: true, message: 'Enter The BIN Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Bin Name cannot start with space, have consecutive spaces, or be empty',
            },]}
          >
            <Input placeholder="Please Enter Bin Name"/>
          </Form.Item>
        </Col>
      
        <Col xs={{ span: 24 }} lg={{ span: 12 }} >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter The Code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Bin code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}
          >
            <Input placeholder="Please Enter Bin Code"/>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Supported Pallets Count"
            name="spcount"
            rules={[{ required: true, message: 'Enter Supported Pallets Count'}]}
          >
            <Input placeholder="Please Enter Supported Pallets Count " type="number" min={0}/>
          </Form.Item>
        </Col>
      
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Rack Name"
            name="rackId"
            rules={[{ required: true, message: 'Select the Rack Name' }]}>
            <Select placeholder="Please Select Rack Name " value={rackdata} onChange={e => bringConsumedLevelandColumnData(Number(e))}>
              {rackdata.map((value) => (
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
              {rackdataoccupied.map((levelInfo) => (
                <Option key={levelInfo.level} value={levelInfo.level}>
                  Level - {levelInfo.level}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
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

    </Form>
  );
};

export default BinsCreateForm;
