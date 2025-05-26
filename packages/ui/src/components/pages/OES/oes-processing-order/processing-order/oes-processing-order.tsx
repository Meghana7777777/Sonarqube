import { CommonRequestAttrs, MC_StyleMoNumbersRequest, MoNumberDropdownModel, PackMethodEnum, PoLinesModel, PoSubLineModel, PoSummaryModel, ProcessingOrderCreationInfoModel, ProcessingOrderCreationRequest, ProcessingOrderInfoModel, ProcessingOrderSerialRequest, ProcessingOrderStatusEnum, ProcessingOrderViewInfoModel, ProcessTypeEnum, RoutingGroupDetail, StyleCodeRequest, StyleModel, StyleMoRequest } from '@xpparel/shared-models';
import { CutOrderService, MOConfigService, OrderCreationService, StyleSharedService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import ProcessingOrder from 'packages/ui/src/common/processing-order/processing-order';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
const { Item } = Form
const { Option } = Select

interface OESProcessingOrderProps {
    onStepChange: (step: number, selectedRecord: any) => void;
    setPrcSerialAndStyleCode: ({ processingSerial, styleCode }: any) => void;
}

export default function OESProcessingOrder(props: OESProcessingOrderProps) {
    const { onStepChange, setPrcSerialAndStyleCode } = props
    const [form] = Form.useForm()
    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([])
    const [moNumberDropdownData, setMoNumberDropdownData] = useState<MoNumberDropdownModel[]>([])
    const [moInfo, setMoInfo] = useState<ProcessingOrderCreationInfoModel[]>()
    const [activeTab, setActiveTab] = useState<"create" | "open" | "inprogress">("open")
    const user = useAppSelector((state) => state.user.user.user);
    const [processingOrderInfo, setProcessingOrderInfo] = useState<ProcessingOrderViewInfoModel[]>([])
    const [moRoutingGroups, setMoRoutingGroups] = useState<RoutingGroupDetail[]>([])
    const [updateKey, setUpdateKey] = useState<number>(0);
    const [activeRoutingGroup, setActiveRoutingGroup] = useState<ProcessTypeEnum>()
    const cuttingProcessingOrderService = new CutOrderService()

    const ordercreationService = new OrderCreationService()
    const moConfigService = new MOConfigService()
    const stylesService = new StyleSharedService()

    useEffect(() => {
        getStyleCodeDropdownData()
    }, [])

    useEffect(() => {
        if (form.getFieldValue('styleCode') && form.getFieldValue('moNumber')) {
            if (activeTab === "create") {
                getMoInfoForMoCreation(activeRoutingGroup)
            }
            if (activeTab === "open" || activeTab === 'inprogress') {
                getProcessingOrderInfo()
            }
        }
    }, [activeTab, activeRoutingGroup])

    const getStyleCodeDropdownData = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        stylesService.getAllStyles(reqObj).then((res) => {
            if (res.status) {
                setStyleCodeDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setStyleCodeDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setStyleCodeDropdownData([]);
            });
    }

    const getMoNumberDropdownData = () => {
        const styleCode = form.getFieldValue('styleCode');
        const styleCodeReq = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode)
        ordercreationService.getMoNumbersForStyleCode(styleCodeReq).then((res) => {
            if (res.status) {
                setMoNumberDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setStyleCodeDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setMoNumberDropdownData([]);
            });
    }


    const onStyleCodeChange = (v) => {
        setMoInfo([])
        setMoRoutingGroups([])
        setMoNumberDropdownData([])
        setProcessingOrderInfo([])
        form.resetFields(['moNumber'])
        getMoNumberDropdownData()
    }

    const checkAndGetBundleGroupsForGivenMos = () => {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');
        const req = new MC_StyleMoNumbersRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumbers, styleCode,)
        moConfigService.checkAndGetBundleGroupsForGivenMos(req).then((res) => {
            if (res.status) {
                setUpdateKey(preKey => preKey + 1);
                if (res.data.length) {
                    const oesRoutingGroups = res.data.filter((v) => v.procType === ProcessTypeEnum.CUT)
                    if (oesRoutingGroups.length === 0) {
                        AlertMessages.getInfoMessage("Cutting operation not routed to this MO")
                        return
                    }
                    setMoRoutingGroups(oesRoutingGroups)
                }
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setMoRoutingGroups([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setMoRoutingGroups([]);
        });
    }


    const getMoInfoForMoCreation = (processType: ProcessTypeEnum) => {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');
        const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, moNumbers, processType)
        cuttingProcessingOrderService.getMOInfoForPrcOrdCreation(req).then((res) => {
            if (res.status) {
                setMoInfo(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setMoInfo([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setMoInfo([]);
        });
    }

    const createSpsPO = (values: ProcessingOrderCreationRequest) => {
        cuttingProcessingOrderService.createCutProcessingOrder(values).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                setActiveTab('open')
                setUpdateKey(preKey => preKey + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }


    const getProcessingOrderInfo = () => {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');
        const status = activeTab === 'open' ? ProcessingOrderStatusEnum.OPEN : ProcessingOrderStatusEnum.INPROGRESS
        const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, moNumbers, activeRoutingGroup, status)
        cuttingProcessingOrderService.getPoInfoForStyleAndMo(req).then((res) => {
            if (res.status) {
                // construct data into ProcessingOrderViewInfoModel and set
                const poInfo = convertToProcessingOrderViewInfo(res.data)
                setProcessingOrderInfo(poInfo);
                setUpdateKey(preKey => preKey + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setProcessingOrderInfo([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setProcessingOrderInfo([]);
        });
    }


    function convertToProcessingOrderViewInfo(data: ProcessingOrderInfoModel[]): ProcessingOrderViewInfoModel[] {
        const processingOrderViewInfoArr: ProcessingOrderViewInfoModel[] = [];

        for (const po of data) {
            const processingOrderViewInfoObj: ProcessingOrderViewInfoModel = {
                processingSerial: po.processingSerial,
                styleCode: po.styleCode,
                poName: po.prcOrdDescription,
                moNumber: "",
                moLineNumber: "",
                customerName: "",
                poQty: 0,
                fgColor: ""
            };

            for (const moInfo of po.prcOrdMoInfo) {
                processingOrderViewInfoObj.moNumber = moInfo.moNumber;

                processingOrderViewInfoObj.moLineNumber = moInfo.prcOrdLineInfo
                    .map((line) => line.moLineNumber)
                    .join(", ");


                if (moInfo.prcOrdMoFeatures.length > 0) {
                    processingOrderViewInfoObj.customerName = moInfo.prcOrdMoFeatures[0].customerName[0] || "";
                }


                for (const line of moInfo.prcOrdLineInfo) {
                    for (const product of line.productInfo) {
                        for (const subLine of product.prcOrdSubLineInfo) {
                            processingOrderViewInfoObj.poQty += subLine.quantity;


                            if (!processingOrderViewInfoObj.fgColor) {
                                processingOrderViewInfoObj.fgColor = subLine.fgColor;
                            }
                        }
                    }
                }
            }

            processingOrderViewInfoArr.push(processingOrderViewInfoObj);
        }

        return processingOrderViewInfoArr;
    }

    function onMoNumberChange() {
        if (activeTab === "create") {
            checkAndGetBundleGroupsForGivenMos()
            getMoInfoForMoCreation(activeRoutingGroup)
        }
        if (activeTab === "open" || activeTab === "inprogress") {
            checkAndGetBundleGroupsForGivenMos()
            getProcessingOrderInfo()
        }
    }

    function onProceedClick(rec) {
        getPoSummaryInfoForPoSerial(rec)
        setPrcSerialAndStyleCode({ processingSerial: rec.processingSerial, styleCode: rec.styleCode })
    }

    function onDeleteClick(rec) {
        const poSerialRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rec.processingSerial], ProcessTypeEnum.CUT)
        cuttingProcessingOrderService.deleteCutProcesisngOrder(poSerialRequest).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage("PO Deleted successfully");
                setUpdateKey(preKey => preKey + 1);
                onMoNumberChange()
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    const getPoSummaryInfoForPoSerial = (rec: ProcessingOrderViewInfoModel) => {
        const poSerialRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rec.processingSerial], ProcessTypeEnum.CUT)
        cuttingProcessingOrderService.getPoSummaryInfoForPoSerial(poSerialRequest).then((res) => {
            if (res.status) {
                onStepChange(1, res.data[0])
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    return (
        <Card>
            <Form form={form} onFinish={onMoNumberChange}>
                <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please selct style code" }]} >
                            <Select allowClear showSearch onChange={onStyleCodeChange} placeholder="Select style code" filterOption={(input, option) =>
                                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
                            }
                            >
                                {
                                    styleCodeDropdownData.length && styleCodeDropdownData.map((v) => (<Option value={v.styleCode} key={v.styleCode}>{v.styleName}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                       <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Item name={'moNumber'} label="MO Number" required rules={[{ required: true, message: "Please selct SO Number" }]}>
                            <Select placeholder={"Select MO Number"} showSearch allowClear mode='multiple'>
                                {
                                    moNumberDropdownData.length && moNumberDropdownData.map((v) => (<Option value={v.moNumber}>{v.moNumber}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Col>
                </Row>
            </Form>
            <ProcessingOrder routingGroups={moRoutingGroups} proceedText='Proceed' onCreatePo={createSpsPO} styleCode={form.getFieldValue('styleCode')} moInfo={moInfo} activeTab={activeTab} setActiveTab={setActiveTab} updateKey={updateKey} openProcessingOrderInfo={processingOrderInfo} inprogressProcessingOrderInfo={processingOrderInfo} onDelete={onDeleteClick} onProceed={onProceedClick} setActiveRoutingGroupP={setActiveRoutingGroup} />
        </Card>)
}
