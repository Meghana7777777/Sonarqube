import Icon, { EditOutlined, EyeOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ProductsCreateRequest, ProductsIdRequest, ProductsModel } from "@xpparel/shared-models";
import { configVariables, ProductSharedService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tooltip, Upload, message, Image } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

const ProductMaster = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [productData, setProductData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new ProductSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const baseUrl = configVariables.APP_OMS_SERVICE_URL;
  const [fileList, setFileList] = useState<any>([]);
  const [fileCount, setFileCount] = useState(0);
  const [productId, setProductId] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const onHandleImage = (imageName) => {
    const imageUrl = `${baseUrl}/oms-products-files/${imageName}`;
    setSelectedImage(imageUrl);
    setIsModelVisible(true);
  };



  const getAllProducts = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllProducts(obj).then((res) => {
      if (res.status) {
        setProductData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setProductId(false);
    onReset();
    setIsModalOpen(true);
    setIsTitle("Create Product");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
    setProductId(true);
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Product");
    setOkText("Update");
          formRef.setFieldsValue({
      ...record,
      imageName: record.imageName ? [{
        uid: '-1',
        name: record.imageName,
        status: 'done',
        url: `${baseUrl}/oms-products-files/${record.imageName}`,
      }] : []
      });

      if (record.imageName) {
      setFileList([{
        uid: '-1',
        name: record.imageName,
        status: 'done',
        url: `${baseUrl}/oms-products-files/${record.imageName}`,
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

  const deactivateProduct = (id: number) => {
    const req = new ProductsIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;

    service.activateDeactivateProduct(req)
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
        getAllProducts();
      });
  };

  const productColumns: ColumnsType<any> = [
    {
      title: "Product Name",
      dataIndex: "productName",
      align: "center",
      key: "productName"
    },
    {
      title: "Product Code",
      dataIndex: "productCode",
      align: "center",
      key: "productCode"
    },
    {
      title: "Product Description",
      dataIndex: "description",
      align: "center",
      key: "description"
    },
    {
      title: "Product Image",
      dataIndex: "imageName",
      key: "imageName",
      align: "center",
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
            onConfirm={(e) => deactivateProduct(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Product?"
                : "Are you sure to Activate Product?"
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
      service.updateProductImage(formData)
      .then((response) => {
        res.filePath = response.data;
        setFileList([]);
        setFileCount(0);
        getAllProducts();
      }) .catch((err) => {
        console.error("Upload failed:", err.message);
        message.error("Failed to upload image.");
      });
  };

  const saveProduct = (val: any) => {
    setDisable(true);
    try {
      const productsModel = new ProductsModel(val.id, val.productName, val.productCode, val.description, val.image, val.isActive);
      const req = new ProductsCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [productsModel]);
      service.createProduct(req).then((res) => {
        if (res.status) {
          imageFileUpload(res.data[0]);
          setIsModalOpen(false);
          getAllProducts();
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
        updateProduct(formData);
      } else {
        saveProduct(formData);
      }
    } catch (err) {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
    }
  };

  const updateProduct = (val: any) => {
    const productsModel = new ProductsModel(val.id, val.productName, val.productCode, val.description, val.image, val.isActive);
    const req = new ProductsCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [productsModel]);
    service.createProduct(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage("Product Updated Successfully");
        getAllProducts()
        setIsModalOpen(false);
        imageFileUpload(res.data[0]);
        getAllProducts();
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
        title="Products"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={productData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={productColumns} bordered />
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
                label="Product Name"
                name="productName"
                rules={[{ required: true, message: "Enter the Product Name" }]}>
                <Input placeholder="Please Enter Product Name" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Product Code"
                name="productCode"
                rules={[{ required: true, message: "Enter the Product Code" }]}>
                <Input placeholder="Please Enter Product Code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Product Description"
                name="description"
                rules={[{ required: true, message: "Enter the Product Description" }]}>
                <Input placeholder="Please Enter Product Description" />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Product Image"
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
          alt="Product Image"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Modal>
    </div>
  );
};

export default ProductMaster;