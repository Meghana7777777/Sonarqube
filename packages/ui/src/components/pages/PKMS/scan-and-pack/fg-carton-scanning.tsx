import { ScanOutlined } from '@ant-design/icons';
import { CartonFillingModel, CartonScanReqNoDto, FeatureEnum, PkmsReportingConfigurationRequestModel, PkmsReportingConfigurationResponseDto, ReportingLevelsEnum, cartonBarcodePatternRegExp, cartonBarcodeRegExp } from '@xpparel/shared-models';
import { PackListViewServices, PkmsReportingConfigurationService } from '@xpparel/shared-services';
import { Alert, Card, Col, Form, Input, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useCallbackPrompt } from "../../../../common";
import ScanAndPack from './carton-filling';
import { AlertMessages, RouterPrompt } from '../../../common';

const { Search } = Input;
interface DisplayMsg {
    isSuccess: boolean;
    msg: string;
}
export const FgCartonFilling = () => {
    const [formRef] = Form.useForm();
    const [activeCartonData, setActiveCartonData] = useState<CartonFillingModel>();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);
    const [activePoyBagTab, setActivePoyBagTab] = useState<string>(undefined);
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [configuration, setConfiguration] = useState<PkmsReportingConfigurationResponseDto>();
    
    const cartonInputRef = useRef(null);

    const packListViewServices = new PackListViewServices()
    const pkmsReportingConfigurationService = new PkmsReportingConfigurationService();

    useEffect(() => {
        cartonInputFocus();
        getAllReportingConfigurations();
    }, []);

    useEffect(() => {
        if (activeCartonData && activeCartonData?.qty - activeCartonData?.scannedQy <= 0) {
            AlertMessages.getSuccessMessage(`Carton ${activeCartonData?.cartonNo} is fully scanned`);
            setTimeout(() => {
                restForms();
            }, 2)
        }
    }, [activeCartonData]);


    const getAllReportingConfigurations = () => {
        const req = new PkmsReportingConfigurationRequestModel(FeatureEnum.CARTON_REPORTING, userName, orgData.unitCode, orgData.companyCode, userId,)
        pkmsReportingConfigurationService.getAllReportingConfigurations(req).then(res => {
            if (res.status) {
                setConfiguration(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message))
    }




    const cartonInputFocus = () => {
        if (cartonInputRef.current) {
            cartonInputRef.current.focus();
        }
    };

    let timeoutId;
    const scanBarcodeValue = (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (value) {
                getFgCartonFillingData(value)
            }
        }, 2)
    }
    const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
        const displayObj: DisplayMsg = { isSuccess, msg }
        setDisplayMsg(displayObj);
    }
    const getFgCartonFillingData = (cartonNo: string) => {
        const req = new CartonScanReqNoDto(userName, orgData.unitCode, orgData.companyCode, userId, cartonNo,configuration.isExternal);
        if (configuration.feature === ReportingLevelsEnum.CARTON) {
            packListViewServices.cartonsFillingInCartonsLevel(req).then(res => {
                if (res.status) {
                    restForms()
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err.message)
            })
        } else {
            packListViewServices.getFgCartonFillingData(req).then(res => {
                if (res.status) {
                    setActiveCartonData(res.data);
                    setActivePoyBagTab(res?.data?.plannedPolyBagDetails[0]?.id?.toString());
                    setShowDialog(true);
                } else {
                    addDisplayMsg(res.internalMessage);
                    restForms()
                }
            }).catch(err => {
                restForms();
                addDisplayMsg(err.message);
            })
        }

    }

    const resetCarton = () => {
        setShowDialog(false);
        setActiveCartonData(undefined)
    }

    const restForms = () => {
        formRef.resetFields();
        setShowDialog(false);
        setActiveCartonData(undefined)
        setTimeout(() => {
            cartonInputFocus();
        }, 1)
    }
    const closeMsg = () => {
        cartonInputFocus();
        removeDIsplayMsg();
    }
    const removeDIsplayMsg = () => {
        setDisplayMsg(undefined);
    }

    return <>
        <RouterPrompt
            type="question"
            showDialog={showPrompt}
            confirmNavigation={confirmNavigation}
            cancelNavigation={cancelNavigation}
            title="Are you sure you want to exit?"
            subText="Packing Process will be halted"
        />
        {!activeCartonData &&
            <Row gutter={[16, 16]} justify="center">
                 <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
                    <Card
                        title={'Fg Carton Filling'}
                        size='small'
                        extra={
                            <Space size={'large'}>
                                {displayMsg && <Alert
                                    message={displayMsg.msg}
                                    type={displayMsg.isSuccess ? "success" : 'error'}
                                    style={{ padding: '8px 12px' }}
                                    banner
                                    showIcon
                                    closable
                                    afterClose={closeMsg}
                                />}

                            </Space>
                        }
                    >
                        <Form
                            layout='horizontal'
                            form={formRef}
                        >
                             <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name='cartonNo'
                                        label='Scan Carton No'
                                        rules={[{
                                            required: true,
                                            pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                    >
                                        <Input
                                            disabled={configuration?.feature ? false : true}
                                            onChange={(v) => {
                                                if (cartonBarcodePatternRegExp.test(v.target.value)) {
                                                    scanBarcodeValue(v.target.value)
                                                }
                                            }}
                                            ref={cartonInputRef}
                                            placeholder='Scan Carton No'
                                            prefix={<ScanOutlined />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name='enteredCartonNo'
                                        rules={[{
                                            required: true,
                                            pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                    >
                                        <Search
                                            disabled={configuration?.feature ? false : true}
                                            placeholder='Type Carton No'
                                            enterButton
                                            onChange={(v) => {
                                                const pattern = cartonBarcodePatternRegExp;
                                                if (pattern.test(v.target.value)) {
                                                    scanBarcodeValue(v.target.value)
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>

                        </Form>
                    </Card>
                </Col>
                <Col span={5}></Col>
            </Row >
        }
        {activeCartonData &&
            <ScanAndPack getFgCartonFillingData={getFgCartonFillingData} activeCartonData={activeCartonData} resetCarton={resetCarton} setActiveCartonData={setActiveCartonData} activePoyBagTab={activePoyBagTab} setActivePoyBagTab={setActivePoyBagTab} configuration={configuration}/>
        }




    </>
}

export default FgCartonFilling