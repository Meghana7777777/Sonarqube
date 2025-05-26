
import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Space, Switch, Table, Row, Col } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "packages/ui/src/components/common";
import { CommonRequestAttrs, UnitsCreateRequest, UnitsIdRequest, UnitsModel, UnitsResponse } from "@xpparel/shared-models";
import { UnitsSharedService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

interface GeocodeResult {
  lat: number;
  lng: number;
}

const CreateUnits = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [unitsData, setUnitsData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new UnitsSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<GeocodeResult | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  const [location, setLocation] = useState<string>("");
  const [unitsId,setUnitsId] = useState(false);



  useEffect(() => {
    getUnits();
  }, []);

  const getUnits = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getUnits(obj).then((res) => {
      if (res.status) {
        setUnitsData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);

      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setUnitsId(false)
    setIsModalOpen(true);
    setIsTitle("Create Unit");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
    setUnitsId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Unit");
    setOkText("Update");
    formRef.setFieldsValue(record);
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Unit");
  }
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();UnitsIdRequest
  };

  const deactivateUnit = (id: number) => {
    const req = new UnitsIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    service.activeDeactiveUnits(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getUnits();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const unitsColumns: ColumnsType<any> = [
    {
      title: "Unit Name",
      dataIndex: "unitName",
      align: "center",
      key: "unitName"
    },
    {
      title: "Unit Code",
      dataIndex: "code",
      align: "center",
      key: "code"
    },
    {
      title: "Company Code",
      dataIndex: "companysCode",
      align: "center",
      key: "companysCode"
    },
    {
      title: "Unit Location",
      dataIndex: "location",
      align: "center",
      key: "location"
    },
    {
      title: "Unit Address",
      dataIndex: "address",
      align: "center",
      key: "address"
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
            onConfirm={(e) => deactivateUnit(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Unit?"
                : "Are you sure to Activate Unit?"
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

  const saveUnit = (val: any) => {
    setDisable(true);
    const unitmodel = new UnitsModel(val.id,val.unitName,val.code,val.companysCode,val.location,val.address, val.isActive,val.latitude,val.longitude,);
    const req = new UnitsCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[unitmodel]);
    service.createUnits(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Unit Created Successfully');
        setIsModalOpen(false);
        getUnits();
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
        updateUnit(formData);
      } else {
        saveUnit(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const updateUnit = (val: any) => {
    const unitmodel = new UnitsModel( val.id, val.unitName,val.code,val.companysCode,val.location,val.address,val.isActive,val.latitude,val.longitude, );
    const req = new UnitsCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[unitmodel]);

    service.createUnits(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Unit Updated Successfully');
        onReset();
        setIsModalOpen(false);
        getUnits();
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
        title="Units"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={unitsData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={unitsColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}} />
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
        <Form form={formRef}layout="vertical">
          <Form.Item style={{ display: 'none' }} name="id">
            <Input type="hidden" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Unit Name"
                name="unitName"
                rules={[{ required: true, message: 'Enter the Unit Name' }]}>
                <Input  placeholder="Please Enter Unit Name" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Enter the Unit Code' }]}>
                <Input placeholder="Please Enter Unit Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Code"
                name="companysCode"
                rules={[{ required: true, message: 'Enter the Company Code' }]}>
                <Input placeholder="Please Enter Company Code" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Unit Address"
                name="address"
                rules={[{ required: true, message: 'Enter the Unit Address' }]}>
                <Input placeholder="Please Enter Unit Address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Unit Location"
                name="location"
                rules={[{ required: true, message: 'Enter the Unit Location' }]}>
                <Input placeholder="Please Enter Unit Location"
                 onChange={(e) => handleLocationChange(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[{ required: true, message: 'Latitude is required' }]}>
                <Input placeholder="latitude" readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[{ required: true, message: 'Longitude is required' }]}>
                <Input placeholder="longitude" readOnly />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}
             style={{ marginTop: '30px', marginBottom: '30px' }}>
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

export default CreateUnits;