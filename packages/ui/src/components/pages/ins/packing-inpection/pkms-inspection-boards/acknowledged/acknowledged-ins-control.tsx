import { EyeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { PackFabricInspectionRequestCategoryEnum, PKMSIrActivityChangeRequest, PKMSPendingMaterialResponse, PackActivityStatusEnum, InsInspectionActivityStatusEnum } from "@xpparel/shared-models";
import { FgInspectionCreationService, InspectionPreferenceService } from "@xpparel/shared-services";
import { Col, Form, Image, Input, Modal, Row } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useState } from "react";
import DatePicker, { defaultDateTimeFormat } from "../../../../../common/data-picker/date-picker";
import { getProperDateWithTime } from '../../../../../common/helper-functions';
import insStart from '../icons/ins-start.avif';
import { PKMSIrRollsSummary } from "../pending/ir-rolls-summary";

interface AcknowledgedInsControlPorps {
    irInfo: PKMSPendingMaterialResponse;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
    reloadDashboard: () => void
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

export const PKMSAcknowledgedInsControl = (props: AcknowledgedInsControlPorps) => {
    const [formRef] = Form.useForm();
    const [irsInfo, setIrsInfo] = useState<PKMSPendingMaterialResponse>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const insService = new InspectionPreferenceService();
    const fgInspectionCreationService = new FgInspectionCreationService();
    const [currentDecisionSelection, setCurrentDecisionSelection] = useState<CurrentModalOptions>(currentModalDefaultConfigs);

    // -------------------------------- APIS START-------------------------------
    function confirmStartInspection(req: PKMSPendingMaterialResponse, date: string, remarks: string) {
        // call the API and confirm the inspection
        const irConfReq = new PKMSIrActivityChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, req.insReqId, date, InsInspectionActivityStatusEnum.INPROGRESS, remarks);
        fgInspectionCreationService.updatePMSInspectionActivityStatus(irConfReq).then(res => {
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
    function getInspectionStartConfirmationForm() {
        return <>
            <Row>
                <Col lg='4' md='6' sm='8' xs='24'>
                    <Image width={200} src={insStart} />
                </Col>
                <Col lg='20' md='18' sm='16' xs='24' offset={1}>
                    <br />
                    <Form form={formRef}>
                        <Form.Item
                            label="Inspection Start Date"
                            name="date"
                            rules={[{ required: true, message: 'Select the date' }]}
                            initialValue={moment()}
                        >
                            <DatePicker showTime={{ format: 'HH:mm' }} format={defaultDateTimeFormat} allowClear={false} />
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

    // the modal for confirming the material received for the inspection request
    function renderInspectionStartConfirmationModal(req: PKMSPendingMaterialResponse) {
        const modal = Modal.confirm({
            title: 'Are you sure to proceed ?',
            width: '40%',
            content: (
                <div>
                    <p>You are going to start the insepction for </p>
                    <div>Request no  : <b>B:{req.insCode?.toString()}</b></div>
                    <div>Request created on  : <b>{getProperDateWithTime(req.insCreationTime)}</b></div>
                    <div>Material Received on  : <b>{getProperDateWithTime(req.materialRecOn)}</b></div>
                    <div>Total items : <b>{req.totalItemsForInspection}</b></div>
                    <hr />
                    {getInspectionStartConfirmationForm()}
                </div>
            ),
            okButtonProps: {
                onClick: function () {
                    // If false is returned, then the modal will not be closed
                    // MANUAL SETTING SINCE THIS IS HAPPENING INSIDE A MODAL AND STATE CANNOT BE UPDATED
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
                    confirmStartInspection(req, confirmDate, remarks);
                    formRef.resetFields();

                    // this is the instruction that destroys the model manually using the reference
                    modal.destroy();

                    return null;
                }
            },
            maskClosable: true,
            closable: true,
            // cancelButtonProps: { disabled: false, title: "Cancel" },
            // onOk() {
            //     setShowModal(false);
            // },
            onCancel() {
                // mandatory
                setShowModal(false);
            }
        });
    }

    // the respective modal to be rendered i.e. eihter material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum) {
        if (currentModalDefaultConfigs.basicInspectionConfirm) {
            renderInspectionStartConfirmationModal(req);
        } else if (currentModalDefaultConfigs.labInspectionConfirm) {
            renderInspectionStartConfirmationModal(req);
        } else if (currentModalDefaultConfigs.relaxationConfirm) {
            renderInspectionStartConfirmationModal(req);
        } else if (currentModalDefaultConfigs.shadeInspectionConfirm) {
            renderInspectionStartConfirmationModal(req);
        } else if (currentModalDefaultConfigs.shrinkageConfirm) {
            renderInspectionStartConfirmationModal(req);
        } else if (currentModalDefaultConfigs.viewInfo) {
            // for the rolls view
            renderIrItemsInfoModal(req, insType);
        }
        return null;
    }

    // the modal for showing the items in the inspection
    function renderIrItemsInfoModal(req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum) {
        const modal = Modal.confirm({
            //style: {width: "100%"},
            width: "95%",
            title: 'Inspection request items info',
            content: (
                <>
                    <PKMSIrRollsSummary irInfo={props.irInfo} inspectionViewProgress={props.inspectionViewProgress} typeOfInspection={props.typeOfInspection} user={user} /></>
            ),
            okButtonProps: {
                onClick: function () {
                    // this is the instruction that destroys the model manually using the reference
                    modal.destroy();
                    return null;
                }
            },
            maskClosable: true,
            closable: true,
            onCancel() {
                // mandatory
                setShowModal(false);
            }
        });
    }

    function setTheConfigForSelectedModal(config: CurrentModalOptions) {
        // make only the current one true and rest to be false
        // will configure any other settings later
        setShowModal(true);
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


    function renderPendingInsButtons(req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum): any[] {
        // now based on the insepction type, render the buttons
        const items = [];
        // As of now for all the insepction types, this is the same process for pending items
        // if(insType == PackFabricInspectionRequestCategoryEnum.INSPECTION) {
        items.push(
            <ShoppingCartOutlined key="confirm" title="confirm start inspection" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.basicInspectionConfirm = true;
                    return setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        );
        items.push(
            <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.viewInfo = true;
                    return setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        );
        return items;
        // }
        return ["No Info found"]
    }

    return (
        <>
            {renderPendingInsButtons(props.irInfo, props.typeOfInspection)}
            {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) : ''}
        </>
    );
};



