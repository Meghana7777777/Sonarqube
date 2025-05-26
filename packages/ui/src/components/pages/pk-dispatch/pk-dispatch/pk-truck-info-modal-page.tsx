import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import { useState } from "react";

const PkTruckInfoModal = ({ isModalVisible, handleOk, handleCancel, form }) => {
    const [formItems, setFormItems] = useState([{ id: 1 }]); // Initial form row
  
    const addFormItem = () => {
      const newId = formItems.length + 1;
      setFormItems([...formItems, { id: newId }]);
    };
  
    return (
      <Modal
        visible={isModalVisible}
        title="Update Truck Info"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          {formItems.map((item) => (
            <div key={item.id}>
              <Form.Item
                name={`truckNumber${item.id}`}
                label="Truck Number"
                rules={[{ required: true, message: 'Please input the truck number!' }]}
              >
                <Input placeholder="Enter truck number" />
              </Form.Item>
  
              <Form.Item
                name={`checkoutDate${item.id}`}
                label="Checkout Date"
                rules={[{ required: true, message: 'Please select the checkout date!' }]}
              >
                <DatePicker />
              </Form.Item>
  
              <Form.Item
                name={`checkoutTime${item.id}`}
                label="Checkout Time"
                rules={[{ required: true, message: 'Please select the checkout time!' }]}
              >
                <TimePicker />
              </Form.Item>
            </div>
          ))}
          <Button type="dashed" onClick={addFormItem}>
            <PlusOutlined /> Add Another Truck Info
          </Button>
        </Form>
      </Modal>
    );
  };

  export default PkTruckInfoModal;
  