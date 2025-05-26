import { CommonRequestAttrs, MC_StyleMoNumbersRequest, MoNumberDropdownModel, PackSerialRequest, ProcessTypeEnum, ProcessingOrderCreationInfoModel, ProcessingOrderCreationRequest, ProcessingOrderInfoModel, ProcessingOrderStatusEnum, ProcessingOrderViewInfoModel, RoutingGroupDetail, StyleCodeRequest, StyleMoRequest, StyleModel, TaskStatusEnum } from '@xpparel/shared-models'
import { MOConfigService, OrderCreationService, PreIntegrationServicePKMS, StyleSharedService } from '@xpparel/shared-services'
import { Button, Card, Col, Form, Row, Select } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import ProcessingOrder from 'packages/ui/src/common/processing-order/processing-order'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AlertMessages } from '../../../common'


const { Item } = Form;

interface IProps {
    onProceed: (rec: ProcessingOrderViewInfoModel) => void;
    setSelectedStyleAndMo: Dispatch<SetStateAction<{ style: string; mo: string; }>>;
    currentStep: number;
    selectedStyleAndMo: { style: string; mo: string; }
}

const PKMSProcessingOrderCreation = (props: IProps) => {
    const { onProceed, setSelectedStyleAndMo, currentStep, selectedStyleAndMo } = props;
    const [formRef] = Form.useForm();
    const preIntegrationServicePKMS = new PreIntegrationServicePKMS();
    const mOConfigService = new MOConfigService()
    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([])
    const [soNumberDropdownData, setSoNumberDropdownData] = useState<MoNumberDropdownModel[]>([])
    const user = useAppSelector((state) => state.user.user.user);
    const orderCreationService = new OrderCreationService();
    const [moInfo, setMoInfo] = useState<ProcessingOrderCreationInfoModel[]>([]);
    const [openProcessingOrderInfo, setOpenProcessingOrderInfo] = useState<ProcessingOrderViewInfoModel[]>([]);
    const styleSharedService = new StyleSharedService();
    const [moRoutingGroups, setMoRoutingGroups] = useState<RoutingGroupDetail[]>([])
    const moConfigService = new MOConfigService();
    const [updateKey, setUpdateKey] = useState<number>(0);
    const [activeTab, updateActiveTab] = useState<string>('open');

    useEffect(() => {
        if (selectedStyleAndMo?.style)
            formRef.setFieldValue('styleCode', selectedStyleAndMo?.style);
        if (selectedStyleAndMo?.mo)
            formRef.setFieldValue('moNumber', selectedStyleAndMo?.mo?.split(','));
    }, [currentStep])

    useEffect(() => {
        getStyleCodeDropdownData();
    }, [])

    const getStyleCodeDropdownData = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        styleSharedService.getAllStyles(reqObj).then((res) => {
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

    const createPackingOrder = (values: ProcessingOrderCreationRequest) => {
        preIntegrationServicePKMS.createPKMSProcessingOrder(values).then(res => {
            if (res.status) {
                getMOInfoForPKMSPrcOrdCreation(formRef.getFieldsValue())
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    };


    const getMOInfoForPKMSPrcOrdCreation = (values) => {
        const pReq = new MC_StyleMoNumbersRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.moNumber, values.styleCode)
        mOConfigService.checkAndGetBundleGroupsForGivenMos(pReq).then(res => {
            if (res.status) {
                setUpdateKey(preKey => preKey + 1);
                setMoRoutingGroups(res.data.filter((v) => v.procType === ProcessTypeEnum.PACK))
                const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.styleCode, values.moNumber, ProcessTypeEnum.PACK)
                preIntegrationServicePKMS.getMOInfoForPKMSPrcOrdCreation(req).then(response => {
                    if (response.status) {
                        setMoInfo(response.data);
                        setActiveTab('open')
                    } else {
                        AlertMessages.getErrorMessage(response.internalMessage)
                        setMoInfo([])
                    }
                }).catch(err => {
                    setMoInfo([])
                    console.log(err.message)
                })
            } else {
                setMoRoutingGroups([])
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message))


    }

    const getMoNumberDropdownData = (styleCode: string) => {
        const styleCodeReq = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode)
        orderCreationService.getMoNumbersForStyleCode(styleCodeReq).then((res) => {
            if (res.status) {
                setSoNumberDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setSoNumberDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setSoNumberDropdownData([]);
            });
    }

    const onStyleCodeChange = (value: string) => {
        setSelectedStyleAndMo(prev => {
            return {
                ...prev,
                style: value,
                mo: ''
            }
        })
        formRef.setFieldValue('moNumber', undefined)
        getMoNumberDropdownData(value)
    };

    function constructOrderInfo(data: ProcessingOrderInfoModel[]) {
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

    const getPKMSPoInfoForStyleAndMo = (status: ProcessingOrderStatusEnum) => {
        const styleCode = formRef.getFieldValue('styleCode');
        const moNumbers = formRef.getFieldValue('moNumber');
        const req = new StyleMoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode, moNumbers, ProcessTypeEnum.PACK, status)
        preIntegrationServicePKMS.getPKMSPoInfoForStyleAndMo(req).then(res => {
            if (res.status) {
                const data = constructOrderInfo(res.data);
                setOpenProcessingOrderInfo(data);
            } else {
                setOpenProcessingOrderInfo([]);

            }
        }).catch(err => console.log(err.message));
    }

    const setActiveTab = (value: "create" | "open" | "inprogress") => {
        updateActiveTab(value);
        if (value === 'open') {
            getPKMSPoInfoForStyleAndMo(ProcessingOrderStatusEnum.OPEN)
        } else if (value === 'inprogress') {
            getPKMSPoInfoForStyleAndMo(ProcessingOrderStatusEnum.INPROGRESS)
        }
    }


    const deletePackOrder = (rec: ProcessingOrderViewInfoModel) => {
        const req = new PackSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rec.processingSerial, undefined, false, false)
        preIntegrationServicePKMS.deletePackOrder(req).then(res => {
            if (res.status) {
                getPKMSPoInfoForStyleAndMo(ProcessingOrderStatusEnum.OPEN)
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }

    return <>
        <Form form={formRef} layout='horizontal' onFinish={getMOInfoForPKMSPrcOrdCreation}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                    <Item name={'styleCode'} label="Style" required rules={[{ required: true, message: "Please select style code" }]} >
                        <Select
                            style={{ width: '100%' }}
                            onChange={onStyleCodeChange}
                            placeholder="Select style code"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                            }
                        >
                            {
                                styleCodeDropdownData?.length && styleCodeDropdownData.map((v) => (<Select.Option value={v.styleCode} key={v.styleCode}>{v.styleCode}</Select.Option>))
                            }
                        </Select>
                    </Item>
                </Col>
                <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                    <Item name={'moNumber'} label="MO Number" required rules={[{ required: true, message: "Please select MO Number" }]}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder={"Select MO Number"}
                            showSearch
                            allowClear
                            mode='multiple'
                            onChange={(e) => {
                                setSelectedStyleAndMo(prev => {
                                    return {
                                        ...prev,
                                        mo: e?.toString()
                                    }
                                })
                            }}
                            maxTagCount={10}
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
                            }
                        >
                            {
                                soNumberDropdownData.length && soNumberDropdownData.map((v) => (<Select.Option value={v.moNumber}>{v.moNumber}</Select.Option>))
                            }
                        </Select>
                    </Item>
                </Col>
                <Col span={2}  >
                    <Form.Item label={' '}>
                        <Button type='primary' htmlType="submit">Submit</Button>

                    </Form.Item>
                </Col>
            </Row>
        </Form >
        <Card>
            <ProcessingOrder
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                inprogressProcessingOrderInfo={openProcessingOrderInfo}
                styleCode={formRef.getFieldValue('styleCode')}
                moInfo={moInfo}
                onCreatePo={createPackingOrder}
                openProcessingOrderInfo={openProcessingOrderInfo}
                onProceed={onProceed}
                routingGroups={moRoutingGroups}
                updateKey={updateKey}
                onDelete={deletePackOrder}
            />

        </Card>
    </>
}

export default PKMSProcessingOrderCreation