import { CheckOutlined, EyeFilled } from "@ant-design/icons";
import { InsInspectionActivityStatusEnum, InsIrActivityChangeRequest, TrimInspectionBasicInfoModel, TrimTypeEnum } from "@xpparel/shared-models";
import { FabricInspectionCreationService, TrimInspectionCreationService } from "@xpparel/shared-services";
import { Col, Form, Image, Input, Modal, Row } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useState } from "react";
import DatePicker, { defaultDateTimeFormat, defaultTimePicker } from "../../../../../common/data-picker/date-picker";
import { getProperDateWithTime } from "../../../../../common/helper-functions";
import materialRecImage from '../icons/ins-material-received.png';
import { IrRollsSummary } from "./ir-rolls-summary";
import { RollSelectionForReRequest } from "./roll-selection-for-re-request";

interface PendingInsControlProps {
    irInfo: TrimInspectionBasicInfoModel;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: TrimTypeEnum;
    reloadDashboard: () => void;
}

const buttonsStyle = {
    width: "50%",
    align: "center",
    justifyContent: "center"
}

declare type CurrentModalOptions = {
    basicInspectionConfirm: boolean,
    shadeInspectionConfirm: boolean,
    labInspectionConfirm: boolean,
    shrinkageConfirm: boolean,
    relaxationConfirm: boolean,
    viewInfo: boolean
};

const currentModalDefaultConfigs: CurrentModalOptions = {
    basicInspectionConfirm: false,
    shadeInspectionConfirm: false,
    labInspectionConfirm: false,
    shrinkageConfirm: false,
    relaxationConfirm: false,
    viewInfo: false
}

