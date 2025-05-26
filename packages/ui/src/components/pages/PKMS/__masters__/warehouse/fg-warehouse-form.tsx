import { useEffect, useState } from "react";
import { Form, Input, Select, InputNumber, Row, Col, FormInstance, message } from "antd";
import { UsersDropdownDto, WarehouseTypeEnum, UserDropdownReqDto } from "@xpparel/shared-models";
import { UserService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

interface WhProps {
  formRef: FormInstance<any>;
  initialValues: any;
  dummyRefreshKey: number
}

export const FGWareHouseForm = (props: WhProps) => {
  const service = new UserService();
  const { formRef, initialValues, dummyRefreshKey } = props;
  const [users, setUsers] = useState<UsersDropdownDto[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;

  useEffect(() => {
    getUsersDropdowntoWarehouse();

  }, []);

  useEffect(() => {
    formRef.setFieldsValue(initialValues)
  }, [initialValues])


  const getUsersDropdowntoWarehouse = () => {
    const requestPayload: UserDropdownReqDto = {
      role: "WarehouseManger",
      username: userName,
      unitCode: orgData.unitCode,
      companyCode: orgData.companyCode,
      userId: userId
    };

    service.getUsersDropdowntoWarehouse(requestPayload)
      .then((res) => {
        if (res.status) {
          setUsers(res.data);
        } else {
          setUsers([]);
          message.error(res.internalMessage, 4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleManagerChange = (value: string) => {
    const selectedManager = users.find(user => user.name === value);
    if (selectedManager) {
      formRef.setFieldsValue({ managerContact: selectedManager.mobileNo });
    } else {
      formRef.setFieldsValue({ managerContact: null });
    }
  };

  return (
    <Form form={formRef} key={dummyRefreshKey} layout="vertical">
      <Form.Item label="Id" name="id" hidden />
      <Row>
        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Code" name="wareHouseCode" rules={[{ required: true, message: "Please input your Code" }]}>
            <Input placeholder="Code" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Description" name="wareHouseDesc" rules={[{ required: true, message: "Please input your Description" }]}>
            <Input placeholder="Description" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Type" name="wareHouseType" rules={[{ required: true, message: "Please Select your Warehouse Type" }]}>
            <Select placeholder="Please Select Preferred Material">
              {Object.keys(WarehouseTypeEnum).map((key) => (
                <Select.Option key={key} value={key}>
                  {WarehouseTypeEnum[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="No Of Floors" name="noOfFloors" rules={[{ required: true, message: "Please enter no of floors" }]}>
            <InputNumber style={{ width: "100%" }} placeholder="No of Floors" min={0} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Latitude" name="latitude" rules={[
            { required: true, message: "Please input your latitude" },
            { pattern: /^-?([1-8]?[0-9]|90)(\.\d{1,6})?$/, message: "Invalid latitude. Must be between -90 and 90 with up to 6 decimal places." }
          ]}>
            <Input placeholder="Latitude" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Longitude" name="longitude" rules={[
            { required: true, message: "Please input your longitude" },
            { pattern: /^-?((1[0-7][0-9])|([1-9]?[0-9])|180)(\.\d{1,6})?$/, message: "Invalid longitude. Must be between -180 and 180 with up to 6 decimal places." }
          ]}>
            <Input placeholder="Longitude" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Manager Name" name="managerName" rules={[{ required: true, message: "Please select your Manager Name" }]}>
            <Select placeholder="Select Manager Name" onChange={handleManagerChange}>
              {users.map((user) => (
                <Select.Option key={user.usersId} value={user.name}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Manager Contact" name="managerContact">
            <Input placeholder="Manager Contact" readOnly style={{ backgroundColor: "white" }} />
          </Form.Item>
        </Col>


        <Col xs={24} sm={24} md={{ span: 7, offset: 1 }} lg={{ span: 7, offset: 1 }} xl={{ span: 7, offset: 1 }}>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please Enter Address" }]}>
            <Input.TextArea placeholder="Enter Address" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FGWareHouseForm;
