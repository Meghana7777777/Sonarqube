import { CommonRequestAttrs, MC_StyleMoNumbersRequest, MoNumberDropdownModel, ProcessingOrderCreationInfoModel, ProcessingOrderCreationRequest, ProcessingOrderInfoModel, ProcessingOrderSerialRequest, ProcessingOrderStatusEnum, ProcessingOrderViewInfoModel, ProcessTypeEnum, RoutingGroupDetail, StyleCodeRequest, StyleModel, StyleMoRequest, SingleProcessTypes } from "@xpparel/shared-models";
import { KnitOrderService, MOConfigService, OrderCreationService, SewingProcessingOrderService, StyleSharedService } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Modal, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import ProcessingOrder from "packages/ui/src/common/processing-order/processing-order";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
const { Item } = Form
const { Option } = Select
const { confirm, info } = Modal;

interface SpsProcessingOrderProps {
    onStepChange: (step: number, selectedRecord: any) => void;
    setPrcSerialAndStyleCode: ({ processingSerial, styleCode }: any) => void;
}

export default function SpsProcessingOrder(props: SpsProcessingOrderProps) {
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
    const sewingProcessingOrderService = new SewingProcessingOrderService()

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
                    const spsRputingGroups = res.data.filter((v) => !SingleProcessTypes.includes(v.procType));
                    if(spsRputingGroups.length == 0) {
                        AlertMessages.getErrorMessage("No processing types found for the routing group");
                        return;
                    }
                    setMoRoutingGroups(spsRputingGroups)
                    getMoInfoForMoCreation(spsRputingGroups[0].procType)
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
        sewingProcessingOrderService.getMOInfoForPrcOrdCreation(req).then((res) => {
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
        sewingProcessingOrderService.createSPSProcessingOrder(values).then((res) => {
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
        sewingProcessingOrderService.getPoInfoForStyleAndMo(req).then((res) => {
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
            // getMoInfoForMoCreation(activeRoutingGroup)
        }
        if (activeTab === "open" || activeTab === "inprogress") {
            checkAndGetBundleGroupsForGivenMos()
            getProcessingOrderInfo()
        }
    }

    function onProceedClick(rec) {
        setPrcSerialAndStyleCode({ processingSerial: rec.processingSerial, styleCode: rec.styleCode })
        onStepChange(1, { processingSerial: rec.processingSerial, styleCode: rec.styleCode })
    }

    function onDeleteClick(rec) {
        const poSerialRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rec.processingSerial], ProcessTypeEnum.KNIT)
        sewingProcessingOrderService.deleteSPSProcesisngOrder(poSerialRequest).then((res) => {
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


    return (
        <Card>
            <Form form={form} onFinish={onMoNumberChange} layout="horizontal">
                <Row gutter={[16, 16]}>
                     <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please Select Style Code" }]} >
                            <Select allowClear showSearch onChange={onStyleCodeChange} placeholder="Select Style Code" filterOption={(input, option) =>
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
                        <Item name={'moNumber'} label="MO Number" required rules={[{ required: true, message: "Please Select MO Number" }]}>
                            <Select placeholder={"Select MO Number"} showSearch allowClear mode='multiple'>
                                {
                                    moNumberDropdownData.length && moNumberDropdownData.map((v) => (<Option value={v.moNumber}>{v.moNumber}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Col>

                </Row>
            </Form>
            <ProcessingOrder routingGroups={moRoutingGroups} proceedText='Proceed' onCreatePo={createSpsPO} styleCode={form.getFieldValue('styleCode')} moInfo={moInfo} activeTab={activeTab} setActiveTab={setActiveTab} updateKey={updateKey} openProcessingOrderInfo={processingOrderInfo} inprogressProcessingOrderInfo={processingOrderInfo} onDelete={onDeleteClick} onProceed={onProceedClick} setActiveRoutingGroupP={setActiveRoutingGroup} />
        </Card>
    )
}