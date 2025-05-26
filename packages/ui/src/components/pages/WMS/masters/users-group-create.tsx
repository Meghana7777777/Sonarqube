import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Form, Modal, Table } from "antd";
import UsersGroupCreateForm from "./usergroups-create-form";
import { useState } from "react";

export const CreateUsersGroup = () => {
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
      }).catch(err=>{
        console.log(err);
        fieldsReset();
      })
    
  };
    const userscolumns = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Group Name',
          dataIndex: 'group_name',
          key: 'group_name',
        },
        {
          title: 'User Id',
          dataIndex: 'userid',
          key: 'userid',
        },  
        {
          
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          },
        
      ];
      return<>
      <Card> <Button onClick={() => showModal()} style={{backgroundColor: '#0C3C80',color: "white",float:"right", width: '100px' }}><b>{"Create"}</b></Button><Table  columns={userscolumns}> </Table> 
      <Modal title="Create UserGroups" open={isModalOpen} onOk={handleOk} okText="Submit" cancelText="Close" onCancel={handleCancel}>
        <UsersGroupCreateForm  formRef={formRef} />
      </Modal>
      </Card>
      </>
      
}
export default CreateUsersGroup;