import Icon, { EditOutlined, EyeOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ProcessTypeEnum, processTypeEnumDisplayValues, ProcessTypeCreateRequest, ProcessTypeIdRequest, ProcessTypeModel } from "@xpparel/shared-models";
import { ProcessTypeSharedService, configVariables } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tooltip, Upload, UploadProps, message, Image, Select } from "antd";
import { ColumnsType } from "antd/es/table";
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
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [fileCount, setFileCount] = useState(0);
  const [processId, setProcessId] = useState(false);

  useEffect(() => {
    getProcessType();
  }, []);

  const onHandleImage = (imageName) => {
    const imageUrl = `${baseUrl}/oms-files/${imageName}`;
    console.log(imageUrl, 'imageUrl');
    setSelectedImage(imageUrl);
    setIsModelVisible(true);
};


  const getProcessType = () => {
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
    setProcessId(true);
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Process Type");
    setOkText("Update");
    formRef.setFieldsValue(record);
  };

  

  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };

  const deactivateProcessType = (id: number) => {
    const req = new ProcessTypeIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactivateProcessType(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getProcessType();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const processTypeColumns: ColumnsType<any> = [
    {
      title: "ProcessType",
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
      title: "ProcessType Name",
      dataIndex: "processTypeName",
      align: "center",
      key: "processTypeName"
    },
    {
      title: "Description",
      dataIndex: "processTypeDescription",
      align: "center",
      key: "processTypeDescription"
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      align: "center",
      key: "remarks"
    },
    {
      title: "Image",
      dataIndex: "imageName",
      key: "imageName",
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

  const uploadImageProps = {
    multiple: true,
    onRemove: file => {
      setFileList(prev => {
        const updatedList = prev.filter(rec => rec.uid !== file.uid);
        setFileCount(updatedList.length);
        return updatedList;
      });
    },
    beforeUpload: file => {
      if (!file.name.match(/\.(jpg|png|jpeg)$/)) {
        message.error("Only image files are allowed.");
        return false;
      }
      setFileList(prev => {
        const updatedList = [...prev, file];
        setFileCount(updatedList.length);
        return updatedList;
      });
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList,
    showUploadList: true,
  };

  const imageFileUpload = (res) => {
    if (fileList.length > 0) {
      const formData = new FormData();
      const files = fileList
      if (files) {
        formData.append('id', `${res.id}`)
        console.log(res.id, 'res.id');
        files.forEach((file: any) => {
          formData.append('file', file);
        });
      }
      service.updateImagePath(formData).then((file) => {
        res.filePath = file.data
        getProcessType();
      }).catch(err => console.log(err.message))
    }
  };


  const saveProcessType =  (val: any) => {
    setDisable(true);
    try {
      const processTypeModel = new ProcessTypeModel(val.id, val.processTypeName, val.processTypeCode, val.processTypeDescription,val.remarks,val.isActive);
      const req = new ProcessTypeCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processTypeModel]);
       service.createProcessType(req).then((res) => {
        if (res.status) {
          console.log(res);
          imageFileUpload(res.data[0]);
          setIsModalOpen(false);
          AlertMessages.getErrorMessage(res.internalMessage);
        } else {
          console.log("err");
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
      console.error("Validation Failed:", err);
    }
  };

  const updateProcessType = (val: any) => {
    const processTypeModel = new ProcessTypeModel(val.id, val.processTypeName, val.processTypeCode, val.processTypeDescription, val.remarks,val.imageName, val.imagePath,val.isActive);
    const req = new ProcessTypeCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processTypeModel]);
    service.createProcessType(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Process Type Updated Successfully');
        setIsModalOpen(false);
        imageFileUpload(res.data[0]);
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
          columns={processTypeColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}}/>
      </Card>
      <Modal
        title={isTitle}
        width={800}
        open={isModalOpen}
        onOk={save}
        okText={okText}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        <Form form={formRef}  layout="vertical">
          <Row gutter={16}>
            <Form.Item name="id" hidden>
              <Input hidden />
            </Form.Item>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Form.Item
            label="ProcessType"
            name="processTypeCode"
            rules={[{  message: 'Please select an operation category' }]}>
            <Select placeholder="Please select an operation category">
             {Object.keys(ProcessTypeEnum).map((key) => (
            <Select.Option key={key} value={ProcessTypeEnum[key]}>
            {processTypeEnumDisplayValues[key]}
            </Select.Option>
            ))}
            </Select>
          </Form.Item>
            </Col>
            
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="ProcessType Name"
                name="processTypeName"
                rules={[{  message: 'Enter the Process Type Name' }]}>
                <Input placeholder="Please Enter Process Type Name" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Description"
                name="processTypeDescription"
                rules={[{  message: 'Enter the Description' }]}>
                <Input placeholder="Please Enter Description" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Remarks"
                name="remarks"
                rules={[{  message: 'Enter the Remarks' }]}>
                <Input placeholder="Please Enter Remarks" />
              </Form.Item>
            </Col>

            <Col >
              <Form.Item
                label="Image"
                name="imageName"
                rules={[{ required: true, message: 'Enter the Image URL' }]}
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
              alt="Process Type Image"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
      </Modal>
    </div>
  );
};

export default CreateProcessType;