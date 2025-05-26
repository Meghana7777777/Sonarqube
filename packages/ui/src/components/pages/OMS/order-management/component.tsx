import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import ProductTypeForm from "./product-type-form";
import { useAppSelector } from "packages/ui/src/common";
import { ComponentServices, ProductTypeServices } from "@xpparel/shared-services";
import { CommonRequestAttrs, ComponentIdRequest, ComponentModel, ComponentRequest, ProductTypeIdRequest, ProductTypeModel, ProductTypeRequest } from "@xpparel/shared-models";
import { AlertMessages } from "../../../common";
import ComponentForm from "./component-form";
import { ColumnsType } from "antd/es/table";

export const CreateComponents = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oktext, setOkText] = useState("Create");
  const [selectedRecord, setSelectedRecord] = useState<ComponentModel>();
  const service = new ComponentServices();
  const compservice = new ComponentServices();
  const [resData, setResData] = useState<ComponentModel[]>([]);
  const [compData, setCompData] = useState([]);
  const [componentName, setcomponentName] = useState(false);
  const [istitle, setIsTitle] = useState("Create Component");
  useEffect(() => {
    getAllComponents();
  }, []);
  ;
  const showModal = (record) => {
    setcomponentName(true);
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Component');
    setOkText("Update");
    setTimeout(() => {
      formRef.setFieldsValue(record);
    }, 0);
  };
  const showModals = () => {
    setcomponentName(false);
    setSelectedRecord(null);
    setIsTitle('Create Component');
    setOkText("Create");
    setIsModalOpen(true);
    fieldsReset();
  }
  const onClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  }
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const getAllComponents = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllComponents(obj).then(res => {
      if (res.status) {
        setResData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      }
    }).catch(err => {
      console.log(err.message)
    })
  }
  const handleOk = () => {
    formRef.validateFields().then(values => {
      values.compName = values.compName.trim();
      const componentModel: ComponentModel[] = [];
      componentModel.push(values);
      const req = new ComponentRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, componentModel);
      service.createComponent(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          setSelectedRecord(null);
          fieldsReset();
          getAllComponents();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        console.log(err);
        fieldsReset();
      })
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
  })
  };

  const deleteComponent = (recod) => {
    const obj = new ComponentIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,recod);

    service.deleteComponent(obj).then(res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getAllComponents();
      }
      else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  const componentColumns: ColumnsType<any> = [
    {
      title: 'Component',
      dataIndex: 'compName',
      align: 'center',
      key: 'compName',
    },
    {
      title: 'Component Description',
      dataIndex: 'compDesc',
      align: 'center',
      key: 'compDesc',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, recod) => {
        return <>
          <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />
          <DeleteOutlined onClick={() => deleteComponent(recod.id)} />


        </>
      }
    }
  ]
  return <>
    <Card title='Components' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
      <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={istitle}  style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
        <Divider type="horizontal"></Divider>
        <ComponentForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} componentName={componentName} />
      </Modal>
      <Table dataSource={resData} columns={componentColumns} size="small" bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}}></Table>
    </Card>

  </>

}

export default CreateComponents;