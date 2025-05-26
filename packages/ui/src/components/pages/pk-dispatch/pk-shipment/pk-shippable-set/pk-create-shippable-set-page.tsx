import { PKMSPackOrderIdRequest, PKMSPackOrderInfoModel, PKMSManufacturingOrderIdRequest, MoListModel, MoListRequest, MoStatusEnum, CommonRequestAttrs, MoNumberResDto, PackOrderResponseDto } from "@xpparel/shared-models";
import { CutGenerationServices, OrderManipulationServices, POService, PackListService, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
import CutOrderDetails from "./pk-cut-order-details";

const { Option } = Select;
export const PkCreateShippableSetPage = () => {
    const [form] = Form.useForm();
    const [manufacturingOrders, setManufacturingOrders] = useState<MoNumberResDto[]>([]);
    const [poS, setPos] = useState<PackOrderResponseDto[]>([]);
    const [packOrderData, setPackOrderData] = useState<PKMSPackOrderInfoModel[]>([]);
    const [selectedPo, setSelectedPo] = useState<number>();
    const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<string>();
    const manufacturingOrderService = new OrderManipulationServices();
    const poService = new POService();

    const cutGenServices = new CutGenerationServices();
    const packListService = new PackListService();
    const user = useAppSelector((state) => state.user.user.user);
    const preIntegrationServicePKMS = new PreIntegrationServicePKMS();

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
    const changeManufacturingOrder = async (manufacturingOrder: string, option: any) => {
        try {
            setSelectedManufacturingOrder(option?.exChildren);
            setSelectedPo(undefined);
            form.setFieldValue('packOrder', undefined);
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
        form.validateFields().then(async values => {
            const reqObj = new PKMSPackOrderIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPo], true, true, false, false, false, false, false, false, true);
            try {
                const res = await packListService.getPackOrderInfoByPackOrderId(reqObj);
                if (res.status) {
                    setPackOrderData(res.data);
                } else {
                    // setPos([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            } catch (err) {
                AlertMessages.getErrorMessage(err.message);
            }
        }).catch(err => console.log(err))


    };

    return (
        <Card>
            <Form form={form} onFinish={getPackOrderInfo} layout='horizontal' name="PO" >
                <Row gutter={[24,24]}>
                    <Col xs={24} sm={24} md={9} lg={8} xl={8}>

                        <Form.Item
                            label="Select Manufacturing Order"
                            name="manufacturingOrder"
                            rules={[{ required: true, message: 'Select MO/Plant Style Ref' }]}
                        >
                            <Select
                                // style={{ width: '300px' }}
                                placeholder='Select MO/Plant Style Ref'
                                allowClear
                                onChange={(e, option) => {
                                    changeManufacturingOrder(e, option)
                                }}
                                filterOption={(input, option) =>
                                    (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                                }
                                showSearch
                            >
                                {manufacturingOrders.map(moList => (
                                    <Option value={moList.moNumber} key={`${moList.moNumber}`} exChildren={moList.moId}>
                                        {moList.moNumber}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                  <Col xs={24} sm={24} md={9} lg={8} xl={8}>

                        <Form.Item
                            label="Select Pack Order"
                            name="packOrder"

                            rules={[{ required: true, message: 'Select Pack Order' }]}
                        >
                            <Select
                                // style={{ width: '300px' }}
                                onChange={packOrderOnChange}
                                placeholder="Select Pack Order"
                                showSearch
                                optionFilterProp="label"
                                allowClear
                            >
                                {poS.map(poObj => (
                                    <Option key={`s${poObj.poId}`} label={`${poObj?.packOrderNumber}`} value={Number(poObj.poId)}>
                                        {poObj.packOrderNumber}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col>
                        <Form.Item
                            // label={' '}
                        >
                            <Button type="primary" htmlType="submit" >
                                Search
                            </Button>
                        </Form.Item>

                    </Col>
                </Row>
                {/* Pass the fetched data to the CutOrderViewC component */}
                <CutOrderDetails
                    cutDispatchData={packOrderData}
                    manufacturingOrderPk={selectedManufacturingOrder}
                    packorderIdPk={selectedPo}
                />
            </Form>

        </Card>

    );
};

export default PkCreateShippableSetPage;
