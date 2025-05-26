import { CommonRequestAttrs, FabricUOM, FgContainerTypeEnum, FgLocationCreateReq, FgLocationFilterReq, WareHouseModel, WeightUOM } from "@xpparel/shared-models";
import { FgLocationService, WareHouseService } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, InputNumber, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import { LengthSelectAfter } from "../rack";

interface IContainerDetails {
  selectedRecord?: any;
  formRef: FormInstance<any>
  initialValues: any;
}
const { Option } = Select;
export const FgContainerCreateForm = (props: IContainerDetails) => {
  const { formRef, initialValues } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const [locationsData, setLocationsData] = useState<FgLocationCreateReq[]>([]);
  const [whs, setWhs] = useState<WareHouseModel[]>([]);
  const service = new FgLocationService();
  const whService = new WareHouseService();

  useEffect(() => {
    getWareHouseToRacks();
    if (initialValues) {
      getAllLocationData(initialValues?.whId)
    }
  }, []);

  const getWareHouseToRacks = () => {
    const req = new CommonRequestAttrs(user.userName, user.unitCode, user.companyCode, user.userId)
    whService.getWareHouseToRacks(req)
      .then((res) => {
        if (res.status) {
          setWhs(res.data);
        } else {
          setWhs([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllLocationData = (whId: number) => {
    if (!whId) {
      setLocationsData([]);
      return
    }
    const obj = new FgLocationFilterReq(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId);
    service.getAllLocationData(obj).then(res => {
      if (res.status) {
        setLocationsData(res.data);
      } else {
        setLocationsData([]);
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      setLocationsData([]);
      AlertMessages.getErrorMessage(err.message);
    })
  }

  return (
    <Form form={formRef} layout="vertical">
      <Form.Item style={{ display: 'none' }} name="id">
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter The Container Name' }, {
              pattern: /^(?!\s)(?!.*\s{2,}).*$/,
              message: 'Container Name cannot start with space, have consecutive spaces, or be empty',
            },]}
          >
            <Input placeholder="Please Enter Container Name" />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Enter The Code' }, {
            pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
            message: 'Container code cannot start or end with space, and must not contain consecutive spaces,or be empty',
          },]}>
            <Input placeholder="Please Enter Container Code" />
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
            <Select showSearch allowClear placeholder="Please Select Preferred Material">
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
            <InputNumber placeholder="Please Enter length" style={{ width: '100%' }} min={0} />
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
          <Form.Item
            label="Warehouse Code"
            name="whId"
          // rules={[{ required: true, message: 'Enter the warehouse code' }, {
          //   pattern: /^(?!\s)(?!.*\s{2,}).*[^\s]$/,
          //   message: 'Warehouse code cannot start or end with space, and must not contain consecutive spaces,or be empty',
          // },]}
          >
            <Select
              placeholder={'WareHouse'}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(e) => {
                getAllLocationData(e)
              }}
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
            label="Container Type"
            name="type"
            rules={[{ required: true, message: 'Select the Container Type' }]}
          >
            <Select placeholder="Select the Container type" showSearch allowClear style={{ width: '100%' }}>
              {Object.keys(FgContainerTypeEnum).map(key => (
                <Select.Option key={key} value={key}>
                  {FgContainerTypeEnum[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item></Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Current Location"
            name="currentLocationId"
          >
            <Select placeholder="Please Select Location" showSearch allowClear >
              {locationsData.map((levelInfo) => (
                <Select.Option key={levelInfo.id} value={levelInfo.id}>
                  {levelInfo.code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            label="Max Items"
            name="maxItems"
            rules={[{ required: true, message: 'Enter the Max Items' }]}
          >
            <InputNumber placeholder="Please Enter Max Items" style={{ width: '100%' }} type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
export default FgContainerCreateForm;
