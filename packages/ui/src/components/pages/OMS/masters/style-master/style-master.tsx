import Icon, { EditOutlined, EyeOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ProcessTypeEnum, StyleCreateRequest, StyleIdRequest, StyleModel, processTypeEnumDisplayValues } from "@xpparel/shared-models";
import { configVariables, StyleSharedService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tooltip, Upload, message, Image, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

const { Option } = Select;
const CreateStyle = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [styleData, setStyleData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new StyleSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const baseUrl = configVariables.APP_OMS_SERVICE_URL;
  const [fileList, setFileList] = useState<any>([]);
  const [fileCount, setFileCount] = useState(0);
  const [styleId, setStyleId] = useState(false);


  useEffect(() => {
    getAllStyles();
  }, []);

  const onHandleImage = (imageName) => {
    const imageUrl = `${baseUrl}/oms-style-files/${imageName}`;
    setSelectedImage(imageUrl);
    setIsModelVisible(true);
  };



  const getAllStyles = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllStyles(obj).then((res) => {
      if (res.status) {
        setStyleData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setStyleId(false);
    onReset();
    setIsModalOpen(true);
    setIsTitle("Create Style");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
      setStyleId(true);
      setSelectedRecord(record);
      setIsModalOpen(true);
      setIsTitle("Update Style");
      setOkText("Update");
      formRef.setFieldsValue({
        ...record,
        imageName: record.imageName ? [{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-style-files/${record.imageName}`,
        }] : []
      });

      if (record.imageName) {
        setFileList([{
          uid: '-1',
          name: record.imageName,
          status: 'done',
          url: `${baseUrl}/oms-style-files/${record.imageName}`,
        }]);
        setFileCount(1);
      }
    } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Style");
    }
  };


  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
    setFileList([]);
  };


  const deactivateStyle = (id: number) => {
    const req = new StyleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactivateStyle(req)
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
        getAllStyles();
      });
  };


  const styleColumns: ColumnsType<any> = [
    {
      title: "Style Name",
      dataIndex: "styleName",
      align: "center",
      key: "styleName"
    },
    {
      title: "Style Code",
      dataIndex: "styleCode",
      align: "center",
      key: "styleCode"
    },
    {
      title: "Style Description",
      dataIndex: "description",
      align: "center",
      key: "description"
    },
    {
      title: "Process Type",
      dataIndex: "processType",
      align: "center",
      render: (v) => processTypeEnumDisplayValues[v] || ''
    },
    {
      title: "Style Image",
      dataIndex: "imageName",
      align: "center",
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
          <EditOutlined onClick={() => editShowModal(record)}
          />
          <Divider type="vertical" />
          <Popconfirm
            onConfirm={(e) => deactivateStyle(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Style?"
                : "Are you sure to Activate Style?"
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
    service.styleUpdateImage(formData)
      .then((response) => {
        res.filePath = response.data;
        setFileList([]);
        setFileCount(0)
        getAllStyles();
      }).catch((err) => {
        console.error("Upload failed:", err.message);
        message.error("Failed to upload image.");
      });
  };

  const saveStyle = (val: any) => {
    setDisable(true);
    try {
      const styleModel = new StyleModel(val.id, val.styleName, val.styleCode, val.description, val.processType, val.image, val.isActive);
      const req = new StyleCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [styleModel]);
      service.createStyle(req).then((res) => {
        if (res.status) {
          imageFileUpload(res.data[0]);
          setIsModalOpen(false);
          getAllStyles();
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      });
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
        updateStyle(formData);
      } else {
        saveStyle(formData);
      }
    } catch (err) {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
    }
  };

  const updateStyle = (val: any) => {
    const styleModel = new StyleModel(val.id, val.styleName, val.styleCode, val.description, val.processType, val.imageName, val.imagePath, val.isActive);
    const req = new StyleCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [styleModel]);
    service.createStyle(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage("Style Updated Successfully");
        setIsModalOpen(false);
        imageFileUpload(res.data[0]);
        getAllStyles();
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
        title="Styles"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={styleData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={styleColumns} bordered />
      </Card>
      <Modal
        title={<span
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
                label="Style Name"
                name="styleName"
                rules={[{ required: true, message: "Enter the Style Name" }]}>
                <Input placeholder="Please Enter Style Name" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Style Code"
                name="styleCode"
                rules={[{ required: true, message: "Enter the Style Code" }]}>
                <Input placeholder="Please Enter Style Code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Style Description"
                name="description"
                rules={[{ required: true, message: "Enter the Style Description" }]}>
                <Input placeholder="Please Enter Style Description" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Process Type"
                name="processType"
                rules={[{ required: true, message: "Select Process Type" }]}>
                <Select style={{ width: '100%' }} placeholder='Select Process Type'>
                  <Option value={ProcessTypeEnum.CUT}>{processTypeEnumDisplayValues[ProcessTypeEnum.CUT]}</Option>
                  <Option value={ProcessTypeEnum.KNIT}>{processTypeEnumDisplayValues[ProcessTypeEnum.KNIT]}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Style Image"
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
          alt="Style Image"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Modal>
    </div>
  );
};

export default CreateStyle;