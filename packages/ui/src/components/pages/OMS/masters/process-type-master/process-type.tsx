import Icon, { EditOutlined, EyeOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ProcessTypeEnum, processTypeEnumDisplayValues, ProcessTypeCreateRequest, ProcessTypeIdRequest, ProcessTypeModel } from "@xpparel/shared-models";
import { ProcessTypeSharedService, configVariables } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tooltip, Upload, UploadProps, message, Image, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { max } from "class-validator";
import { get } from "http";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";


export interface ICreateProcessProps {
  updateDetails: (processTypeData: ProcessTypeModel) => void;
  newWindow: boolean;
}
const CreateProcessType = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [processTypeData, setProcessTypeData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new ProcessTypeSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const baseUrl = configVariables.APP_OMS_SERVICE_URL;
  const [fileList, setFileList] = useState<any>([]);
  const [fileCount, setFileCount] = useState(0);
  const [processId, setProcessId] = useState(false);


  useEffect(() => {
    getAllProcessType();
  }, []);

  const onHandleImage = (imageName) => {
    const imageUrl = `${baseUrl}/oms-files/${imageName}`;
    setSelectedImage(imageUrl);
    setIsModelVisible(true);
  };



  const getAllProcessType = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllProcessType(obj).then((res) => {
      if (res.status) {
        setProcessTypeData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setProcessId(false);
    onReset();
    setIsModalOpen(true);
    setIsTitle("Create Process Type");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
      setProcessId(true);
      setSelectedRecord(record);
      setIsModalOpen(true);
      setIsTitle("Update Process Type");
      setOkText("Update");
      formRef.setFieldsValue({
        ...record,
        imageName: record.imageName ? [{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-files/${record.imageName}`,
        }] : []
      });

      if (record.imageName) {
        setFileList([{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-files/${record.imageName}`,
        }]);
        setFileCount(1);
      }
    } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Process Type");
    }
  };


  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
    setFileList([]);

  };

  const deactivateProcessType = (id: number) => {
    const req = new ProcessTypeIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;

    service.activateDeactivateProcessType(req)
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
        getAllProcessType();
      });
  };


  const processTypeColumns: ColumnsType<any> = [
    {
      title: "Process Type",
      dataIndex: "processTypeCode",
      align: "center",
      key: "processTypeCode",
      render: (text) => (
        <span>
          {processTypeEnumDisplayValues[text]}
        </span>
      )
    },
    {
      title: "Process Type Name",
      dataIndex: "processTypeName",
      align: "center",
      key: "processTypeName"
    },
    {
      title: "Process Type Description",
      dataIndex: "processTypeDescription",
      align: "center",
      key: "processTypeDescription"
    },
    {
      title: "Process Type Remarks",
      dataIndex: "remarks",
      align: "center",
      key: "remarks"
    },
    {
      title: "Process Type Image",
      dataIndex: "imageName",
      key: "imageName",
      align: 'center',
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
            onConfirm={(e) => deactivateProcessType(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Process Type?"
                : "Are you sure to Activate Process Type?"
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
      service.updateImagePath(formData)
        .then((response) => {
          res.filePath = response.data;
          setFileList([]);
          setFileCount(0);
          getAllProcessType();
        })
        .catch((err) => {
          console.error("Upload failed:", err.message);
          message.error("Failed to upload image.");
        });
  };


  const saveProcessType = (val: any) => {
    setDisable(true);
    try {
      const processTypeModel = new ProcessTypeModel(val.id, val.processTypeName, val.processTypeCode, val.processTypeDescription, val.remarks, val.isActive);
      const req = new ProcessTypeCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processTypeModel]);
      service.createProcessType(req).then((res) => {
        if (res.status) {
          imageFileUpload(res.data[0]);
          setIsModalOpen(false);
          getAllProcessType();
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
        updateProcessType(formData);
      } else {
        saveProcessType(formData);
      }
    } catch (err) {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
    }
  };

  const updateProcessType = (val: any) => {
    const processTypeModel = new ProcessTypeModel(val.id, val.processTypeName, val.processTypeCode, val.processTypeDescription, val.remarks, val.imageName, val.imagePath, val.isActive);
    const req = new ProcessTypeCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processTypeModel]);
    service.createProcessType(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('ProcessType Updated Successfully');   
        setIsModalOpen(false);
        imageFileUpload(res.data[0]);
        getAllProcessType();
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
        title="Process Type"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={processTypeData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={processTypeColumns} bordered />
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
                label="Process Type"
                name="processTypeCode"
                rules={[{ required: true, message: 'Please select Process Type' }]}>
                <Select placeholder="Please select Process Type">
                  {Object.keys(ProcessTypeEnum).map((key) => (
                    <Select.Option key={key} value={ProcessTypeEnum[key]}>
                      {processTypeEnumDisplayValues[key]}
                    </Select.Option>
                  ))}s
                </Select>
              </Form.Item> 
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Process Type Name"
                name="processTypeName"
                rules={[{ message: 'Enter the Process Type Name' }]}>
                <Input placeholder="Please Enter Process Type Name" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Process Type Description"
                name="processTypeDescription"
                rules={[{ message: 'Enter the Process Type Description' }]}>
                <Input placeholder="Please Enter Process Type Description" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Process Type Remarks"
                name="remarks"
                rules={[{ message: 'Enter the Process Type Remarks' }]}>
                <Input placeholder="Please Enter Process Type Remarks" />
              </Form.Item>
            </Col>

            <Col >
              <Form.Item
                label="Process Type Image"
                name="imageName" >
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
          alt="Process Type Image"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Modal>
    </div>
  );
};

export default CreateProcessType;