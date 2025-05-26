import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Space, Switch, Table, Row, Col, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "packages/ui/src/components/common";
import { CommonRequestAttrs, WarehouseCreateRequest, WarehouseIdRequest, WarehouseModel, WarehouseResponse, WarehouseTypeEnum } from "@xpparel/shared-models";
import { WarehouseSharedService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

interface GeocodeResult {
  lat: number;
  lng: number;
}

const CreateWarehouse = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new WarehouseSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<GeocodeResult | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  const [location, setLocation] = useState<string>("");
  const [warehouseId,setWarehouseId] = useState(false);


  useEffect(() => {
    getWarehouse();
  }, []);

  const getWarehouse = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getWarehouse(obj).then((res) => {
      if (res.status) {
        setWarehouseData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);

      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setWarehouseId(false)
    setIsModalOpen(true);
    setIsTitle("Create Warehouse");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
    setWarehouseId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Warehouse");
    setOkText("Update");
    formRef.setFieldsValue(record);
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Warehouse");
  }
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };

  const deactivateWarehouse = (id: number) => {
    const req = new WarehouseIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactiveWarehouse(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getWarehouse();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const warehouseColumns: ColumnsType<any> = [
    {
      title: "Warehouse Name",
      dataIndex: "warehouseName",
      align: "center",
      key: "warehouseName"
    },
    {
      title: "Warehouse Code",
      dataIndex: "warehouseCode",
      align: "center",
      key: "warehouseCode"
    },
    {
      title: "Company Code",
      dataIndex: "companysCode",
      align: "center",
      key: "companysCode"
    },
    {
      title: "Warehouse Location",
      dataIndex: "location",
      align: "center",
      key: "location"
    },
    {
      title: "Warehouse Address",
      dataIndex: "address",
      align: "center",
      key: "address"
    },
    {
      title: "Warehouse Type",
      dataIndex: "warehouseType",
      align: "center",
      key: "warehouseType"
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      align: "center",
      key: "latitude"
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      align: "center",
      key: "longitude"
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Space>
          <EditOutlined onClick={() => editShowModal(record)} />
          <Divider type="vertical" />
          <Popconfirm
            onConfirm={(e) => deactivateWarehouse(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Warehouse?"
                : "Are you sure to Activate Warehouse?"
            }
          >
            <Switch
              size="default"
              checked={record.isActive}
              defaultChecked
              className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onReset = () => {
    formRef.resetFields();
  };

  const saveWarehouse = (val: any) => {
    setDisable(true);
    const warehousemodel = new WarehouseModel(val.id,val.warehouseName,val.warehouseCode,val.companysCode,val.location,val.address,val.warehouseType,val.isActive,val.latitude,val.longitude );
    const req = new WarehouseCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[warehousemodel]);
    service.createWarehouse(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Warehouse Created Successfully');
        setIsModalOpen(false);
        getWarehouse();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false);
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const save = async () => {
    try {
      const formData = await formRef.validateFields();
      if (selectedRecord) {
        updateWarehouse(formData);
      } else {
        saveWarehouse(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const updateWarehouse = (val: any) => {
    const warehousemodel = new WarehouseModel(val.id,val.warehouseName,val.warehouseCode,val.companysCode,val.location,val.address,val.warehouseType,val.isActive,val.latitude,val.longitude );
    const req = new WarehouseCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[warehousemodel]);

    service.createWarehouse(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Warehouse Updated Successfully');
        onReset();
        setIsModalOpen(false);
        getWarehouse();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false);
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const API_KEY = "5ce14265ca1eb4d073403314d72a8d45"; 
  const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";

  const fetchGeocodeData = async (cityName: string) => {
    setLoading(true);
    setError(null); 
  
    try {
      const response = await fetch(
        `${GEOCODE_URL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.length > 0) {
        const result = data[0];
        setCoordinates({
          lat: result.lat,
          lng: result.lon,
        });
        formRef.setFieldsValue({
          latitude: result.lat,
          longitude: result.lon,
        });
      } else {
        setError("No results found for the provided city name.");
      }
    } catch (err) {
      setError(`Error occurred while fetching data: ${err.message}`);
    } finally {
      setLoading(false); 
    }
  };
  

  const handleLocationChange = (value: string) => {
    setLocation(value); 
  };

  return (
    <div>
      <Card
        title="Warehouse"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={warehouseData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={warehouseColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}} />
      </Card>
      <Modal
        title= {<span
          style={{ textAlign: "center", display: "block", margin: "5px 0px" }}> {isTitle}</span>}
        width={800}
        open={isModalOpen}
        onOk={save}
        okText={okText}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        <Form form={formRef}  layout="vertical">
          <Form.Item style={{ display: 'none' }} name="id">
            <Input type="hidden" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Name"
                name="warehouseName"
                rules={[{ required: true, message: 'Enter the Warehouse Name' }]}>
                <Input placeholder="Please Enter Warehouse Name" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Code"
                name="warehouseCode"
                rules={[{ required: true, message: 'Enter the Warehouse Code' }]}>
                <Input placeholder="Please Enter Warehouse Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Code"
                name="companysCode"
                rules={[{ required: true, message: 'Enter the Company\'s Code' }]}>
                <Input placeholder="Please Enter Company Code" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Location"
                name="location"
                rules={[{ required: true, message: 'Enter the Warehouse Location' }]}>
                <Input placeholder="Please Enter Warehouse Location"
                 onChange={(e) => handleLocationChange(e.target.value)}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Address"
                name="address"
                rules={[{ required: true, message: 'Enter the Warehouse Address' }]}>
                <Input placeholder="Please Enter Address" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Type"
                name="warehouseType"
                rules={[{ required: true, message: 'Select the Warehouse Type' }]}>
                <Select placeholder="Select Warehouse Type">
                  {Object.values(WarehouseTypeEnum).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[{ required: true, message: 'Latitude is required' }]}>
                <Input placeholder="latitude" readOnly />
              </Form.Item>
            </Col>
      
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[{ required: true, message: 'Longitude is required' }]}>
                <Input placeholder="longitude" readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row  gutter={16} >
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Button type="primary" onClick={() => fetchGeocodeData(location)} loading={loading}>
                Get Coordinates
              </Button>
            </Col>
          </Row>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Form>
      </Modal>
    </div>
  );
};

export default CreateWarehouse;