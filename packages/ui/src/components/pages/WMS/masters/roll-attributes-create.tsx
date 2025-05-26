import Icon, { EditOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import RollAttributesCreateForm from "./roll-attributes-create-form";
import { RollAttributesServices } from "@xpparel/shared-services";
import { CommonRequestAttrs, RollAttributesActivateRequest, RollAttributesCreateRequest, RollAttributesCreationModel } from "@xpparel/shared-models";

export const CreateRollAttributes = () => {
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new RollAttributesServices();
  const [rollattributesdata, setRRollAttributesData] = useState<RollAttributesCreationModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  useEffect(() => {
    getRollAttributes();
  }, []);
  ;
  const getRollAttributes = () => {
    const obj = new CommonRequestAttrs('a', 'b', 'c', 100);
    service.getAllRRollAttributesData(obj).then(res => {
      if (res.status) {
        
         setRRollAttributesData(res.data);
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Roll Attributes');
    setOkText("Update");
  };

  const showModals = () => {
    setIsModalOpen(true);
    setIsTitle('Create Roll Attributes');
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
      console.log(values, '------------');
      const req = new RollAttributesCreateRequest('', '', '', 2, values.id, values.name, values.code, values.isActive);
      service.createRollAttributes(req).then(res => {
        console.log(res, '////');
        setIsModalOpen(false);
        fieldsReset();
      }).catch(err => {
        console.log(err);
        fieldsReset();
      })
    })

  };
  const attributecolumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },

    {

      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (value, recod) => {

        return <>

          <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />

          <Popconfirm
            onConfirm={
              e => {
                const req = new RollAttributesActivateRequest('', '', '', 5, recod.id);
                service.ActivateDeactivateRollAttributes(req).then(res => {
                  getRollAttributes();
                }).catch(err => {
                  console.log(err);
                })
              }}
            title={recod.isActive ? "Are you sure to Deactivate Roll Attributes ?" : "Are you sure to Activate Roll Attributes ?"}>
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
    <Card> <Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button><Table dataSource={rollattributesdata} columns={attributecolumns}> </Table>
      <Modal title={isTitle} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel}>
        <RollAttributesCreateForm formRef={formRef} initialvalues={selectedRecord} />
      </Modal>
    </Card>
  </>

}
export default CreateRollAttributes;