import Icon, { EditOutlined } from "@ant-design/icons";
import { BomItemTypeEnum, CommonRequestAttrs, ItemCreateRequest, ItemIdRequest, ItemModel, PhItemCategoryEnum } from "@xpparel/shared-models";
import { ItemSharedService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, Row, Select, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

const CreateBomItem = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [itemData, setItemData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [okText, setOkText] = useState("");
  const service = new ItemSharedService();
  const [disable, setDisable] = useState<boolean>(false);
  const [itemId,setItemId] = useState(false);



  useEffect(() => {
    getAllItem();
  }, []);

  const getAllItem = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllItem(obj).then((res) => {
      if (res.status) {
        setItemData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch((err) => {
      //AlertMessages.getErrorMessage(err.message);
    });
  };

  const createShowModal = () => {
    setItemId(false);
    onReset();
    setIsModalOpen(true);
    setIsTitle("Create BOM Item");
    setOkText("Create");
    formRef.resetFields();
  };

  const editShowModal = (record: any) => {
    if (record.isActive) {
    setItemId(true);
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update BOM Item");
    setOkText("Update");
    formRef.setFieldsValue(record);
  } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated BomItem");
  }
  };

  const handleCancel = () => {
    formRef.resetFields();
    setSelectedRecord(undefined);
    setIsModalOpen(false);
  };

  const deactivateItem = (id: number) => {
    const req = new ItemIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, id);
    req.id = id;
    service.activateDeactivateItem(req)
      .then((res) => {
        console.log(res.data, 'pppp');

        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getAllItem();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const itemColumns: ColumnsType<any> = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      align: "center",
      key: "itemName"
    },
    {
      title: "Item Code",
      dataIndex: "itemCode",
      align: "center",
      key: "itemCode"
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      align: "center",
      key: "itemDescription"
    },
    {
      title: "Item SKU",
      dataIndex: "itemSku",
      align: "center",
      key: "itemSku"
    },
     {
      title: "RM Item Type",
      dataIndex: "rmItemType",
      align: "center",
      key: "rmItemType",
      render: (text) => (
        <span>
          {text}
        </span>
      )
    },
    {
      title: "BOM Item Type",
      dataIndex: "bomItemType",
      align: "center",
      key: "bomItemType",
      render: (text) => (
        <span>
         {text}
        </span>
      )
    },
    {
      title: "Item Color",
      dataIndex: "itemColor",
      align: "center",
      key: "itemColor"
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
            onConfirm={(e) => deactivateItem(record.id)}
            title={
              record.isActive
                ? "Are you sure to Deactivate Item?"
                : "Are you sure to Activate Item?"
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

  const saveItem = (val: any) => {
    setDisable(true);
    const itemModel = new ItemModel(val.id, val.itemName, val.itemCode, val.itemDescription, val.itemSku, val.isActive, val.rmItemType,val.bomItemType, val.itemColor);
    const req = new ItemCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [itemModel]);
    service.createItem(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Item Created Successfully');
        setIsModalOpen(false);
        getAllItem();
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
        updateItem(formData);
      } else {
        saveItem(formData);
      }
    } catch (err) {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
    }
  };

  const updateItem = (val: any) => {
    const itemModel = new ItemModel(val.id, val.itemName, val.itemCode, val.itemDescription, val.itemSku, val.isActive, val.rmItemType,val.bomItemType, val.itemColor);
    const req = new ItemCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [itemModel]);

    service.createItem(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Item Updated Successfully');
        setIsModalOpen(false);
        getAllItem();
        formRef.resetFields();
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
        title="BOM Items"
        extra={
          <Space>
            <Button type="primary" onClick={createShowModal}>
              Create
            </Button>
          </Space>
        }
      >
        <Table dataSource={itemData.map((item) => ({ ...item, key: item.id }))}
          size="small"
          columns={itemColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}}/>
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
        key={Date.now()}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        <Form form={formRef} layout="vertical">
          <Form.Item style={{ display: 'none' }} name="id" hidden>
            <Input hidden />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Item Name"
                name="itemName"
                rules={[{ required: true, message: 'Enter the Item Name' }]}>
                <Input placeholder="Please Enter Item Name" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Item Code"
                name="itemCode"
                rules={[{ required: true, message: 'Enter the Item Code' }]}>
                <Input placeholder="Please Enter Item Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Item Description"
                name="itemDescription"
                rules={[{ required: true, message: 'Enter the Item Description' }]}>
                <Input placeholder="Please Enter Item Description" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Item SKU"
                name="itemSku"
                rules={[{ required: true, message: 'Enter the Item SKU' }]}>
                <Input placeholder="Please Enter Item SKU" />
              </Form.Item>
              </Col>
              </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="RM Item Type"
                name="rmItemType"
                rules={[{ required: true, message: 'Please select  RM Item Type' }]}>
                <Select placeholder="Please select  RM Item Type">
                {Object.keys(PhItemCategoryEnum).map((key) => (
                <Select.Option key={key} value={PhItemCategoryEnum[key]}>
                {PhItemCategoryEnum[key]}
                </Select.Option>
                ))}
                </Select>
              </Form.Item>
              
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="BOM Item Type"
                name="bomItemType"
                rules={[{required: true, message: 'Please select  BOM Item Type' }]}>
                <Select placeholder="Please select  BOM Item Type">
                {Object.keys(BomItemTypeEnum).map((key) => (
                <Select.Option key={key} value={BomItemTypeEnum[key]}>
                {BomItemTypeEnum[key]}
                </Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Form.Item
                label="Item Color"
                name="itemColor"
                rules={[{ required: true, message: 'Enter the Item Color' }]}>
                <Input placeholder="Please Enter Item Color" />
              </Form.Item>
              </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBomItem;