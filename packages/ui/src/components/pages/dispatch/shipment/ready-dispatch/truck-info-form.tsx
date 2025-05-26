import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Input, DatePicker, TimePicker, message, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { PkShippingRequestIdRequest, PkShippingRequestModel, PkShippingRequestTruckIdRequest, PkShippingRequestTruckRequest, PkTruckTypeEnum } from '@xpparel/shared-models';
import { ShippingRequestService } from '@xpparel/shared-services';
import moment from 'moment';
import { defaultDateFormat, defaultDateTimeFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import { AlertMessages } from 'packages/ui/src/components/common';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  initialFields: any;
  shippingRequestData: PkShippingRequestModel[];
  user: any;
  requestId: number
}
const TruckInfoForm = ({ isVisible, onClose, initialFields, shippingRequestData, user, requestId }: IProps) => {
  const [form] = Form.useForm();
  const [dynamicFields, setDynamicFields] = useState(initialFields);
  const [truckInfo, setTruckInfo] = useState([]);
  const shippingValue = new ShippingRequestService();

  const fetchTruckInfo = async () => {
    if (shippingRequestData && shippingRequestData.length > 0) {
      const reqObj = new PkShippingRequestIdRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        [requestId],
        'Fetching truck info',
        false,
        true,
        false,
        false
      );

      try {
        const response = await shippingValue.getShippingRequestByIds(reqObj);
        if (response?.data) {
          const mappedTruckInfo = response.data.flatMap(item =>
            item.truckInfo.map(truck => ({
              truckId: truck.id,
              truckNo: truck.truckNumber,
              contact: truck.contact,
              driverName: truck.dirverName,
              inAt: truck.inAt,
              licenseNo: truck.licenseNo,
              outAt: truck.outAt,
              checkOut: truck.inAt,
              remarks: truck.remarks,
              srId: item.id

            }))
          );
          setTruckInfo(mappedTruckInfo);
        } else {
          AlertMessages.getErrorMessage('No truck info found for the selected shipping requests');
          setTruckInfo([]);
        }
      } catch (error) {
        AlertMessages.getErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchTruckInfo();
    }
  }, [isVisible, shippingRequestData, user]);

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        const reqModel: PkShippingRequestTruckRequest[] = dynamicFields.map((field, index) => ({
          truckNo: values[`truckNumber_${index}`],
          contact: values[`contactNumber_${index}`],
          driverName: values[`driverName_${index}`],
          licenseNo: values[`licenseNo_${index}`],
          truckType: PkTruckTypeEnum.TRUCK,
          inAt: values[`checkInDate_${index}`]?.format('YYYY-MM-DD') + ' ' + values[`checkInTime_${index}`]?.format('HH:mm'),
          outAt: values[`checkoutDate_${index}`]?.format('YYYY-MM-DD') + ' ' + values[`checkoutTime_${index}`]?.format('HH:mm'),
          sRequestId: requestId,
          username: user?.userName,
          unitCode: user?.orgData?.unitCode,
          companyCode: user?.orgData?.companyCode,
          userId: user?.userId,
          remarks: values[`remarks_${index}`]
        } as PkShippingRequestTruckRequest));

        try {
          const response = await shippingValue.saveTruckInfoForShippingRequest(reqModel);
          if (response.status) {
            AlertMessages.getSuccessMessage(response.internalMessage); 
            setDynamicFields([{ truckNumber: '', contactNumber: '', checkInTime: null, checkInDate: null, checkoutTime: null, checkoutDate: null, remarks: '' }]);
            form.resetFields();
            //onClose();
            fetchTruckInfo();
          } else {
            AlertMessages.getErrorMessage(response.internalMessage);
          }
        } catch (error) {
          AlertMessages.getErrorMessage('An error occurred while saving truck information');
       
        }
      })
      .catch((info) => {
        AlertMessages.getErrorMessage(info.message)
      });
  };


  const deleteTruckInfo = async (truckId, srId) => {
    const reqModel = new PkShippingRequestTruckIdRequest(
      [truckId],
      srId,
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
    );

    try {
      const response = await shippingValue.deleteTruckForShippingRequest(reqModel);
      if (response.status) {
        const updatedTruckInfo = truckInfo.filter(item => item.truckId !== truckId);
        setTruckInfo(updatedTruckInfo);
        AlertMessages.getSuccessMessage(response.internalMessage);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage || 'Failed to delete truck info');
      }
    } catch (error) {
      AlertMessages.getErrorMessage('An error occurred while deleting truck information');
    }
  };
  const columns = [
    {
      title: 'Truck Number',
      dataIndex: 'truckNo',
      key: 'truckNo',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact',
      key: 'contact',
    },

    {
      title: 'CheckIn Date',
      dataIndex: 'inAt',
      key: 'inAt',
      render: (val) => val ? moment(new Date(val)).format(defaultDateTimeFormat) : ''
    },
    {
      title: 'Checkout Date',
      dataIndex: 'outAt',
      key: 'outAt',
      render: (val) => val ? moment(new Date(val)).format(defaultDateTimeFormat) : ''
    },
    {
      title: 'Driver Name',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: 'License Number',
      dataIndex: 'licenseNo',
      key: 'licenseNo',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) =>
        <Button type="primary" onClick={() => deleteTruckInfo(record.truckId, record.srId)} danger>
          Delete
        </Button>

    },
  ];

  return (
    <Modal
      title="Update Truck Info"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ height: '100%', top: 0 }}

    >
      <Row gutter={16}>
        <Col span={8} >
          <Form form={form} layout="vertical">
            {dynamicFields.map((field, index) => (
              <Row gutter={16} key={index}>
                <Col span={12}>
                  <Form.Item
                    name={`truckNumber_${index}`}
                    label="Truck Number"
                    rules={[
                      { required: true, message: 'Please enter the truck number' },
                      { pattern: /^[A-Za-z0-9-]+$/, message: 'Truck number should be alphanumeric' },
                      {max:15,message:'Truck number should not exceed 15 characters'}
                    ]}
                  >
                    <Input placeholder="Enter truck number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`contactNumber_${index}`}
                    label="Contact Number"
                    rules={[{ required: true, message: 'Please enter the contact number' },
                      { pattern: /^[0-9-]+$/, message: 'Contact number should be only numberic' },
                      {max:13,message:'contact number should be exceed 13 digits'}
                    ]}
                  >
                    <Input placeholder="Enter contact number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`checkInDate_${index}`}
                    label="CheckIn Date"
                    rules={[{ required: true, message: 'Please select the checkIn date' }]}
                  >
                    <DatePicker placeholder="Select checkIn date" style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`checkInTime_${index}`}
                    label="CheckIn Time"
                    rules={[{ required: true, message: 'Please select the checkIn time' }]}
                  >
                    <TimePicker placeholder="Select checkIn time" format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    name={`checkoutDate_${index}`}
                    label="Checkout Date"
                    rules={[{ required: true, message: 'Please select the checkout date' }]}
                  >
                    <DatePicker placeholder="Select checkout date" style={{ width: '100%' }} />
                  </Form.Item>
                </Col> */}
                {/* <Col span={12}>
                  <Form.Item
                    name={`checkoutTime_${index}`}
                    label="Checkout Time"
                    rules={[{ required: true, message: 'Please select the checkout time' }]}
                  >
                    <TimePicker placeholder="Select checkout time" format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col> */}
                <Col span={12}>
                  <Form.Item
                    name={`driverName_${index}`}
                    label="Driver Name"
                    rules={[{ required: true, message: 'Please enter driver name' },
                      { pattern: /^[A-Za-z-]+$/, message: 'Driver Name should contain only alphabets' },
                      {max:20, message:'DriverName should not exceed 20 characters '}
                    ]}
                  >
                    <Input placeholder="Enter Driver Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`licenseNo_${index}`}
                    label="license Number"
                    rules={[{ required: true, message: 'Please enter license number' },
                      { pattern: /^[A-Za-z0-9-]+$/, message: 'License number should be alphanumeric' },
                      {max:20,message:'licenseNo should not exceed 20 characters'}
                    ]}
                  >
                    <Input placeholder="Enter license number" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={`remarks_${index}`}
                    label="Remarks"
                    rules={[{ required: false, message: 'Please enter remarks', }]}
                   
                    
                  >
                    <Input.TextArea placeholder="Enter remarks" rows={1} />
                  </Form.Item>
                </Col>

              </Row>
            ))}
            <Button type="primary" onClick={handleOk}  className='btn-green' style={{ marginTop: '20px' }}>
              Update
            </Button>
          </Form>
        </Col>

        <Col span={16} style={{ maxHeight: '60vh', overflowY: 'auto' }}>

          <Table
            dataSource={truckInfo}
            columns={columns}
            size='small'
            rowKey="srId"
            pagination={false}
            style={{ marginTop: '20px' }}
          />

        </Col>
      </Row>
    </Modal>
  );
};

export default TruckInfoForm;
