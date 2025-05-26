import { CommonRequestAttrs, MoNumberResDto, PKMSPackOrderIdRequest, PKMSPackOrderInfoModel, PackOrderResponseDto } from "@xpparel/shared-models";
import { PackListService, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import MaterialReqNoTab from "./material-req-no-tab";
import CutOrderDetails from "./pkms-cut-order-details";

const { Option } = Select;
export const FgWarehouseRequestCreation = () => {
    const [formRef] = Form.useForm();
    const [form] = Form.useForm();
    const [manufacturingOrders, setManufacturingOrders] = useState<MoNumberResDto[]>([]);
    const [poS, setPos] = useState<PackOrderResponseDto[]>([]);
    const [packOrderData, setPackOrderData] = useState<PKMSPackOrderInfoModel[]>([]);
    const [packOrderViewData, setPackOrderViewData] = useState<PKMSPackOrderInfoModel[]>([]);
    const [selectedPo, setSelectedPo] = useState<number>();
    const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<string>();
    const [activeTab, setActiveTab] = useState("1");
    const preIntegrationServicePKMS = new PreIntegrationServicePKMS();
    const packListService = new PackListService();
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        getManufacturingOrders();
    }, []);

    /**
     * Get manufacturing orders
     */
    const getManufacturingOrders = async () => {
        try {
            const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            const manufacturingOrderRes = await preIntegrationServicePKMS.getPKMSMoNumbers(reqObj);
            if (manufacturingOrderRes.status) {
                setManufacturingOrders(manufacturingOrderRes.data);
            } else {
                AlertMessages.getErrorMessage(manufacturingOrderRes.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    /**
     * Handle Manufacturing Order Change
     */
    const changeManufacturingOrder = async (manufacturingOrder: string) => {
        try {
            setSelectedManufacturingOrder(manufacturingOrder);
            setSelectedPo(undefined);
            formRef.setFieldValue('packOrder', undefined);
            const reqObj = new MoNumberResDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            reqObj.moNumber = manufacturingOrder
            const posResponse = await preIntegrationServicePKMS.getPKMSPackOrdersByMo(reqObj);
            if (posResponse.status) {
                setPos(posResponse.data);
            } else {
                setPos([]);
                AlertMessages.getErrorMessage(posResponse.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    /**
     * Handle PO Change
     */
    const packOrderOnChange = (poId: number) => {
        setSelectedPo(poId);
    };

    /**
     * Get cut dispatch info for manufacturing order and PO number
     */

    const getPackOrderInfo = async () => {
        const reqObj = new PKMSPackOrderIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPo], true, true, false, false, false, false, false, true, false);
        try {
            const res = await packListService.getPackOrderInfoByPackOrderId(reqObj);
            if (res.status) {
                setPackOrderData(res.data);
            } else {
                setPos([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }

    };
    const getViewPackOrderInfo = async () => {
        const reqObj = new PKMSPackOrderIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPo], true, true, false, false, false, false, false, false, true);
        try {
            const res = await packListService.getPackOrderInfoByPackOrderId(reqObj);
            if (res.status) {
                setPackOrderViewData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }

    };


    return (
        <Card
            title={'FG Warehouse Request Creation'} size="small"
        >
            <Form form={form} onFinish={() => {
                if (activeTab === '1') {
                    getPackOrderInfo()
                } else if (activeTab === '3') {
                    getViewPackOrderInfo()
                }

            }} layout="horizontal" name="PO">
                <Row style={{ display: 'flex', gap: '0px' }}>
                    <Col xs={24} sm={12} md={10} lg={10} >
                        <Form.Item
                            label="Select Manufacturing Order"
                            name="manufacturingOrder"
                            rules={[{ required: true, message: 'Select Mo/Plant Style Ref' }]}
                        >
                            <Select
                            //  style={{ width: '300px' }}
                                placeholder='Select Mo/Plant Style Ref'
                                allowClear
                                onChange={changeManufacturingOrder}
                                filterOption={(input, option) =>
                                    (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                                }
                                showSearch

                            >
                                {manufacturingOrders.map(moList => (
                                    <Option value={moList.moNumber} key={`${moList.moNumber}`}>
                                        {moList.moNumber}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={24} md={9} lg={7} xl={6}>

                        <Form.Item
                            label="Select Pack Order"
                            name="packOrder"

                            rules={[{ required: true, message: 'Select Pack Order' }]}
                        >
                            <Select
                            //  style={{ width: '300px' }}
                                onChange={packOrderOnChange}
                                placeholder="Select Pack Order"
                                showSearch
                                allowClear
                                optionFilterProp="label"
                            >
                                {poS.map(poObj => (
                                    <Option key={poObj.poId} value={poObj.poId}>
                                        {poObj.packOrderNumber}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={12} md={4} lg={4}>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" >
                                Search
                            </Button>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
            <Form form={formRef}>
                <Tabs defaultActiveKey="1" activeKey={activeTab} centered onChange={(activeKey) => setActiveTab(activeKey)}>
                    <TabPane tab="Request Creation" key="1" >
                        <CutOrderDetails
                            getPackOrderInfo={getPackOrderInfo}
                            cutDispatchData={packOrderData}
                            manufacturingOrderPk={selectedManufacturingOrder}
                            packOrderIdPk={selectedPo}
                            form={formRef}
                            setActiveTab={setActiveTab}
                            viewFieldsOnly={true}
                        />
                    </TabPane>
                    <TabPane tab="Req No" key="2">
                        <MaterialReqNoTab
                            packOrder={selectedPo}
                            key={activeTab}
                        />
                    </TabPane>
                    <TabPane tab="Requests View" key="3" >
                        <CutOrderDetails
                            getPackOrderInfo={getViewPackOrderInfo}
                            cutDispatchData={packOrderViewData}
                            manufacturingOrderPk={selectedManufacturingOrder}
                            packOrderIdPk={selectedPo}
                            form={formRef}
                            setActiveTab={setActiveTab}
                            viewFieldsOnly={false}
                        />
                    </TabPane>
                </Tabs>

            </Form>

        </Card>

    );
};

export default FgWarehouseRequestCreation;
