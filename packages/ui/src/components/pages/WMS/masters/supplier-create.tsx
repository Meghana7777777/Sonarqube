import Icon, { EditFilled, EditOutlined, EditTwoTone } from "@ant-design/icons";
import { SupplierActivateRequest, SupplierCreateRequest, SupplierCreationModel } from "@xpparel/shared-models";
import { SupplierServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { ColumnsType } from "antd/lib/table";
import SupplierCreateForm from "./supplier-form";


export const CreateSuppliers = () => {

  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new SupplierServices();
  const [SupplierData, setSupplierData] = useState<SupplierCreationModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SupplierCreationModel>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  useEffect(() => {
    getAllSuppliersData();
  }, []);
  ;
  const getAllSuppliersData = () => {
    const obj = new SupplierCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.orgData?.userId, user?.orgData?.id, user?.orgData?.supplierName, user?.orgData?.supplierCode, user?.orgData?.supplierName, user?.orgData?.phoneNumber, user?.orgData?.supplierAddress);
    service.getAllSuppliersData(obj).then(res => {
      if (res.status) {

        setSupplierData(res.data);
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  const showModal = (record) => {
    if (!record?.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Suppliers Data');
    setOkText("Update");
  };

  const showModals = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
    setIsTitle('Create Suppliers Data');
    setOkText("Create");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.resetFields();
  };
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const handleOk = () => {
    formRef.validateFields().then(values => {
      const req = new SupplierCreateRequest(user?.orgData?.username, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.orgData?.userId, values.id, values.supplierName, values.supplierCode, values.phoneNumber, values.supplierAddress, values.isActive);
      service.createSupplier(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          fieldsReset();
          getAllSuppliersData();
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
  const supplierColumns: ColumnsType<any> = [

    {
      title: 'Supplier Code',
      dataIndex: 'supplierCode',
      align: 'center',
      key: 'supplierCode',
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      align: 'center',
      key: 'supplierName',
    },

    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      align: 'center',
      key: 'phoneNumber',
    },
    {
      title: 'Supplier Address',
      dataIndex: 'supplierAddress',
      align: 'center',
      key: 'supplierAddress',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, record) => {

        return <>

          <EditTwoTone
            style={{ fontSize: '20px' }}
            onClick={() => showModal(record)}
          /><Divider type="vertical" />

          <Popconfirm
            onConfirm={
              e => {
                const req = new SupplierActivateRequest('', '', '', 5, record.id);
                service.ActivateDeactivateSuppliers(req).then(res => {
                  AlertMessages.getSuccessMessage(res.internalMessage);

                  getAllSuppliersData();
                }).catch(err => {
                  console.log(err);
                })
              }}
            title={record.isActive ? "Are you sure to Deactivate Suppliers?" : "Are you sure to Activate Suppliers ?"}>
            <Switch size='default' defaultChecked
              className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={record.isActive} />
          </Popconfirm>
        </>
      }
    },

  ];
  return <>
    <Card title='Supplier' extra={<Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button>}> <Table dataSource={SupplierData} size="small" bordered columns={supplierColumns} scroll={{x: 'max-content'}}> </Table>
      <Modal
        title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={handleOk}
        okText={oktext}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}>
        <SupplierCreateForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} isEdit={!!selectedRecord}
        />
      </Modal>
    </Card>
  </>

}
export default CreateSuppliers;