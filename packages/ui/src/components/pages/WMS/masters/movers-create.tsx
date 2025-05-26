import Icon, { EditOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, MoversActivateRequest, MoversCreateRequest, MoversCreationModel } from "@xpparel/shared-models";
import { MoversServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import MoversCreateForm from "./movers-create-form";
import { ColumnsType } from "antd/lib/table";

export const CreateMovers = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new MoversServices();
  const [moversdata, setMoversData] = useState<MoversCreationModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  useEffect(() => {
    getMovers();
  }, []);
  ;
  const getMovers = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllMoversData(obj).then(res => {
      if (res.status) {
        setMoversData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage)
      }
      
    }).catch(err => {
      console.log(err.message)
    })
  }

  const showModal = (record) => {
    if (record.isActive) {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Movers');
    setOkText("Update");
  } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Movers");
    }
  };

  const showModals = () => {
    setIsModalOpen(true);
    setIsTitle('Create Movers');
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
      const req = new MoversCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.capacity, values.uom, values.isActive);
      service.createMovers(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          console.log(res, '////');
          setIsModalOpen(false);
          fieldsReset();
          getMovers();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        console.log(err);
        fieldsReset();
      })
    }).catch((err) => {
      console.log("Please fill required fileds before creation.");
    })

  };
  const moversColumns:ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      align:'center',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      align:'center',
      key: 'code',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      align:'center',
      key: 'capacity',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      align:'center',
      key: 'uom',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align:'center',
      key: 'action',
      render: (value, recod) => {

        return <>

          <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />

          <Popconfirm
            onConfirm={
              e => {
                const req = new MoversActivateRequest('', '', '', 5, recod.id);
                service.ActivateDeactivateMovers(req).then(res => {
                  AlertMessages.getSuccessMessage(res.internalMessage);

                  getMovers();
                }).catch(err => {
                  console.log(err);
                })
              }}
            title={recod.isActive ? "Are you sure to Deactivate Movers ?" : "Are you sure to Activate Movers ?"}>
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
    <Card title='Mover' extra={<Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button>}> <Table dataSource={moversdata} columns={moversColumns}> </Table>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel}>
        <MoversCreateForm formRef={formRef} initialvalues={selectedRecord} />
      </Modal>
    </Card>
  </>

}
export default CreateMovers;