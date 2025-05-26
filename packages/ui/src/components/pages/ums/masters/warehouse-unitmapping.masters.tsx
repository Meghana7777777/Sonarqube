import React, { useEffect, useState } from "react";
import Icon, { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Space, Switch, Table, Row, Col, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlertMessages } from "packages/ui/src/components/common";
import { CommonRequestAttrs,WarehouseUnitmappingCreateRequest,WarehouseUnitmappingIdRequest,WarehouseUnitmappingModel, WarehouseUnitmappingResponse } from "@xpparel/shared-models";
import { WarehouseUnitmappingSharedService, WarehouseSharedService, UnitsSharedService, CompanySharedService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

const CreateWarehouseUnitmapping = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [warehouseUnitmappingData, setWarehouseUnitmappingData] = useState<any[]>([]);
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  const [unitsData, setUnitsData] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new WarehouseUnitmappingSharedService();
  const warehouseService = new WarehouseSharedService();
  const unitsService = new UnitsSharedService();
  const companyService = new CompanySharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [warehouseUnitmappingId,setWarehouseUnitmappingId] = useState(false);

  useEffect(() => {
    getWarehouseUnitmapping();
    getWarehouse();
    getUnits();
    getCompany();
  }, []);

  const getWarehouseUnitmapping = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getWarehouseUnitmapping(obj).then((res) => {
      if (res.status) {
        setWarehouseUnitmappingData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);

      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const getWarehouse = () => {
    warehouseService.getWarehouse().then((res) => {
      if (res.status) {
        setWarehouseData(res.data);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const getUnits = () => {
    unitsService.getUnits().then((res) => {
      if (res.status) {
        setUnitsData(res.data);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const getCompany = () => {
    companyService.getCompany().then((res) => {
      if (res.status) {
        setCompanyData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setWarehouseUnitmappingId(false)
    setIsModalOpen(true);
    setIsTitle("Create Warehouse Unit Mapping");
    setOkText("Create");
    setSelectedRecord(null);
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
    setWarehouseUnitmappingId(true)
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Warehouse Unit Mapping");
    setOkText("Update");
    formRef.setFieldsValue(record);
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Warehouse Unit Mapping");
  }
  };

  const handleCancel = () => {
    setSelectedRecord(null);
    onReset()
    setIsModalOpen(false);
    
  };

  const deactivateWarehouseUnitmapping = (id: number) => {
    const req = new WarehouseUnitmappingIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    req.id = id;
    service.activeDeactiveWarehouseUnitmapping(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getWarehouseUnitmapping();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const warehouseUnitmappingColumns: ColumnsType<any> = [
    {
      title: "Warehouse Code",
      dataIndex: "warehouseCode",
      align: "center",
      key: "warehouseCode"
    },
    {
      title: "Unit Code",
      dataIndex: "unitsCode",
      align: "center",
      key: "unitsCode"
    },
    {
      title: "Company Code",
      dataIndex: "companysCode",
      align: "center",
      key: "companysCode"
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
            onConfirm={(e) => deactivateWarehouseUnitmapping(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Warehouse Unit Mapping?"
                : "Are you sure to Activate Warehouse Unit Mapping?"
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

  const saveWarehouseUnitmapping = (val: any) => {
    setDisable(true);
    const warehouseUnitmappingmodel = new WarehouseUnitmappingModel(val.id,val.warehouseCode,val.unitsCode,val.companysCode,val.isActive );
    const req = new WarehouseUnitmappingCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[warehouseUnitmappingmodel]);
    service.createWarehouseUnitmapping(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Warehouse Unit Mapping Created Successfully');
        setIsModalOpen(false);

        getWarehouseUnitmapping();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    setDisable(false);
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
        updateWarehouseUnitmapping(formData);
      } else {
        saveWarehouseUnitmapping(formData);
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const updateWarehouseUnitmapping = (val: any) => {
    const warehouseUnitmappingmodel = new WarehouseUnitmappingModel(val.id,val.warehouseCode,val.unitsCode,val.companysCode,val.isActive );
    const req = new WarehouseUnitmappingCreateRequest(user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,[warehouseUnitmappingmodel]);

    service.createWarehouseUnitmapping(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Warehouse Unit Mapping Updated Successfully');
        onReset();
        setIsModalOpen(false);
        getWarehouseUnitmapping();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false);
        AlertMessages.getErrorMessage(err.message);
      });
  };

  return (
    <div>
      <Card
        title="Warehouse Unitmapping"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>}>
        <Table dataSource={warehouseUnitmappingData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={warehouseUnitmappingColumns} bordered />
      </Card>
      <Modal
        title= {<span
          style={{ textAlign: "center", display: "block", margin: "5px 0px" }}> {isTitle}</span>}
        // style={{ textAlign: "center" }}
        width={700}
        open={isModalOpen}
        onOk={save}
        okText={okText}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}>
       
        <Form form={formRef}  layout="vertical">
          <Form.Item style={{ display: 'none' }} name="id">
            <Input type="hidden" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Warehouse Code"
                name="warehouseCode"
                rules={[{ required: true, message: 'Select the Warehouse Code' }]}>
                <Select placeholder="Select Warehouse Code">
                  {warehouseData.map((warehouse) => (
                    <Select.Option key={warehouse.warehouseCode} value={warehouse.warehouseCode}>
                      {warehouse.warehouseCode}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Unit Code"
                name="unitsCode"
                rules={[{ required: true, message: 'Select the Unit Code' }]}>
                <Select placeholder="Select Unit Code">
                  {unitsData.map((unit) => (
                    <Select.Option key={unit.code} value={unit.code}>
                      {unit.code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Company Code"
                name="companysCode"
                rules={[{ required: true, message: 'Select the Company Code' }]}>
                <Select placeholder="Select Company Code">
                  {companyData.map((company) => (
                    <Select.Option key={company.code} value={company.code}>
                      {company.code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateWarehouseUnitmapping;