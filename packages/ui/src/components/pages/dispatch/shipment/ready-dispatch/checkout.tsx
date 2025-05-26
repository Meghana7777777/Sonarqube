import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Input, DatePicker, TimePicker, message, Table, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { PkShippingRequestCheckoutRequest, PkShippingRequestIdRequest, PkShippingRequestModel, PkShippingRequestTruckCheckoutModel, PkShippingRequestTruckIdRequest, PkShippingRequestTruckRequest, PkTruckTypeEnum } from '@xpparel/shared-models';
import { ShippingRequestService } from '@xpparel/shared-services';
import moment from 'moment';
import { defaultDateFormat, defaultDateTimeFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import { AlertMessages } from 'packages/ui/src/components/common';
import { disabledBackDates } from 'packages/ui/src/common';
import dayjs from 'dayjs';
import { ColumnProps, ColumnsType } from 'antd/es/table';
interface IProps {
    isVisible: boolean;
    onClose: () => void;
    shippingRequestData: PkShippingRequestModel[];
    user: any;
    requestId: number
}
interface TruckInfo {
    truckId: number;
    truckNo: string;
    contact: string;
    driverName: string;
    inAt: string;
    licenseNo: string;
    outAt: string;
    checkOut: string;
    remarks?: string;
    srId: number;
    uniqueId: number;
}
const Checkout = ({ isVisible, onClose, shippingRequestData, user,requestId }: IProps) => {
    const [truckInfo, setTruckInfo] = useState<TruckInfo[]>([]);
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
                            srId: item.id,
                            uniqueId: Date.now()
                        } as TruckInfo))
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

    const handleCheckout = async () => {
        let isError = false;
        const checkOutData: PkShippingRequestTruckCheckoutModel[] = [];
        truckInfo.forEach(truck => {
            if (!truck.checkOut) {
                AlertMessages.getErrorMessage(`Check out date is empty for truck ID: ${truck.truckNo}`);
                isError = true;
            } else {
                checkOutData.push(new PkShippingRequestTruckCheckoutModel(truck.truckId, truck.checkOut, truck.remarks))
            }
        });
        if (isError) {
            return;
        }

        const reqObj = new PkShippingRequestCheckoutRequest(user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId, requestId, '', checkOutData, '');
        try {
            const response = await shippingValue.checkoutShippingRequest(reqObj);
            if (response.status) {
                AlertMessages.getSuccessMessage(response.internalMessage);
                onClose();                 
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);

        }

    };


    const columns: ColumnsType<TruckInfo> = [
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
            render: (val, record) => {
                val ? moment(new Date(val)).format(defaultDateTimeFormat) : ''
                return <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    defaultValue={val ? dayjs(val, 'YYYY-MM-DD HH:mm') : dayjs(moment().format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm')}
                    disabledDate={(current: any) => disabledBackDates(current, moment().format(defaultDateFormat))}
                    onChange={(value, dateString) => {
                        record.checkOut = dateString;
                    }}
                />
            }
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
            render: (v, record) => <Input.TextArea placeholder="Enter remarks" onChange={e => { record.remarks = e.target.value }} defaultValue={v} rows={1} />
        }
    ];

    return (
        <Modal
            title="Checkout"
            open={isVisible}
            onCancel={onClose}
            footer={null}
            width="100%"
            style={{ height: '100%', top: 0 }}

        >
            <Row gutter={16}>

                <Col span={24} style={{ maxHeight: '60vh', overflowY: 'auto' }}>

                    <Table
                        dataSource={truckInfo}
                        columns={columns}
                        size='small'
                        bordered={true}
                        rowKey="uniqueId"
                        pagination={false}
                        style={{ marginTop: '20px' }}
                    />

                </Col>
            </Row>
            <br />

            <Flex justify='end'>
                <Col style={{ marginRight: '20px' }}>
                    <Button type='primary' className='btn-green' disabled={!truckInfo.length} onClick={handleCheckout}>Checkout</Button>
                </Col>
            </Flex>

        </Modal>
    );
};

export default Checkout;
