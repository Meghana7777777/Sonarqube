import { ScanOutlined } from '@ant-design/icons';
import { FabricUOM, InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum, InsIrIdRequest, InsRollBarcodeInspCategoryReq, InsShrinkageInspectionRequest, InsShrinkageRollInfo, InsShrinkageTypeEnum, InsShrinkageTypeInspectionRollDetails } from '@xpparel/shared-models';
import { FabricInspectionCaptureService, FabricInspectionInfoService } from '@xpparel/shared-services';
import { Affix, Badge, Button, Col, Form, Input, Progress, Row, Space } from 'antd';
import Search from 'antd/es/input/Search';
import 'jspdf-autotable';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../../common';
import { AlertMessages } from '../../../../../../components/common';
import { ScxCard } from '../../../../../../schemax-component-lib';
import { InspectionAttributesInfo } from '../inspection-attributes-info';
import { InspectionHeaderForm } from '../inspection-header-form';
import RollLevelShrinkageForm from './roll-level-shrinkage-form';
export interface IShrinkageProps {
    inspReqId: number;
    reloadParent?: () => void;
    reload: number;
}

export const Shrinkage = (props: IShrinkageProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [form] = Form.useForm();
    const { inspReqId, reload } = props;
    const [shrinkageInspDetails, setShrinkageInspDetails] = useState<InsShrinkageInspectionRequest>(null);
    const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [stateCounter, setStateCounter] = useState<number>(0);
    const rollInputRef = useRef(null);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const inspectionInfoService = new FabricInspectionInfoService();
    const insCaptureService = new FabricInspectionCaptureService();
    useEffect(() => {
        inspReqId ? getShrinkageInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
    }, [stateCounter, reload]);


    function reloadParentAfterPassFail(isnStatus: InsInspectionFinalInSpectionStatusEnum) {
        if (props.reloadParent) {
            if (isnStatus == InsInspectionFinalInSpectionStatusEnum.PASS || isnStatus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                props.reloadParent();
            } else {
                setStateCounter(preVal => preVal + 1);
            }
        }
    }

    const getShrinkageInspDetailsByRollBarcode = (e) => {
        console.log(e);
        const rollBarcode = e;
        getShrinkageInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        getShrinkageInspDetailsByRollBarcode(val.trim());
    }

    const getShrinkageInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
            inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    setInspectionData(res.data.shrinkageInfo)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => console.log(err.message));
        }
        if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.SHRINKAGE);
            inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    setInspectionData(res.data.shrinkageInfo)
                    form.resetFields();
                    form.setFieldValue('inspectionRollDetails', res.data?.shrinkageInfo?.inspectionRollDetails);
                } else {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => console.log(err.message));
        }
    }



    const setInspectionData = (inspData: InsShrinkageInspectionRequest) => {
        const inspectedDate: any = moment(inspData.inspectionHeader?.inspectedDate);
        inspData.inspectionHeader.inspectedDate = inspData.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspData.inspectionHeader?.expInspectionCompleteAt);
        inspData.inspectionHeader.expInspectionCompleteAt = inspData.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspData.inspectionHeader?.inspectionStart);
        inspData.inspectionHeader.inspectionStart = inspData.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspData.inspectionHeader?.inspectionCompleteAt);
        inspData.inspectionHeader.inspectionCompleteAt = inspData.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspData.inspectionHeader.inspector = inspData.inspectionHeader.inspector ? inspData.inspectionHeader.inspector : user?.userName;
        setShrinkageInspDetails(inspData);
        setDaysRemaining(moment().diff(moment(inspData.inspectionHeader?.expInspectionCompleteAt), 'days'));

        const totalNoOfRolls = inspData.inspectionRollDetails.length;
        const totalInspOpenRolls = inspData.inspectionRollDetails.filter(eachRoll => eachRoll.rollInfo.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN);
        const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
        const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
        setInspCompPercentage(percentage);
    }

    const getAbstractComp = () => {
        return <></>
    }

    const onFinish = (val: InsShrinkageInspectionRequest) => {
       
        for (const eachRoll of val.inspectionRollDetails) {
            const shrinkageTypes: InsShrinkageTypeInspectionRollDetails[] = [];
            for (const skType of Array.from(Object.keys(InsShrinkageTypeEnum))) {
                const obj: any = new InsShrinkageTypeInspectionRollDetails(undefined, 0, 0, 0, 0, undefined, undefined, FabricUOM.CENTIMETER);
                const skTypeObj = eachRoll.shrinkageTypes.filter(rec => rec.shrinkageType === skType);
                skTypeObj.forEach(rec => {
                    Object.keys(obj).forEach((key) => {
                        if (rec[key]) {
                            obj[key] = rec[key]
                        }
                    })
                })
                shrinkageTypes.push(obj);
            }
            eachRoll.shrinkageTypes = shrinkageTypes;
            if (val.inspectionHeader.inspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                let isError = false;
                for (const shTypes of eachRoll.shrinkageTypes) {
                    if ((!shTypes?.measurementWidth || !shTypes?.measurementLength) || (!shTypes?.lengthAfterSk || !shTypes?.widthAfterSk)) {
                        isError = false;
                        break;
                    }
                    shTypes.uom = FabricUOM.CENTIMETER;
                }
                if (isError) {
                    AlertMessages.getErrorMessage('Still some roll not yet inspected. Please verify.');
                    return;
                }
            }
        }
        if (val.inspectionHeader.inspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
            const isValid = validateShrinkageData(val.inspectionRollDetails)
            console.log('isvalid', isValid)
            if (!isValid) {
                return
            }
        }

        if (val.inspectionHeader.inspectionStatus === InsInspectionFinalInSpectionStatusEnum.OPEN) {
            AlertMessages.getErrorMessage('Final Inspection Status Should Not be Open. Please verify.');
            return;
        }

        insCaptureService.captureInspectionResultsForLabShrinkage(val, true).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                reloadParentAfterPassFail(val.inspectionHeader.inspectionStatus);
                return;
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                return;
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    };

    function validateShrinkageData(data: InsShrinkageRollInfo[]): boolean {
    for (const roll of data) {
        const { rollFinalInsResult, rollInsResult } = roll.rollInfo;

        if (
            rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.OPEN || 
            rollInsResult === InsInspectionFinalInSpectionStatusEnum.OPEN
        ) {
            AlertMessages.getErrorMessage("Roll Level Inspection result is still OPEN. Please finalize the inspection result.");
            return false;
        }

        for (const shrinkage of roll.shrinkageTypes) {
            const {
                measurementWidth,
                measurementLength,
                widthAfterSk,
                lengthAfterSk
            } = shrinkage;
            if (
                measurementWidth < 0 ||
                measurementLength < 0 ||
                widthAfterSk < 0 ||
                lengthAfterSk < 0
            ) {
                AlertMessages.getErrorMessage("Shrinkage values contain negative numbers. Please verify all measurements.");
                return false;
            }
            if (
                measurementWidth === 0 ||
                measurementLength === 0 ||
                widthAfterSk === 0 ||
                lengthAfterSk === 0
            ) {
                AlertMessages.getErrorMessage("Shrinkage values cannot be zero. Please ensure all measurements are filled correctly.");
                return false;
            }
        }
    }

    return true;
}








    const onInspectionStatusChange = (e) => {
        if (!inspReqId) {
            AlertMessages.getErrorMessage('Request status cannot be changed with roll barcode scanning.');
            form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
            return;
        }
        if (e != InsInspectionFinalInSpectionStatusEnum.OPEN) {
            // check all the inspection final results are inspected or not
            const rollInfo: InsShrinkageRollInfo[] = form.getFieldValue('inspectionRollDetails');
            for (const eachRoll of rollInfo) {
                if (!eachRoll.rollInfo.rollFinalInsResult || eachRoll.rollInfo.rollFinalInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN) {
                    eachRoll.rollInfo.rollFinalInsResult = InsInspectionFinalInSpectionStatusEnum.PASS
                    // AlertMessages.getErrorMessage('All the rolls should be final inspected to do the request inspection.');
                    // form.setFieldValue(['inspectionHeader', 'inspectionStatus'], InsInspectionFinalInSpectionStatusEnum.OPEN);
                    // return;
                }
            }
            form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], moment(new Date()));
        } else {
            form.setFieldValue(['inspectionHeader', 'inspectionCompleteAt'], null);
        }
    }

    return (
        <ScxCard title={<span>Shrinkage Inspection</span>} size='small'>
            {shrinkageInspDetails ? <Form form={form} onFinish={onFinish} layout="vertical" initialValues={shrinkageInspDetails}>
                <div id="shrinkageinspId">
                    <Form.List name="inspectionHeader">
                        {(fields, { add, remove }) => (
                            <>
                                <InspectionAttributesInfo headerAttributes={shrinkageInspDetails?.inspectionHeader?.headerAttributes} />
                                <br />
                                <Badge.Ribbon text={<span style={{ textAlign: "left" }}>INSPECTION REQUEST ID: {shrinkageInspDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                                    <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>HEADER DETAILS</span><span style={{ width: "10%" }}>REQUEST TYPE: <b>{shrinkageInspDetails?.inspectionHeader?.inspRequestCategory}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", overflow: 'scroll' }}>
                                            <div style={{ width: "100%" }}>
                                                <InspectionHeaderForm inspectionHeader={shrinkageInspDetails?.inspectionHeader} noOfRolls={shrinkageInspDetails?.inspectionRollDetails?.length} noOfInspectedRolls={shrinkageInspDetails?.inspectionRollDetails?.length} daysRemainingDefault={daysRemaining} onInspectionStatusChange={onInspectionStatusChange} onReRequestCreateCheck={null} />
                                            </div>
                                            {/* <div style={{ width: "19%" }}>
                                            <ScxCard title={<span>SHRINKAGE LEVEL ABSTRACT</span>} size='small'>
                                                {getAbstractComp()}
                                            </ScxCard>
                                        </div> */}
                                        </div>
                                    </ScxCard>
                                </Badge.Ribbon>
                            </>
                        )}
                    </Form.List>
                    <br />
                    <ScxCard size='small' title={<span> ROLL LEVEL INSPECTION</span>}>
                        <Form.List name="inspectionRollDetails">
                            {(fields, { add, remove }) => (
                                <>
                                    <Row>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                            <RollLevelShrinkageForm inspectionRollDetails={shrinkageInspDetails?.inspectionRollDetails} form={form} />
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Form.List>
                    </ScxCard>
                </div>
                <Affix offsetBottom={0}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', margin: 20, padding: 20 }}>
                        <Form.Item>
                            <Button type='primary' htmlType="submit">
                                Save Inspection
                            </Button>
                        </Form.Item>
                    </div>
                </Affix>
            </Form> : <>
                <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
                    <Space>
                        <Col>
                            <Input placeholder="Scan Object Barcode" ref={rollInputRef} value={barcodeVal} autoFocus onChange={(e) => getShrinkageInspDetailsByRollBarcode(e.target.value)} prefix={<ScanOutlined />} />
                        </Col>
                        <Col>
                            <Search placeholder="Type Object Barcode" defaultValue={manualBarcodeVal} onSearch={manualBarcode} enterButton />
                        </Col>
                    </Space>
                </Form.Item>

            </>}
        </ScxCard >
    )
}

export default Shrinkage;