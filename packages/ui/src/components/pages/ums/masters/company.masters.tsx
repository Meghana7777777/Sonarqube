import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Space, Switch, Table, Row, Col } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "packages/ui/src/components/common";
import { CommonRequestAttrs, CompanyCreateRequest, CompanyIdRequest, CompanyModel } from "@xpparel/shared-models";
import { CompanySharedService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

interface GeocodeResult {
  lat: number;
  lng: number;
}

const CreateCompany = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new CompanySharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<GeocodeResult | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  const [location, setLocation] = useState<string>("");
  const [companyId, setCompanyId] = useState(false);

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getCompany(obj).then((res) => {
      if (res.status) {
        setCompanyData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);

      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setCompanyId(false)
    onReset()
    setIsModalOpen(true);
    setIsTitle("Create Company");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => { 
    if (record.isActive) {
    setCompanyId(true);
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Company");
    setOkText("Update");
    formRef.setFieldsValue(record);
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Company");
  }
  };

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };

  const deactivateCompany = (id: number) => {
    const req = new CompanyIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactiveCompany(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getCompany();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        //AlertMessages.getErrorMessage(err.message);
      });
  };

  const companyColumns: ColumnsType<any> = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      align: "center",
      key: "companyName"
    },
    {
      title: "Company Code",
      dataIndex: "code",
      align: "center",
      key: "code"
    },
    {
      title: "Company Location",
      dataIndex: "location",
      align: "center",
      key: "location"
    },
    {
      title: "Company Address",
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
            onConfirm={(e) => deactivateCompany(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Company?"
                : "Are you sure to Activate Company?"
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

  const saveCompany = (val: any) => {
    setDisable(true);
    const companyModel = new CompanyModel(  val.id, val.companyName, val.code, val.location, val.address, val.isActive,val.latitude,val.longitude);
    const req = new CompanyCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[companyModel]);
    
    service.createCompany(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Company Created Successfully');
        setIsModalOpen(false);
        getCompany();
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
        updateCompany(formData);
      } else {
        saveCompany(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const updateCompany = (val: any) => {
    const companyModel = new CompanyModel(val.id, val.companyName, val.code, val.location, val.address, val.isActive,val.latitude,val.longitude);
    const req = new CompanyCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[companyModel]);
    service.createCompany(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Company Updated Successfully');
        setIsModalOpen(false);
        getCompany();
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
        title="Company"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={companyData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={companyColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}} />
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
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: 'Enter the Company Name' }]}>
                <Input  placeholder="Please Enter Company Name" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Code"
                name="code"
                rules={[{ required: true, message: 'Enter the Company Code' }]}>
                <Input placeholder="Please Enter Company Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Address"
                name="address"
                rules={[{ required: true, message: 'Enter The Company Address' }]}>
                <Input placeholder="Please Enter Company address" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Location"
                name="location"
                rules={[{ required: true, message: 'Enter The Company Location' }]}>
                <Input placeholder="Please Enter Company location" 
                 onChange={(e) => handleLocationChange(e.target.value)}
                />
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

export default CreateCompany;