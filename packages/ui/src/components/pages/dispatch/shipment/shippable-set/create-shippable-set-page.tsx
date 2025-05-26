import { CommonRequestAttrs, CutStatusEnum, PoCutModel, PoSerialWithCutPrefRequest, PoSummaryModel, RawOrderNoRequest, SI_ManufacturingOrderInfoAbstractModel, MoListModel, MoListRequest, MoStatusEnum } from "@xpparel/shared-models";
import { CutGenerationServices, OrderCreationService, OrderManipulationServices, POService } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
import CutOrderDetails from "./cut-order-details";
import { CutOrderDataIn } from "./create-shippable-interfaces";

const { Option } = Select;
export const CreateShippableSetPage = () => {
    const [form] = Form.useForm();
    const [manufacturingOrders, setManufacturingOrders] = useState<SI_ManufacturingOrderInfoAbstractModel[]>([]);
    const [poS, setPos] = useState<PoSummaryModel[]>([]);
    const [cutDispatchData, setCutDispatchData] = useState<CutOrderDataIn[]>([]);
    const [selectedPo, setSelectedPo] = useState<number>();
    const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<number>();
    const manufacturingOrderService = new OrderManipulationServices();
    const poService = new POService();
    const cutGenServices = new CutGenerationServices();
    const orderCreationService = new OrderCreationService()
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        getManufacturingOrders();
    }, []);

    /**
     * Get manufacturing orders
     */

    const getManufacturingOrders = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
        orderCreationService.getManufacturingOrdersList(req).then(res => {
            if (res.status) {
                setManufacturingOrders(res.data)
            } else {
                setManufacturingOrders([])
            }
        }).catch(err => console.log(err.message))
    }

    /**
     * Handle manufacturing Order Change
     */
    const changeManufacturingOrder = async (manufacturingOrder: number) => {
        try {
            setSelectedManufacturingOrder(manufacturingOrder);
            setSelectedPo(undefined);
            form.setFieldValue('productionOrder', undefined);
            const reqObj = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, manufacturingOrder, undefined, undefined, undefined, false, false, false, false, false);
            const posResponse = await poService.getPosForMo(reqObj);
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
    const poOnChange = (poId: number) => {
        setSelectedPo(poId);
    };

    /**
     * Get cut dispatch info for manufacturing order and PO number
     */

    const getCutsInfo = async () => {
        try {
            const reqObj = new PoSerialWithCutPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedPo, true, true, false, false, false, false, undefined);
            const cutDispatchRes = await cutGenServices.getCutInfoForPo(reqObj);
            if (cutDispatchRes.status) {
                const resultData: PoCutModel[] = cutDispatchRes.data;
                const finalData: CutOrderDataIn[] = [];
                resultData.forEach((Item) => {
                    // Create a new CutOrderData object here
                    const newCutOrderData: CutOrderDataIn = {
                        manufacturingOrder: Item.moNumber || '',
                        cutOrder: Item.cutSubNumber,
                        cutSubNumber: Item.cutSubNumber,
                        cut: Item.cutNumber || '',
                        totalQuantity: Item.planQuantity || 0,
                        totalPlannedBundles: Item.plannedBundles || 0,
                        cutId: Item.cutId,
                        productName: Item.productName,
                        selectedPo: selectedPo,
                        dockets: [], // Initialize empty arrays
                        actualDockets: [],
                        totalShadeBundles: 0, // Initialize to zero
                        isCutComplete: false,
                    };
                    const dockets = Item.dockets;
                    const actualDockets = Item.actualDockets;
                    let totalOriginalDocketPlies = 0;
                    dockets.forEach(docket => {
                        totalOriginalDocketPlies += docket.plies;
                        newCutOrderData.dockets.push({
                            docket: docket.docketNumber || '',
                            mainDocket: docket.isMainDoc || false,
                            item: docket.itemCode || '',
                            itemDesc: docket.itemDesc || '',
                            plies: docket.plies || 0,
                        });
                    });

                    let totalShadeBundlesSum = 0;
                    let totalADLayedPliesSum = 0;
                    actualDockets.forEach(actualDocket => {
                        // if (actualDocket.cutStatus === CutStatusEnum.OPEN) {
                        totalShadeBundlesSum += actualDocket.totalAdbs;
                        // }

                        totalADLayedPliesSum += actualDocket.actualDocketPlies;
                        newCutOrderData.actualDockets.push({
                            laynumber: actualDocket.layNumber || 0,
                            layedPlies: actualDocket.actualDocketPlies || 0,
                            cutStatus: actualDocket.cutStatus,
                            docketNumber: actualDocket.docketNumber || '',
                        });
                    });
                    //totalShadeBundlesSum is the sum of totalAdbs in actualDocket
                    newCutOrderData.totalShadeBundles = totalShadeBundlesSum;
                    //sum of unique docket plies === sum of actualdocket layedplies then isCutComplete=true
                    if (totalOriginalDocketPlies == totalADLayedPliesSum) {
                        newCutOrderData.isCutComplete = true;
                    }
                    finalData.push(newCutOrderData);
                });
                const sortingOrderByCutSubNoCutNo = finalData.sort((a, b) => (`${a.cutOrder}-${a.cut}`) > (`${b.cutOrder}-${b.cut}`) ? 1 : -1)
                // Set the final data
                setCutDispatchData(sortingOrderByCutSubNoCutNo);
            }
            else {
                AlertMessages.getErrorMessage(cutDispatchRes.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    return (
        <Card>
            <Form form={form} onFinish={getCutsInfo} layout='vertical' name="PO">
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
                                    <Option value={moList.moPk} key={`${moList.moPk}`}>
                                        {moList.style ? `${moList.moNumber} - ${moList.style}` : moList.moNumber}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={12} md={10} lg={7}>

                        <Form.Item
                            label="Select Cut Order"
                            name="productionOrder"

                            rules={[{ required: true, message: 'Select Cut Order' }]}
                        >
                            <Select
                                style={{ width: '300px' }}
                                onChange={poOnChange}
                                placeholder="Select Cut Order"
                                showSearch
                                optionFilterProp="label"
                            >
                                {poS.map(poObj => (
                                    <Option key={`s${poObj.poId}`} label={`${poObj.poSerial}-${poObj.poDesc}`} value={poObj.poSerial}>
                                        {`${poObj.poSerial}-${poObj.poDesc}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={12} md={4} lg={4}>

                        <Form.Item label={' '}>
                            <Button type="primary" htmlType="submit" >
                                Search
                            </Button>
                        </Form.Item>

                    </Col>
                </Row>
                {/* Pass the fetched data to the CutOrderViewC component */}
                <CutOrderDetails cutDispatchData={cutDispatchData} manufacturingOrderPk={selectedManufacturingOrder} />
            </Form>

        </Card>

    );
};

export default CreateShippableSetPage;
