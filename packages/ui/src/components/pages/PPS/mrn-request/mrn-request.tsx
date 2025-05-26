import { FolderOpenOutlined } from '@ant-design/icons';
import { MrnStatusEnum, MrnStatusRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum } from '@xpparel/shared-models';
import { MrnService, OrderManipulationServices, POService } from '@xpparel/shared-services';
import { Card, Col, Form, Row, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages, getLayoutSettings } from '../../../common';
import MrnRequestCreate from './mrn-request-create';
import { MrnRequestTable } from './mrn-request-table';

const { Option } = Select;
const layOutSetting = getLayoutSettings(3);
export type ExtendedMrnStatusEnum = MrnStatusEnum | 'Create';
export const MrnRequest = () => {
    const [activeTab, setActiveTab] = useState<ExtendedMrnStatusEnum>('Create');
    const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
    const [posData, setPosData] = useState<PoSummaryModel[]>([]);
    const [selectedPo, setSelectedPo] = useState<PoSummaryModel>();
    const [selectedSalOrdId, setSelectedSalOrdId] = useState<number>();
    const [mrnRequestData, setMrnRequestData] = useState([]);

    const [formRef] = Form.useForm();


    const user = useAppSelector((state) => state.user.user.user);

    const omsManipulationService = new OrderManipulationServices();
    const poService = new POService();
    const mrnService = new MrnService();


    useEffect(() => {
        getSoList(new SoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, SoStatusEnum.COMPLETED));
    }, []);

    const onChangeTab = (tabKey) => {
        setActiveTab(tabKey);
        if (tabKey !== 'Create' && selectedPo) {
            getMrnRequestsByMrnStatus(tabKey);
        }
    };

    const getMrnRequestsByMrnStatus = (tabKey) => {
        const req = new MrnStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [tabKey], false, [selectedPo.poSerial]);
        mrnService.getMrnRequestsByMrnStatus(req)
            .then((res) => {
                if (res.status) {
                    setMrnRequestData(res.data);
                } else {
                    setMrnRequestData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch((err) => {
                setMrnRequestData([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const getSoList = (req: SoListRequest) => {
        omsManipulationService.getListOfSo(req)
            .then((res) => {
                if (res.status) {
                    setSaleOrders(res.data);
                    setPosData([]);
                } else {
                    setPosData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch((err) => {
                setPosData([]);
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const soChangeHandler = (orderId: number) => {
        setMrnRequestData([]);
        formRef.setFieldValue('po', undefined);
        setSelectedPo(undefined);
        setSelectedSalOrdId(orderId);
        getPosForSo(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderId, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined));
    };


    const getPosForSo = (req: RawOrderNoRequest) => {
        poService.getPosForSo(req)
            .then((res) => {
                if (res.status) {
                    setPosData(res.data);
                } else {
                    setPosData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch((err) => {
                setPosData([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }



    const poOnChange = (poId: number) => {
        const po = posData.find(rec => rec.poId === poId);
        setSelectedPo(po);
        setMrnRequestData([]);
    }


    return (
        <Card title='MRN Request' size='small' className='MRN Request'>
            <Form form={formRef} layout='horizontal'>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Form.Item
                            label="SO/Plant Style Ref"
                            name='so'
                            rules={[{ required: true, message: 'Please Select SO/Plant Style Ref' }]}>
                            <Select
                                placeholder='Select Sale Order'
                                onChange={soChangeHandler}
                                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                showSearch
                            >
                                {saleOrders.map(soList => {
                                    return <Option value={soList.orderId} key={`${soList.orderId}`}>{soList.plantStyle ? soList.orderNo + ' - ' + soList.plantStyle : soList.orderNo}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Form.Item
                            label="Select Cut Order"
                            name='po'
                            rules={[{ required: true, message: 'Please Select Cut Order' }]}>
                            <Select
                                placeholder='Select Cut Order'
                                onChange={poOnChange}
                                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                showSearch
                            >
                                {posData.map(poList => {
                                    return <Option value={poList.poId} key={`${poList.poId}`}>{`${poList.poSerial}-${poList.poDesc}`}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {selectedPo && <Tabs
                activeKey={activeTab}
                onChange={onChangeTab}
                centered
                items={
                    [
                        {
                            label: <><FolderOpenOutlined />Create</>,
                            key: 'Create',
                            children:
                                <MrnRequestCreate
                                    key={`${selectedPo}`}
                                    selectedPo={selectedPo}
                                />,
                        },
                        {
                            label: <><FolderOpenOutlined />OPEN</>,
                            key: MrnStatusEnum.OPEN,
                            children: <MrnRequestTable mrnRequestData={mrnRequestData} activeTab={activeTab} getMrnRequestsByMrnStatus={getMrnRequestsByMrnStatus} />,
                        },
                        {
                            label: <><FolderOpenOutlined />Approved</>,
                            key: MrnStatusEnum.APPROVED,
                            children: <MrnRequestTable mrnRequestData={mrnRequestData} activeTab={activeTab} getMrnRequestsByMrnStatus={getMrnRequestsByMrnStatus} />,
                        },
                        {
                            label: <><FolderOpenOutlined />Rejected</>,
                            key: MrnStatusEnum.REJECTED,
                            children: <MrnRequestTable mrnRequestData={mrnRequestData} activeTab={activeTab} getMrnRequestsByMrnStatus={getMrnRequestsByMrnStatus} />,
                        },
                        {
                            label: <><FolderOpenOutlined />Issued</>,
                            key: MrnStatusEnum.ISSUED,
                            children: <MrnRequestTable mrnRequestData={mrnRequestData} activeTab={activeTab} getMrnRequestsByMrnStatus={getMrnRequestsByMrnStatus} />,
                        }
                    ]
                }
            />}
        </Card>
    )
}

export default MrnRequest