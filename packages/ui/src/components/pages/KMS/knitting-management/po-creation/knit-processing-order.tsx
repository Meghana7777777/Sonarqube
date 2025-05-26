import { StyleCodesDropdownModel, MoNumberDropdownModel, StyleCodeRequest, CommonRequestAttrs, ProcessTypeEnum, ProcessingOrderCreationRequest, ProcessingOrderCreationInfoModel, StyleMoRequest, ProcessingOrderViewInfoModel, ProcessingOrderInfoModel, StyleModel, MC_StyleMoNumbersRequest, RoutingGroupDetail, ProcessingOrderSerialRequest, ProcessingOrderStatusEnum } from '@xpparel/shared-models'
import { KnitOrderService, MOConfigService, OrderCreationService, OrderManagementService, StyleSharedService } from '@xpparel/shared-services'
import { Button, Card, Col, Form, Row, Select, Tabs } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import ProcessingOrder from 'packages/ui/src/common/processing-order/processing-order'
import { AlertMessages } from 'packages/ui/src/components/common'
import { useEffect, useState } from 'react'
import { POInfoCommonProps } from '../knit-interface'

const { Item } = Form
const { Option } = Select

interface KnitProcessingOrderProps {
    onStepChange: (step: number, selectedRecord: POInfoCommonProps) => void;
    setPrcSerialAndStyleCode: ({ processingSerial, styleCode }: POInfoCommonProps) => void;
}
export default function KnitProcessingOrder(props: KnitProcessingOrderProps) {
    const { onStepChange, setPrcSerialAndStyleCode } = props
    const [form] = Form.useForm()
    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([])
    const [moNumberDropdownData, setMoNumberDropdownData] = useState<MoNumberDropdownModel[]>([])
    const [moInfo, setMoInfo] = useState<ProcessingOrderCreationInfoModel[]>()
    const [activeTab, setActiveTab] = useState<"create" | "open" | "inprogress">("open")
    const user = useAppSelector((state) => state.user.user.user);
    const [processingOrderInfo, setProcessingOrderInfo] = useState<ProcessingOrderViewInfoModel[]>([])
    const [moRoutingGroups, setMoRoutingGroups] = useState<RoutingGroupDetail[]>([]);
    const [updateKey, setUpdateKey] = useState<number>(0);

    const knittingService = new KnitOrderService();
    const ordercreationService = new OrderCreationService();
    const moConfigService = new MOConfigService();
    const stylesService = new StyleSharedService();

    useEffect(() => {
        getStyleCodeDropdownData()
    }, [])


    useEffect(() => {
        if (form.getFieldValue('styleCode') && form.getFieldValue('moNumber')) {
            if (activeTab === "create") {
                getMoInfoForMoCreation()
            }
            if (activeTab === "open" || activeTab === 'inprogress') {
                getProcessingOrderInfo()
            }
        }
    }, [activeTab])

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
            }).finally(() => {
                setProcessingOrderInfo([])
                setMoInfo([])
                setMoRoutingGroups([])
                setMoNumberDropdownData([])
            });
    }

    const getMoNumberDropdownData = () => {
        const styleCode = form.getFieldValue('styleCode');
        const styleCodeReq = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode)
        ordercreationService.getMoNumbersForStyleCode(styleCodeReq).then((res) => {
            if (res.status) {
                setMoNumberDropdownData(res.data)
                setProcessingOrderInfo([])
                setMoInfo([])
                setMoRoutingGroups([])
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setMoNumberDropdownData([]);
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
                    setMoRoutingGroups(res.data.filter((v) => v.procType === ProcessTypeEnum.KNIT))
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


    const getMoInfoForMoCreation = () => {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');
        const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, moNumbers, ProcessTypeEnum.KNIT)
        knittingService.getMOInfoForPrcOrdCreation(req).then((res) => {
            if (res.status) {
                setUpdateKey(preKey => preKey + 1);
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

    const createKnitPO = (values: ProcessingOrderCreationRequest) => {
        knittingService.createKnitProcessingOrder(values).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage("PO created successfully");
                setActiveTab('open')
                setUpdateKey(preKey => preKey + 1);

            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }


    const deleteKnitPo = (rec: ProcessingOrderViewInfoModel) => {
        const poSerialRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rec.processingSerial], ProcessTypeEnum.KNIT)
        knittingService.deleteKnitProcesisngOrder(poSerialRequest).then((res) => {
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


    const getProcessingOrderInfo = () => {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');
        const status = activeTab === 'open' ? ProcessingOrderStatusEnum.OPEN : ProcessingOrderStatusEnum.INPROGRESS
        const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, moNumbers, ProcessTypeEnum.KNIT, status)
        knittingService.getPoInfoForStyleAndMo(req).then((res) => {
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
                moNumber: "",
                poName: po.prcOrdDescription,
                moLineNumber: "",
                customerName: "",
                poQty: 0,
                fgColor: ""
            };

            for (const moInfo of po.prcOrdMoInfo) {
                processingOrderViewInfoObj.moNumber = moInfo.moNumber;

                // Create sets for unique values
                const uniqueMoLines = new Set<string>();
                const uniqueFgColors = new Set<string>();

                for (const line of moInfo.prcOrdLineInfo) {
                    // Add MO line number to set
                    uniqueMoLines.add(line.moLineNumber);

                    for (const product of line.productInfo) {
                        for (const subLine of product.prcOrdSubLineInfo) {
                            processingOrderViewInfoObj.poQty += subLine.quantity;

                            // Add fgColor to set if it exists
                            if (subLine.fgColor) {
                                uniqueFgColors.add(subLine.fgColor);
                            }
                        }
                    }
                }

                // Convert sets to comma-separated strings
                processingOrderViewInfoObj.moLineNumber = Array.from(uniqueMoLines).join(", ");
                processingOrderViewInfoObj.fgColor = Array.from(uniqueFgColors).join(", ");

                if (moInfo.prcOrdMoFeatures.length > 0) {
                    processingOrderViewInfoObj.customerName = moInfo.prcOrdMoFeatures[0].customerName[0] || "";
                }
            }

            processingOrderViewInfoArr.push(processingOrderViewInfoObj);
        }

        return processingOrderViewInfoArr;
    }


    function onMoNumberChange() {
        const styleCode = form.getFieldValue('styleCode');
        const moNumbers = form.getFieldValue('moNumber');

        if (!styleCode || !moNumbers || moNumbers.length === 0) {
            return; // Exit if required fields are not filled
        }

        checkAndGetBundleGroupsForGivenMos();

        if (activeTab === "create") {
            getMoInfoForMoCreation();
        } else if (activeTab === "open" || activeTab === "inprogress") {
            getProcessingOrderInfo();
        }
    }


    function onProceedClick(rec) {
        setPrcSerialAndStyleCode({ processingSerial: rec.processingSerial, styleCode: rec.styleCode })
        onStepChange(1, { processingSerial: rec.processingSerial, styleCode: rec.styleCode })
    }




    return (
        <Card >
            <Form form={form} onFinish={onMoNumberChange} layout="horizontal">
                <Row gutter={[16, 16]}>
                     <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please select style code" }]} >
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
                        <Item name={'moNumber'} label="MO Number" required rules={[{ required: true, message: "Please select SO Number" }]}>
                            <Select placeholder={"Select MO Number"} showSearch allowClear mode='multiple'>
                                {
                                    moNumberDropdownData.length && moNumberDropdownData.map((v) => (<Option value={v.moNumber}>{v.moNumber}</Option>))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Item>
                    </Col>

                </Row>
            </Form>

            <ProcessingOrder routingGroups={moRoutingGroups} updateKey={updateKey + 1} proceedText='Proceed' onCreatePo={createKnitPO} styleCode={form.getFieldValue('styleCode')} moInfo={moInfo} activeTab={activeTab} setActiveTab={setActiveTab} openProcessingOrderInfo={processingOrderInfo} inprogressProcessingOrderInfo={processingOrderInfo} onDelete={deleteKnitPo} onProceed={onProceedClick} />

        </Card>
    )
}
