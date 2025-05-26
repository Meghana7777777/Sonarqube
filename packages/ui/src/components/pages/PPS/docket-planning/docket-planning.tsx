import { CommonRequestAttrs, CutTableModel, PO_StyleInfoModel, PoProdTypeAndFabModel, PoSerialRequest, PoSummaryModel, ProcessingOrderInfoModel, ProductInfoModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum, StyleCodeRequest, StyleProductCodeRequest, WhMatReqLineStatusEnum } from '@xpparel/shared-models';
import { CutOrderService, CutTableService, OrderManipulationServices, POService, PoMaterialService } from '@xpparel/shared-services';
import { Affix, Button, Card, Col, Form, Popover, Row, Select, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages, getLayoutSettings } from '../../../common';
import { CuttingWorkStations } from './cutting-work-stations';
import OpenDocketRequestsContainer from './open-docket-requests-container';
import { ReloadOutlined } from '@ant-design/icons';


const { Option } = Select;
const layOutSetting = getLayoutSettings(3);
export const DocketPlanning = () => {
    const [styles, setStyles] = useState<PO_StyleInfoModel[]>([]);
    const [selectedStyleCode, setSelectedStyleCode] = useState<string>();
    const [products, setProducts] = useState<ProductInfoModel[]>([]);
    const [selectedProductCode, setSelectedProductCode] = useState<string>();
    const [processingOrders, setProcessingOrders] = useState<ProcessingOrderInfoModel[]>([]);
    const [selectedProcessingSerial, setSelectedProcessingSerial] = useState<number>();
    const [workStations, setWorkStations] = useState<CutTableModel[]>([]);
    const [unplannedStateKey, setUnplannedStateKey] = useState<number>(0);
    const [plannedStateKeys, setPlannedStateKeys] = useState<{ [key: number]: number }>(undefined);

    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);

    const omsManipulationService = new OrderManipulationServices();
    const poService = new POService();
    const poMaterialService = new PoMaterialService();
    const ctdService = new CutTableService();
    const cutOrderService = new CutOrderService();



    useEffect(() => {
        getStyles(new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId));
        getAllCutTables();
    }, []);


    const getAllCutTables = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        ctdService.getAllCutTables(req).then((res => {
            if (res.status) {
                setWorkStations(res.data);
                const tblIds = {};
                res.data.forEach(tblObj => tblIds[tblObj.id] = 0);
                setPlannedStateKeys(tblIds);
            } else {
                setWorkStations([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setWorkStations([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getStyles = (req: CommonRequestAttrs) => {
        cutOrderService.getCutOrderCreatedStyles(req)
            .then((res) => {
                if (res.status) {
                    setStyles(res.data);
                    setProducts([]);
                    setProcessingOrders([]);
                } else {
                    setProducts([]);
                    setProcessingOrders([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setProducts([]);
                setProcessingOrders([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }
    const changeStyle = (style: string) => {
        formRef.setFieldValue('productCode', undefined);
        formRef.setFieldValue('processingOrder', undefined);
        setSelectedStyleCode(style);
        setSelectedProductCode(undefined);
        setSelectedProcessingSerial(null);
        fetchProducts(style);
    }


    const fetchProducts = (styleCode: string) => {
        const request = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode);
        cutOrderService.getProductInfoForGivenStyle(request)
            .then((res) => {
                if (res.status) {
                    setProducts(res.data);
                    setProcessingOrders([]);
                } else {
                    setProducts([]);
                    setProcessingOrders([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setProducts([]);
                setProcessingOrders([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const changeProductCode = (value: string) => {
        setSelectedProductCode(value);
        setSelectedProcessingSerial(undefined);
        formRef.setFieldValue('processingOrder', undefined)
        const req = new StyleProductCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyleCode, value);
        cutOrderService.getCutOrderInfoByStyeAndProduct(req)
            .then((res) => {
                if (res.status) {
                    setProcessingOrders(res.data);
                } else {
                    setProcessingOrders([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setProcessingOrders([]);
                AlertMessages.getErrorMessage(err.message);
            });
        
    }

    const changeProcessingOrder = (poSerial: number) => {
        setSelectedProcessingSerial(poSerial);
    }

    const getClassName = (materialStatus: WhMatReqLineStatusEnum) => {
        switch (materialStatus) {
            case WhMatReqLineStatusEnum.OPEN: return 'w-gray';
            case WhMatReqLineStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
            case WhMatReqLineStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
            case WhMatReqLineStatusEnum.MATERIAL_READY: return 'w-ready';
            case WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
            case WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
            case WhMatReqLineStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
            case WhMatReqLineStatusEnum.MATERIAL_ISSUED: return 'w-green';
            default: return 'w-dark-pink'
        }
    }
    const refreshUnplannedDocs = () => {
        setUnplannedStateKey(preSt => preSt + 1);
    }
    const refreshPlannedDocs = (tblId: number) => {
        setPlannedStateKeys(preState => {
            return { ...preState, [tblId]: preState[tblId] + 1 };
        })
    }
    const refreshDashboard = () => {
        setWorkStations([]);
        getAllCutTables();
    }
    return (
        <>
            <Card title='Docket Planning' size='small' extra={<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Refresh">
                <Button onClick={refreshDashboard} type="primary">
                    <ReloadOutlined />
                </Button>
            </Tooltip>}>
                <Form form={formRef}>
                    <Row>
                        <Col {...layOutSetting.column1}>
                            <Form.Item
                                label="Style"
                                name='style'
                                rules={[{ required: true, message: 'Please Select Style' }]}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Select Style'
                                    onChange={changeStyle}
                                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    showSearch
                                >
                                    {styles.map((style) => (
                                        <Option key={style.styleCode} value={style.styleCode}>
                                            {`${style.styleCode} - ${style.styleName}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layOutSetting.column2}>
                            <Form.Item
                                label="Product Code"
                                name='productCode'
                                rules={[{ required: true, message: 'Please Select Product Code' }]}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Select Product Code'
                                    onChange={changeProductCode}
                                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    showSearch
                                >
                                    {products.map(product => {
                                        return <Option key={product.productCode} value={product.productCode}>
                                            {`${product.productCode} - ${product.productName}`}
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layOutSetting.column2}>
                            <Form.Item
                                name='processingOrder'
                                label="Processing Order"
                                rules={[{ required: true, message: 'Please select Processing Order' }]}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Select Processing Order'
                                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    showSearch
                                    onChange={changeProcessingOrder}
                                >
                                    {processingOrders.map((order) => (
                                        <Option key={order.processingSerial} value={order.processingSerial}>
                                            {`${order.processingSerial} - ${order.prcOrdDescription}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 5, offset: 0 }} lg={{ span: 4, offset: 0 }} xl={{ span: 4, offset: 0 }}>
                        {selectedProcessingSerial && <Affix offsetTop={70}><OpenDocketRequestsContainer refreshPlannedDocs={refreshPlannedDocs} refreshKey={unplannedStateKey} poSerial={selectedProcessingSerial} selectedProductName={selectedProductCode} /></Affix>}

                    </Col>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 19, offset: 0 }} lg={{ span: 20, offset: 0 }} xl={{ span: 20, offset: 0 }}>
                        <Row justify='space-evenly'>
                            {workStations.map((rec, index) => {
                                return <Col><CuttingWorkStations refreshKey={plannedStateKeys ? plannedStateKeys[rec.id] : 0} cutTable={rec} refreshUnplannedDocs={refreshUnplannedDocs} /><br /></Col>
                            })}
                        </Row>
                    </Col>
                </Row>
            </Card>
            <br />
            <Card title="Color Legend" size='small'>
                <Space wrap>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.OPEN)} type="primary" >OPEN </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(undefined)} type="primary" >MATERIAL REQUESTED </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.PREPARING_MATERIAL)} type="primary" >PREPARING MATERIAL </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_NOT_AVL)} type="primary" >MATERIAL NOT AVAILABLE </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_READY)} type="primary" >MATERIAL READY </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY)} type="primary" >MATERIAL ON TROLLEY </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT)} type="primary" >MATERIAL IN TRANSIT </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.REACHED_DESITNATION)} type="primary" >REACHED DESTINATION </Button>
                    <Button style={{ minWidth: '180px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_ISSUED)} type="primary" >MATERIAL ISSUED </Button>
                </Space>
            </Card>
        </>
    )
}

export default DocketPlanning;