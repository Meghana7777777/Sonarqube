import { CommonRequestAttrs, FabricUOM, PreferredFGStorageMaterialEnum, WareHouseModel, WeightUOM } from "@xpparel/shared-models";
import { WareHouseService } from "@xpparel/shared-services";
import { Checkbox, Col, Form, FormInstance, Input, InputNumber, message, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface IRackDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialvalues: any;
}

export const LengthSelectAfter = (
  <Select defaultValue={FabricUOM.METER}>
    {Object.keys(FabricUOM).map(key => (
      <option key={key} value={key}>
        {FabricUOM[key]}
      </option>
    ))}
  </Select>
)

const { Option } = Select;
export const FgRacksCreateForm = (props: IRackDetails) => {
  // const [intialValues, setInitialvalues] = useState<any>()
  const { initialvalues, formRef } = props;
  const [whs, setWhs] = useState<WareHouseModel[]>([]);
  const [selectWh, setSelectWh] = useState<number>(null);
  const [selectedWhData, setSelectedWhData] = useState<WareHouseModel>(null);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, unitCode, companyCode, userId } = user
  // console.log(initialvalues,'initialvalues')
  initialvalues.createLocations = true;

  const service = new WareHouseService();
  useEffect(() => {
    getWareHouseToRacks()
  }, [])

  useEffect(() => {
    if (initialvalues && Object.keys(initialvalues).length > 0) {
      if (initialvalues.whId)
        onRackChange(initialvalues.whId)
      formRef.setFieldsValue({ ...initialvalues, createLocations: true });
    } else {
      formRef.resetFields();
    }
  }, [initialvalues]);


  const getWareHouseToRacks = () => {
    const req = new CommonRequestAttrs(userName, unitCode, companyCode, userId)
    service.getWareHouseToRacks(req)
      .then((res) => {
        if (res.status) {
          setWhs(res.data);
        } else {
          setWhs([]);
          message.error(res.internalMessage, 4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getOptions = (noOfFloors: number) => {
    return [...Array(noOfFloors).keys()].map(floor => {
      return <Option key={floor + 1} value={floor + 1}>{`Floor ${floor + 1}`}</Option>
    })
  }

  const onRackChange = (whId: number) => {
    setSelectWh(whId);
    const selectedWh = whs.find(rec => rec.id == whId);
    setSelectedWhData(selectedWh);
    formRef.setFieldValue('floor', '')
  }



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
          <Form.Item label="No of Rows" name="levels" rules={[{ required: true, message: 'Enter No Of rows' }]}>
            <InputNumber style={{width:'100%'}} placeholder="Please Enter No Of Rows"  min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="No Of Columns" name="columns" rules={[{ required: true, message: 'Enter Columns' }]}>
          <InputNumber style={{width:'100%'}}placeholder="Please Enter No Of Columns"  min={0} />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Preferred Storage Material"
            name="preferredStorageMaterial"
            rules={[{ required: true, message: 'Select the preferredStorageMaterial' }]}
          >
            <Select placeholder="Please Select Preferred Material" allowClear value={PreferredFGStorageMaterialEnum}>
              {Object.keys(PreferredFGStorageMaterialEnum).map(key => (
                <option key={key} value={key}>
                  {PreferredFGStorageMaterialEnum[key]}
                </option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Warehouse Code"
            name="whId"
            rules={[{ required: true, message: 'Enter the warehouse code' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
              message: 'Warehouse code cannot start or end with space, and must not contain consecutive spaces,or be empty',
            },]}
          >
            <Select
              placeholder={'WareHouse'}
              value={selectWh}
              onChange={(value) => { onRackChange(value); }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {whs?.map((racks) => (
                <Option key={racks.id} value={racks.id}>
                  {racks.wareHouseDesc}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Select the floor"
            name="floor"
            rules={[{ required: true, message: 'Please select the floor' }
            ]}
          >
            <Select
              placeholder={'Please select the floor'}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {selectedWhData ? getOptions(selectedWhData.noOfFloors) : <Option key={null} value={null}>
                Please select Rack first
              </Option>}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Weight Capacity"
            name="weightCapacity"
            rules={[{ required: true, message: 'Enter the weight capacity' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Weight UOM"
            name="weightUom"
            rules={[{ required: true, message: 'Enter the Weight UOM' }]}
          >
            <Select placeholder="Please Select Preferred Material">
              {Object.keys(WeightUOM).map(key => (
                <Select.Option key={key} value={key}>
                  {WeightUOM[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>


      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Length" name="length" rules={[{ required: true, message: 'Enter length' }]}>
            <InputNumber placeholder="Please Enter Length" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Length Uom" name="lengthUom" rules={[{ required: true, message: 'Enter length' }]}>
            <Select placeholder="Uom">
              {Object.keys(FabricUOM).map(key => (
                <Select.Option key={key} value={key}>
                  {FabricUOM[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Width" name="width" rules={[{ required: true, message: 'Enter width' }]}>
            <InputNumber placeholder="Please Enter width" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Width Uom" name="widthUom" rules={[{ required: true, message: 'Enter length' }]}>
            <Select placeholder="Uom">
              {Object.keys(FabricUOM).map(key => (
                <Select.Option key={key} value={key}>
                  {FabricUOM[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Enter height' }]}>
            <InputNumber placeholder="Please Enter height" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Height Uom" name="heightUom" rules={[{ required: true, message: 'Enter length' }]}>
            <Select placeholder="Uom">
              {Object.keys(FabricUOM).map(key => (
                <Select.Option key={key} value={key}>
                  {FabricUOM[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

      </Row>
      <Row gutter={16}>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Latitude" name="latitude" rules={[{ required: true, message: 'Enter latitude' }]}>
            <Input placeholder="Please Enter latitude" />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Longitude" name="longitude" rules={[{ required: true, message: 'Enter longitude' }]}>
            <Input placeholder="Please Enter longitude" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Enter the priority' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="Please Enter Your Priority" type="number" min={0} />
          </Form.Item>
        </Col>


        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item name="createLocations" valuePropName="checked" >
            <Checkbox>Create Locations</Checkbox>
          </Form.Item>
        </Col>
      </Row>


    </Form>
  );
}
export default FgRacksCreateForm;
