import { MoListModel, MoListRequest, MoStatusEnum, PKMSManufacturingOrderIdRequest, PKMSPackOrderIdRequest, PKMSPackOrderInfoModel } from "@xpparel/shared-models";
import { CutGenerationServices, OrderManipulationServices, POService, PackListService } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
import CutOrderDetails from "./pk-cut-order-details";

const { Option } = Select;
export const PkCreateShippableSetPage = () => {
    const [form] = Form.useForm();
    const [manufacturingOrders, setManufacturingOrders] = useState<MoListModel[]>([]);
    const [poS, setPos] = useState<PKMSPackOrderInfoModel[]>([]);
    const [packOrderData, setPackOrderData] = useState<PKMSPackOrderInfoModel[]>([]);
    const [selectedPo, setSelectedPo] = useState<number>();
    const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<number>();

    const manufacturingOrderService = new OrderManipulationServices();
    const poService = new POService();

    const cutGenServices = new CutGenerationServices();
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
            const reqObj = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, MoStatusEnum.IN_PROGRESS);
            const manufacturingOrderRes = await manufacturingOrderService.getListOfMo(reqObj);
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
    const changeManufacturingOrder = async (manufacturingOrder: number) => {
        try {
            setSelectedManufacturingOrder(manufacturingOrder);
            setSelectedPo(undefined);
            form.setFieldValue('packOrder', undefined);
            const reqObj = new PKMSManufacturingOrderIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [manufacturingOrder], false, false, false, false, false, false);

            const posResponse = await packListService.getPackOrderInfoByManufacturingOrderIds(reqObj);
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
        const reqObj = new PKMSPackOrderIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPo], true, true, false, false, false, false);
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

    return (
        <Card>
            <Form form={form} onFinish={getPackOrderInfo} layout="horizontal" name="PO">
                <Row style={{ display: 'flex', gap: '0px' }}>
                    <Col xs={24} sm={12} md={10} lg={7}>

                        <Form.Item
                            label="Select Manufacturing Order"

                            name="manufacturingOrder"
                            rules={[{ required: true, message: 'Select MO/Plant Style Ref' }]}
                        >
                            <Select
                                style={{ width: '300px' }}
                                placeholder='Select MO/Plant Style Ref'

                                onChange={changeManufacturingOrder}
                                filterOption={(input, option) =>
                                    (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                                }
                                showSearch
                            >
                                {manufacturingOrders.map(moList => (
                                    <Option value={moList.orderId} key={`${moList.orderId}`}>
                                        {moList.plantStyle ? `${moList.orderNo} - ${moList.plantStyle}` : moList.orderNo}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={12} md={10} lg={7}>

                        <Form.Item
                            label="Select Pack Order"
                            name="packOrder"

                            rules={[{ required: true, message: 'Select Pack Order' }]}
                        >
                            <Select
                                style={{ width: '300px' }}
                                onChange={packOrderOnChange}
                                placeholder="Select Pack Order"
                                showSearch
                                optionFilterProp="label"
                            >
                                {poS.map(poObj => (
                                    <Option key={`s${poObj.packOrderId}`} label={`${poObj?.packListsInfo}`} value={poObj.packOrderId}>
                                        {`${poObj.packOrderId}-${poObj.packOrderDesc}`}
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
                {/* Pass the fetched data to the CutOrderViewC component */}
                <CutOrderDetails cutDispatchData={packOrderData} manufacturingOrderPk={selectedManufacturingOrder} packorderIdPk={selectedPo} />
            </Form>

        </Card>

    );
};

export default PkCreateShippableSetPage;