const insService = new FabricInspectionCreationService();
const trimInspectionCreationService=new TrimInspectionCreationService();
export const PendingInsControl = (props: PendingInsControlProps) => {
    const [formRef] = Form.useForm();
    const [itemsReqModal, setitemsReqModal] = useState<boolean>(false)
    const [irsInfo, setIrsInfo] = useState<TrimInspectionBasicInfoModel>();
    const [isRequestShowMpodal, setIsRequestShowMpodal] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const [inspectionBasicInfo, setInspectionBasicInfo] = useState<TrimInspectionBasicInfoModel>();


    // -------------------------------- APIS START-------------------------------
    function confirmMaterialReceivedForInspection(req: TrimInspectionBasicInfoModel, date: string, remarks: string) {
        // call the API and confirm the inspection
        const irConfReq = new InsIrActivityChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, req.irId, date, InsInspectionActivityStatusEnum.MATERIAL_RECEIVED, remarks);
        trimInspectionCreationService.updateTrimInspectionActivityStatus(irConfReq).then(res => {
            if (res.status) {
                props.reloadDashboard();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }
    // -------------------------------- APIS END -------------------------------


    // The Form for capturing the date and remarks
    function getMaterialConfirmationForm() {
        return <>
            <Row>
                <Col lg='4' md='6' sm='8' xs='24'>
                    <Image width={200} src={materialRecImage} />
                </Col>
                <Col lg='20' md='18' sm='16' xs='24' offset={1}>
                    <br />
                    <Form form={formRef}>
                        <Form.Item
                            label="Material Received Date"
                            name="date"
                            rules={[{ required: true, message: 'Select the date' }]}
                            initialValue={moment()}
                        >
                            <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} allowClear={false} />
                        </Form.Item>
                        <Form.Item
                            label="Remarks"
                            name="remarks"
                            rules={[{ message: 'Select the remarks' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    }


    function reloadDashboard() {
        console.log('cnoasdfoinsflsdflknsfn');
        // destroy the open modal
        // modalRef.destroy();
        // set the value to false
        // setShowModal(false);
        Modal.destroyAll()
        // reload the dashboard
        props.reloadDashboard();
    }


    // the modal for confirming the material received for the inspection request
    function renderInspectionMaterialConfirmationModal(req: TrimInspectionBasicInfoModel) {
        setInspectionBasicInfo(req);
        setIsRequestShowMpodal(req.isReRequest)
        setShowModal(!req.isReRequest)
    }

    // the model for confirming rolls for the re request
    function reRequestConfirmingModel(req: TrimInspectionBasicInfoModel) {
        return <><RollSelectionForReRequest key={props.irInfo.irId} lotNumber={props.irInfo.lotNo} inspectionType={props.irInfo.inspectionType} companyCode={user?.orgData?.companyCode} unitCode={user?.orgData?.unitCode} irId={props.irInfo?.irId} reloadDashboard={reloadDashboard} /></>
    }

    // the respective modal to be rendered i.e. eihter material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: TrimInspectionBasicInfoModel, insType: TrimTypeEnum) {
        if (currentModalDefaultConfigs.basicInspectionConfirm) {
            renderInspectionMaterialConfirmationModal(req);
        } else if (currentModalDefaultConfigs.labInspectionConfirm) {
            renderInspectionMaterialConfirmationModal(req);
        } else if (currentModalDefaultConfigs.relaxationConfirm) {
            renderInspectionMaterialConfirmationModal(req);
        } else if (currentModalDefaultConfigs.shadeInspectionConfirm) {
            renderInspectionMaterialConfirmationModal(req);
        } else if (currentModalDefaultConfigs.shrinkageConfirm) {
            renderInspectionMaterialConfirmationModal(req);
        } else if (currentModalDefaultConfigs.viewInfo) {
            // for the rolls view
            renderIrItemsInfoModal(req, insType);
        }
        return null;
    }

    // the modal for showing the items in the inspection
    function renderIrItemsInfoModal(req: TrimInspectionBasicInfoModel, insType: TrimTypeEnum) {
        setitemsReqModal(true)
    }

    function setTheConfigForSelectedModal(config: CurrentModalOptions) {
        // make only the current one true and rest to be false
        // will configure any other settings later
        // setShowModal(true);
        renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) 
    }

    // clear all modal values to false
    function setAllModalsValuesToFalse() {
        currentModalDefaultConfigs.basicInspectionConfirm = false;
        currentModalDefaultConfigs.labInspectionConfirm = false;
        currentModalDefaultConfigs.relaxationConfirm = false;
        currentModalDefaultConfigs.shadeInspectionConfirm = false;
        currentModalDefaultConfigs.shrinkageConfirm = false;
        currentModalDefaultConfigs.viewInfo = false;
    }


    function renderPendingInsButtons(req: TrimInspectionBasicInfoModel, insType: TrimTypeEnum): any[] {
        // now based on the insepction type, render the buttons
        const items = [];
        // As of now for all the insepction types, this is the same process for pending items
        // if(insType == FabricInspectionRequestCategoryEnum.INSPECTION) {
        items.push(
            <CheckOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.basicInspectionConfirm = true;
                     setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        );
        items.push(
            <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.viewInfo = true;
                     setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        );
        return items;
        // } 
    }

    return (
        <>
            {renderPendingInsButtons(props.irInfo, props.typeOfInspection)}
            {/* { renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) } */}

            <Modal
                width={'95%'}
                title='Are you sure to proceed ?'
                open={isRequestShowMpodal}
                onCancel={() => {
                    setIsRequestShowMpodal(false)
                }}
                okButtonProps={{ disabled: true }}
                maskClosable={true}
                closable={true}
                footer={false}
            >
                {reRequestConfirmingModel(inspectionBasicInfo)}
            </Modal>

            <Modal
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                }}
                width={'40%'}
                title={'Are you sure to proceed ?'}
                maskClosable={true}
                closable={true}
                okButtonProps={{
                    onClick: () => {
                        const confirmDate = formRef.getFieldValue('date');
                        const remarks = formRef.getFieldValue('remarks');
                        if (!confirmDate) {
                            formRef.setFields([
                                {
                                    name: "date",
                                    value: null,
                                    errors: ['Please select date']
                                }
                            ]);
                            return false;
                        }
                        // This statement is mandatory. This statement will not close the model. It will only change the state variable 
                        setShowModal(false);
                        confirmMaterialReceivedForInspection(inspectionBasicInfo, confirmDate, remarks);
                        formRef.resetFields();

                        // this is the instruction that destroys the model manually using the reference
                        setShowModal(false)
                        return null;
                    }
                }}
            >
                <div>
                    <p>You are going to confirm the material received acknowledgement for </p>
                    <div>Request no : <b>B:{inspectionBasicInfo?.batches?.toString()}</b></div>
                    <div>Request created on : <b>{getProperDateWithTime(inspectionBasicInfo?.insCreatedOn)}</b></div>
                    <div>Total items : <b>{inspectionBasicInfo?.totalItemsForInspection}</b></div>
                    <hr />
                    {getMaterialConfirmationForm()}
                </div>
            </Modal>

            <Modal
            open={itemsReqModal}
            onCancel={()=>{
                setitemsReqModal(false)  
            }}
                width="95%"
                title='Inspection request items info'
                okButtonProps={{
                    onClick: () => {
                        setitemsReqModal(false);                    }
                }}
                maskClosable={true}
                closable={true}
            >
                <IrRollsSummary user={user} key={props.irInfo?.irId} irInfo={props.irInfo} inspectionViewProgress={props.inspectionViewProgress} typeOfInspection={props.typeOfInspection} />
            </Modal>
        </>
    );
};



