import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Form, Modal, Table } from "antd";
import ApprovalHierarchyCreateForm from "./approval-hierarchy-create-form";
import { useState } from "react";

export const CreateApprovalHierarchy = () => {
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
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
      //const req = new SecurityCheckRequest(1, values.vehicleno, values.drivername, values.driverphone, values.datetime, 'inat', 'outat', selectedRecord?.id);
      //service.saveSecurityCheckIn(req).then(res => {
      setIsModalOpen(false);
      fieldsReset();
    }).catch(err => {
      console.log(err);
      fieldsReset();
    })

  };
  const approvalcolumns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
    },
    {
      title: 'Sub Feature',
      dataIndex: 'subfeature',
      key: 'subfeature',
    },
    {
      title: 'User Role',
      dataIndex: 'userrole',
      key: 'userrole',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {

      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },

  ];
  return <>
    <Card> <Button onClick={() => showModal()} type="primary"><b>{"Create"}</b></Button><Table columns={approvalcolumns}> </Table>
      <Modal title="Create Approval Hierarchy" open={isModalOpen} onOk={handleOk} okText="Submit" cancelText="Close" onCancel={handleCancel}>
        <ApprovalHierarchyCreateForm formRef={formRef} />
      </Modal>
    </Card>
  </>

}
export default CreateApprovalHierarchy;