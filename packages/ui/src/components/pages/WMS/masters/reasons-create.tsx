import Icon, { EditOutlined } from "@ant-design/icons";
import { InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreateRequest, InsReasonsCreationModel } from "@xpparel/shared-models";
import { ReasonssServices } from "@xpparel/shared-services";
import { Alert, Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import ReasonsCreateForm from "./reasons-create-form";
import { ColumnsType } from "antd/lib/table";

export const CreateReasons = () => {

  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new ReasonssServices();
  const [reasonsdata, setReasonssData] = useState<InsReasonsCreationModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<InsReasonsCreationModel>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  useEffect(() => {
    getReasons();
  }, []);
  ;
  const getReasons = () => {
    const obj = new InsReasonsCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null);
    service.getAllReasonsData(obj).then(res => {
      if (res.status) {
        setReasonssData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage)
            }
    }).catch(err => {
      // AlertMessages.getErrorMessage(err);
    })
  }

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Inpection Reasons');
    setOkText("Update");
  };

  const showModals = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
    setIsTitle('Create Inpection Reasons');
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
      const req = new InsReasonsCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.extCode, values.pointValue, values.category, values.isActive);
      service.createReasons(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          console.log(res, '////');
          setIsModalOpen(false);
          fieldsReset();
          getReasons();
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
  const reasonsColumns:ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      align: 'center',
      key: 'code',
    },
    {
      title: 'Ext Code',
      dataIndex: 'extCode',
      align: 'center',
      key: 'extCode',
    },
    {
      title: 'Point Value',
      dataIndex: 'pointValue',
      align: 'center',
      key: 'pointValue',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'center',
      key: 'category',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, recod) => {

        return <> 

          <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />

          <Popconfirm
            onConfirm={
              e => {
                const req = new InsReasonsActivateRequest('', '', '', 5, recod.id);
                service.ActivateDeactivateReasons(req).then(res => {
                  AlertMessages.getSuccessMessage(res.internalMessage);

                  getReasons();
                }).catch(err => {
                  console.log(err);
                })
              }}
            title={recod.isActive ? "Are you sure to Deactivate Trollys ?" : "Are you sure to Activate Trollys ?"}>
            <Switch size='default' defaultChecked
              className={recod.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={recod.isActive} />
          </Popconfirm>
        </>
      }
    },

  ];
  return <>
    <Card title='Inspection Reasons' extra={<Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button>}> <Table dataSource={reasonsdata} columns={reasonsColumns}> </Table>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel} cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}>
        <ReasonsCreateForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} />
      </Modal>
    </Card>
  </>

}
export default CreateReasons;