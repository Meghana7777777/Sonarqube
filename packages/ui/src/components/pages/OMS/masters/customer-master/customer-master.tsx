import { EditOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, CustomerCreateRequest, CustomerIdRequest, CustomerModel } from "@xpparel/shared-models";
import { CustomerSharedService, configVariables } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Image, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tooltip, Upload, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";


export interface ICreateProcessProps {
  updateDetails: (customerData: CustomerModel) => void;
  newWindow: boolean;
}
const CreateCustomer = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new CustomerSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const baseUrl = configVariables.APP_OMS_SERVICE_URL;
  const [fileList, setFileList] = useState<any>([]);
  const [fileCount, setFileCount] = useState(0);
  const [customerId, setCustomerId] = useState(false);

  useEffect(() => {
    getAllCustomers(); 
  }, []);

  const onHandleImage = (imageName) => {
    const imageUrl = `${baseUrl}/oms-customer-files/${imageName}`;
    setSelectedImage(imageUrl);
    setIsModelVisible(true);
  };


  const getAllCustomers = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllCustomers(obj).then((res) => {
      if (res.status) {
        setCustomerData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setCustomerId(false);
    onReset();
    setIsModalOpen(true);
    setIsTitle("Create Customer");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
      setCustomerId(true);
      setSelectedRecord(record);
      setIsModalOpen(true);
      setIsTitle("Update Customer");
      setOkText("Update");
            formRef.setFieldsValue({
        ...record,
        imageName: record.imageName ? [{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-customer-files/${record.imageName}`,
        }] : []
      });
      
      if (record.imageName) {
        setFileList([{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-customer-files/${record.imageName}`,
        }]);
        setFileCount(1);
      }
    } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Customer");
    }
  };



  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
    setFileList([]);

  };

  const deactivateCustomer = (id: number) => {
    const req = new CustomerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactivateCustomer(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      })
      .finally(() => {
        getAllCustomers();
      });
  };

  const customerColumns: ColumnsType<any> = [
    {
      title: "Customer Code",
      dataIndex: "customerCode",
      align: "center",
      key: "customerCode",

    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      align: "center",
      key: "customerName"
    },
    {
      title: "Customer Description",
      dataIndex: "customerDescription",
      align: "center",
      key: "customerDescription"
    },
    {
      title: "Customer Location",
      dataIndex: "customerLocation",
      align: "center",
      key: "customerLocation"
    },
    {
      title: "Customer Image",
      dataIndex: "imageName",
      key: "imageName",
      align:'center',
      render: (text) => (
        <Tooltip title="Image View">
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => onHandleImage(text)}
          />
        </Tooltip>
      ),
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
            onConfirm={(e) => deactivateCustomer(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Customer?"
                : "Are you sure to Activate Customer?"
            }
          >
            <Switch
              size="default"
              checked={record.isActive}
              defaultChecked
              className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onReset = () => {
    formRef.resetFields();
  };

  const uploadImageProps = {
    multiple: false, 
    maxCount: 1,    
    onRemove: (file) => {
      setFileList([]); 
      setFileCount(0);
    },
    beforeUpload: (file) => {
      if (!file.name.match(/\.(jpg|png|jpeg)$/)) {
        message.error("Only image files (JPG, PNG, JPEG) are allowed.");
        return false;
      }
      setFileList([file]); 
      setFileCount(1);
      
      return false; 
    },
    fileList,     
    showUploadList: true,
  };


  const imageFileUpload = (res) => {
      const formData = new FormData();
      formData.append('id', `${res.id}`);
      formData.append('file', fileList[0]); 
      service.customerUpdateImage(formData)
        .then((response) => {
          res.filePath = response.data
          setFileList([]);
          setFileCount(0)
          getAllCustomers();
        }).catch((err) => {
          console.error("Upload failed:", err.message);
          message.error("Failed to upload image.");
        });
  };


  const saveCustomer = (val: any) => {
    formRef.validateFields()
    setDisable(true);
    try {
      const customerModel = new CustomerModel(val.id, val.customerName, val.customerCode, val.customerDescription, val.customerLocation, val.imageName, val.imagePath, val.isActive);
      const req = new CustomerCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [customerModel]);
      service.createCustomer(req).then((res) => {
        if (res.status) {
          imageFileUpload(res.data[0]);
          setIsModalOpen(false);
          getAllCustomers();
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    } finally {
      setDisable(false);
    }
  };

  const save = async () => {
    try {
      const formData = await formRef.validateFields();
      if (selectedRecord) {
        updateCustomer(formData);
      } else {
        saveCustomer(formData);
      }
    } catch (err) {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
    }
  };

  const updateCustomer = (val: any) => {
    const customerModel = new CustomerModel(val.id, val.customerName, val.customerCode, val.customerDescription, val.customerLocation, val.imageName, val.imagePath, val.isActive);
    const req = new CustomerCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [customerModel]);
    service.createCustomer(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Customer Updated Successfully');
        getAllCustomers();
        setIsModalOpen(false);
        imageFileUpload(res.data[0]);
        getAllCustomers();
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
        title="Customers"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={customerData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={customerColumns} bordered />
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
        <Form form={formRef} layout="vertical">
          <Row gutter={16}>
            <Form.Item name="id" hidden>
              <Input hidden />
            </Form.Item>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Customer Code"
                name="customerCode"
                rules={[{ required: true, message: 'Enter the Customer Code' }]}
                required>
                <Input placeholder="Please Enter Customer Code" />

              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{required:true, message: 'Enter the Customer Name' }]}
                required>
                <Input placeholder="Please Enter Customer Name" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Customer Description"
                name="customerDescription"
                rules={[{ message: 'Enter the Customer Description' }]}>
                <Input placeholder="Please Enter Customer Description" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Customer Location"
                name="customerLocation"
                rules={[{ message: 'Enter the Customer Location' }]}
              >

                <Input placeholder="Please Enter Customer Location" />
              </Form.Item>
            </Col>

            <Col >
              <Form.Item
                label="Customer Image"
                name="imageName"
              >
                <Upload.Dragger {...uploadImageProps} accept=".jpg,.png,.jpeg">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Please upload only valid images.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </Modal>
      <Modal
        title="Image Preview"
        open={isModelVisible}
        footer={null}
        onCancel={() => setIsModelVisible(false)}
      >
        <Image
          src={selectedImage}
          alt="Customer Image"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Modal>
    </div>
  );
};

export default CreateCustomer;