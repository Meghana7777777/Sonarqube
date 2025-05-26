import { CheckOutlined, EyeFilled } from "@ant-design/icons";
import { InsInspectionActivityStatusEnum, PKMSIrActivityChangeRequest, PKMSPendingMaterialResponse, PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";
import { FgInspectionCreationService, InspectionPreferenceService } from "@xpparel/shared-services";
import { Col, Form, Image, Input, Modal, Row } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useState } from "react";
import DatePicker, { defaultDateTimeFormat, defaultTimePicker } from "../../../../../common/data-picker/date-picker";
import { getProperDateWithTime } from "../../../../../common/helper-functions";
import materialRecImage from '../icons/ins-material-received.png';
import { PKMSIrRollsSummary } from "./ir-rolls-summary";
import { PKMSRollSelectionForReRequest } from "./roll-selection-for-re-request";

interface PendingInsControlProps {
    irInfo: PKMSPendingMaterialResponse;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
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

export const PKMSPendingInsControl = (props: PendingInsControlProps) => {
    const [formRef] = Form.useForm();
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const fgInspectionCreationService = new FgInspectionCreationService();


    // -------------------------------- APIS START-------------------------------
    function updatePMSInspectionActivityStatus(req: PKMSPendingMaterialResponse, date: string, remarks: string) {
        // call the API and confirm the inspection
        const irConfReq = new PKMSIrActivityChangeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, req.insReqId, date, InsInspectionActivityStatusEnum.MATERIAL_RECEIVED, remarks);
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
        // destroy the open modal
        // modalRef.destroy();
        // set the value to false
        // setShowModal(false);
        Modal.destroyAll()
        // reload the dashboard
        props.reloadDashboard();
    }


    // the modal for confirming the material received for the inspection request
    function renderInspectionMaterialConfirmationModal(req: PKMSPendingMaterialResponse) {
        const modal = req.isReRequest ? Modal.confirm({
            width: '95%',
            title: 'Are you sure to proceed ?',
            content: (reRequestConfirmingModel(req)),
            okButtonProps: {
                disabled: true,
            },
            maskClosable: true,
            closable: true,
            footer: false,
            // cancelButtonProps: { disabled: false, title: "Cancel" },
            // onOk() {
            //     setShowModal(false);
            // },
            onCancel() {
                // mandatory
                setShowModal(false);
            }
        }) :

            Modal.confirm({
                width: '40%',
                title: 'Are you sure to proceed ?',
                content: (
                    <div>
                        <p>You are going to confirm the material received acknowledgement for </p>
                        <div>Request no  : <b>B:{req.insCode?.toString()}</b></div>
                        <div>Request created on  : <b>{getProperDateWithTime(req.insCreationTime)}</b></div>
                        <div>Total items : <b>{req.totalItemsForInspection}</b></div>
                        <hr />
                        {getMaterialConfirmationForm()}
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
                        updatePMSInspectionActivityStatus(req, confirmDate, remarks);
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

    // the model for confirming rolls for the re request
    function reRequestConfirmingModel(req: PKMSPendingMaterialResponse) {
        return <>
            <PKMSRollSelectionForReRequest key={props.irInfo.insReqId} lotNumber={props.irInfo.insCode} inspectionType={props.irInfo.inspectionType} insReqId={props.irInfo?.insReqId} reloadDashboard={reloadDashboard} />
        </>
    }

    // the respective modal to be rendered i.e. either material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum) {
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
    function renderIrItemsInfoModal(req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum) {
        const modal = Modal.confirm({
            //style: {width: "100%"},
            width: "95%",
            title: 'Inspection request items info',
            content: (
                <>
                    <PKMSIrRollsSummary
                        key={props.irInfo?.insReqId}
                        irInfo={props.irInfo}
                        inspectionViewProgress={props.inspectionViewProgress}
                        typeOfInspection={props.typeOfInspection}
                        user={user}
                    />
                </>
            ),
            okButtonProps: {
                onClick: function () {
                    // this is the instruction that destroys the model manually using the reference
                    modal.destroy();
                    setShowModal(false);
                    return null;
                },
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
            <CheckOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }}
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

    }

    return (
        <>
            {renderPendingInsButtons(props.irInfo, props.typeOfInspection)}
            {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) : ''}
        </>
    );
};