import { DeleteSplitQuantityRequest, ManufacturingOrderSummaryEnum, OrderSummaryEnum, SI_ManufacturingOrderInfoModel, RawOrderLineInfoModel, RawOrderNoRequest, SplitOrderQuantityRequest, SI_MoNumberRequest } from '@xpparel/shared-models'
import { OrderCreationService, OrderManipulationServices } from '@xpparel/shared-services'
import { Button, Card, Col, Form, Input, message, Modal, Row, Table, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../../common'
import { AlertMessages } from '../../../common'
import { moLineColumns } from './order-summery-columns'
import { DeleteOutlined, SplitCellsOutlined } from '@ant-design/icons'

interface IMoLineChildComponentProps {
    selectedMo: SI_ManufacturingOrderInfoModel;
    tabkey: ManufacturingOrderSummaryEnum;
}

export const MoLineChildComponent = (props: IMoLineChildComponentProps) => {
    const { selectedMo, tabkey } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [orderLineInfo, setOrderLineInfo] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<RawOrderLineInfoModel | null>(null);
    const [splitAmount, setSplitAmount] = useState('');
    const [isSplitValid, setIsSplitValid] = useState(true);
    const orderInfoService = new OrderManipulationServices();

    const handleSplitClick = (record: RawOrderLineInfoModel) => {
        setSelectedRecord(record);
        setSplitAmount('');
        setIsModalVisible(true);
    };

    const getOrderLineColumns: any = (onSplit) => {
        const columns = [
            ...moLineColumns,
           
        ];

        return columns;
    };

    const orderCreationService = new OrderCreationService();

    useEffect(() => {
        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo?.moNumber, selectedMo.moPk, false, false, true, true, true, false, false, false, false, true, false)
        getOrderSummery(req)
        // getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo.moNumber, selectedMo.moPk, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined));
    }, []);

    const getOrderSummery = (req: SI_MoNumberRequest) => {
        orderCreationService.getOrderInfoByManufacturingOrderNo(req)
            .then((res) => {
                if (res.status) {
                    const data = res.data[0];
                    // if (data.packMethodConfirmed) {
                    //     data.orderLines = data.orderLines.filter(r => r.isOriginal == false);
                    // }
                    console.log(data.moLineModel);
                    setOrderLineInfo(data.moLineModel);
                } else {
                    setOrderLineInfo([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const handleModalOk = () => {
        if (isSplitValid) {
            splitOrderQuantityInOrderLines();
            setIsModalVisible(false);
        } else {
            message.error("Split amount cannot be greater than Total Order Qty");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleSplitAmountChange = (e) => {
        const value = e.target.value;
        setSplitAmount(value);

        if (selectedRecord && parseFloat(value) > selectedRecord.quantity) {
            setIsSplitValid(false);
        } else {
            setIsSplitValid(true);
        }
    };

    const splitOrderQuantityInOrderLines = () => {
        if (selectedRecord && splitAmount) {
            try {
                const request = new SplitOrderQuantityRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo.moPk, selectedMo.moNumber, selectedRecord.orderLineId, parseFloat(splitAmount), selectedRecord.orderLineNo);

                orderInfoService.splitOrderQuantityInOrderLines(request).then(res => {
                    if (res.status) {
                        AlertMessages.getSuccessMessage('Order quantity split successfully');
                        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo?.moNumber, selectedMo.moPk, false, false, true, true, true, false, false, false, false, true, false)
                        getOrderSummery(req)
                        // getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo.moNumber, selectedMo.moPk, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined));
                    }
                }).catch(err => {
                    AlertMessages.getErrorMessage(err.message);
                });
            } catch (err) {
                AlertMessages.getErrorMessage(err.message);
            }
        }
    };

    const showDeleteConfirmation = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this split quantity?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => deleteSplitQuantities(record),
        });
    };

    const deleteSplitQuantities = (record) => {
        try {
            const request = new DeleteSplitQuantityRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo.moPk, selectedMo.moNumber, record.orderLineId, record.orderLineNo);

            orderInfoService.deleteSplitQuantities(request).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage('Split quantities deleted successfully');
                    const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo?.moNumber, selectedMo.moPk, false, false, true, true, true, false, false, false, false, true, false)
                    getOrderSummery(req)
                    // getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedMo.moNumber, selectedMo.moPk, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined));
                }
            }).catch(err => {
                AlertMessages.getErrorMessage(err.message);
            });
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    return (
        <Card>
            <Table dataSource={orderLineInfo} size='small' columns={getOrderLineColumns(handleSplitClick)} bordered scroll={{ x: '100%' }} pagination={false} />
            <Modal
                title={<span style={{ display: 'flex', justifyContent: 'center' }}>Split Order Quantity</span>}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okButtonProps={{ disabled: !isSplitValid }}
            ><hr />
                <Row gutter={16}>
                    <Col span={12}>
                        <p>Total Order Qty: {selectedRecord?.quantity}</p>
                    </Col>
                    <Col span={12} style={{ marginTop: '10px' }}>
                        <Form layout="horizontal">
                            <Form.Item
                                label="Split Amount"
                                validateStatus={!isSplitValid ? 'error' : ''}
                                help={!isSplitValid ? 'Split amount cannot be greater than Total Order Qty' : ''}
                            >
                                <Input
                                    type="number"
                                    value={splitAmount}
                                    onChange={handleSplitAmountChange}
                                    placeholder="Enter split amount"
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </Card>
    )
};

export default MoLineChildComponent;