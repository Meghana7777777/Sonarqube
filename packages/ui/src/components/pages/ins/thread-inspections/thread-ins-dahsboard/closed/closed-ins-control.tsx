import { DislikeFilled, EyeFilled, LikeFilled } from "@ant-design/icons";
import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, ThreadInspectionBasicInfoModel, ThreadTypeEnum } from "@xpparel/shared-models";
// import { InsService } from "@xpparel/shared-services";
import { Button, Form, Input, Modal } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import DatePicker from "packages/ui/src/components/common/data-picker/date-picker";
import { getProperDateWithTime } from "packages/ui/src/components/common/helper-functions";
import { useState } from "react";
// import { FourPointInspectionReports, LabInspectionReport, ShadeInspectionReport, ShrinkageInspectionReport } from "../../../Reports";
import InspectionTable from "../../thread-inspection-forms/thread-inspection/thread-insp";
import { IrRollsSummary } from "../pending/ir-rolls-summary";


interface ClosedInsControlPorps {
    irInfo: ThreadInspectionBasicInfoModel;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: ThreadTypeEnum;
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
interface IModelProps {
    children: any;
    closeModal: () => void;
    title: string;
}
const ModalComponent = (props: IModelProps) => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

    const handleOk = () => {
        setIsModalOpen(false);
        props.closeModal();
    };



    return <>
        <Modal title={props.title} width={'100%'} style={{ top: 20 }} open={isModalOpen} onOk={handleOk} onCancel={handleOk}>
            {props.children}
        </Modal>
    </>
}
export const ClosedInsControl = (props: ClosedInsControlPorps) => {
    const [formRef] = Form.useForm();
    const [irsInfo, setIrsInfo] = useState<ThreadInspectionBasicInfoModel>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const [currentDecisionSelection, setCurrentDecisionSelection] = useState<CurrentModalOptions>(currentModalDefaultConfigs);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [labInspModelOpen, setLabInspModelOpen] = useState<boolean>(false);
    const [shadeSaggregationModelOpen, setShadeSaggregationModelOpen] = useState<boolean>(false);
    const [relaxationInspModel, setRelaxationInspModel] = useState<boolean>(false);
    const [shrinkageModelOpen, setShrinkageModelOpen] = useState<boolean>(false);


    const handleOpenModel = () => {
        setIsModalOpen(true);
        setLabInspModelOpen(true);
        setShadeSaggregationModelOpen(true);
        setRelaxationInspModel(true);
        setShrinkageModelOpen(true);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setLabInspModelOpen(false);
        setShadeSaggregationModelOpen(false);
        setRelaxationInspModel(false);
        setShrinkageModelOpen(false);
    };

    // -------------------------------- APIS START-------------------------------
    // -------------------------------- APIS END -------------------------------


    // The Form for capturing the date and remarks
    function getInspectionStartConfirmationForm() {
        return <>
            <Form form={formRef}>
                <Form.Item
                    label="Inspection Start Date"
                    name="date"
                    rules={[{ required: true, message: 'Select the date' }]}
                    initialValue={moment()}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Remarks"
                    name="remarks"
                    rules={[{ message: 'Select the remarks' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </>
    }

    // the modal for confirming the material received for the inspection request
    function renderInspectionStatusModal(req: ThreadInspectionBasicInfoModel) {
        const modal = Modal.confirm({
            title: 'Inspection Result',
            content: (
                <div>
                    <div>Request no  : <b>{req.batches}</b></div>
                    <div>Request created on  : <b>{getProperDateWithTime(req.insCreatedOn)}</b></div>
                    <div>Material received on  : <b>{getProperDateWithTime(req.materialRecOn)}</b></div>
                    <div>Inspection started on : <b>{getProperDateWithTime(req.insStartedOn)}</b></div>
                    <div>Total items : <b>{req.totalItemsForInspection}</b></div>
                    <div>Total passed items : <b>{req.totalItemsPassed}</b></div>
                    <div>Total failed items : <b>{req.failedItems}</b></div>
                    <div>final status: <b>{req.finalInspectionStatus}</b></div>
                </div>
            ),
            // okButtonProps: {
            //     onClick: function () {
            //         return null;
            //     }
            // },
            maskClosable: true,
            closable: true,
            // cancelButtonProps: { disabled: false, title: "Cancel" },
            onOk() {
                setShowModal(false);
            },
            onCancel() {
                // mandatory
                setShowModal(false);
            }
        });
    }

    // the respective modal to be rendered i.e. eihter material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: ThreadInspectionBasicInfoModel, insType: ThreadTypeEnum, inspStats: InsInspectionActivityStatusEnum) {
        if (currentModalDefaultConfigs.basicInspectionConfirm) {
            renderInspectionStatusModal(req);
        } else if (currentModalDefaultConfigs.labInspectionConfirm) {
            renderInspectionStatusModal(req);
        } else if (currentModalDefaultConfigs.relaxationConfirm) {
            renderInspectionStatusModal(req);
        } else if (currentModalDefaultConfigs.shadeInspectionConfirm) {
            renderInspectionStatusModal(req);
        } else if (currentModalDefaultConfigs.shrinkageConfirm) {
            renderInspectionStatusModal(req);
        } else if (currentModalDefaultConfigs.viewInfo) {
            // for the rolls view
            // todo:renderIrItemsInfoModal
            return renderIrItemsInfoModal(req, insType, inspStats);
        }
        return null;
    }


    // the modal for showing the items in the inspection
    // todo:
    function renderIrItemsInfoModal(req: ThreadInspectionBasicInfoModel, insType: ThreadTypeEnum, inspStats: InsInspectionActivityStatusEnum) {
        let contentComponent = <></>;
        console.log('instypeee', insType);
        console.log('inspStats', inspStats);
        if (inspStats === InsInspectionActivityStatusEnum.COMPLETED) {
            // switch (insType) {
            //     case ThreadTypeEnum.YARNINS:
            //         console.log("Yarn Inspection", req);
            //         contentComponent = <FourPointInspectionReports irId={req.irId} />;
            //         break;
            //     default:
            contentComponent = <IrRollsSummary irInfo={props.irInfo} inspectionViewProgress={props.inspectionViewProgress} typeOfInspection={props.typeOfInspection} />
            // break;
        }
        else {
            contentComponent = <p>Inspection not completed yet.</p>;
        }
        return (
            <ModalComponent title="Inspection request items info" closeModal={() => setShowModal(false)}>
                {contentComponent}
            </ModalComponent>
        )
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


    function renderPendingInsButtons(req: ThreadInspectionBasicInfoModel, insType: ThreadTypeEnum): any[] {
        // now based on the insepction type, render the buttons
        const items = [];
        // As of now for all the insepction types, this is the same process for pending items
        // if(insType == ThreadTypeEnum.INSPECTION) {
        const isFailed = req.finalInspectionStatus == InsInspectionFinalInSpectionStatusEnum.FAIL ? true : false;
        isFailed ? items.push(
            <DislikeFilled key="view" title="Inspection failed" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.basicInspectionConfirm = true;
                    return setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        ) : items.push(
            <LikeFilled key="view" title="Inspection passed" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.basicInspectionConfirm = true;
                    return setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        )

        items.push(
            <EyeFilled key="view" title="View items" style={{ ...buttonsStyle }}
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
            {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection, props.inspectionViewProgress) : ''}
            {props.typeOfInspection === ThreadTypeEnum.THREADINS && isModalOpen ? (
                <Modal
                    title={
                        <span
                            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
                        >
                        </span>
                    }
                    width={1000}
                    open={isModalOpen}
                    cancelText="Close"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <InspectionTable inspReqId={props.irInfo.irId} />
                </Modal>
            ) : null}
            {/* {props.typeOfInspection === ThreadTypeEnum.YARNINS && labInspModelOpen ? (
                <Modal
                    title={
                        <span
                            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
                        >
                        </span>
                    }
                    width={1200}
                    open={labInspModelOpen}
                    cancelText="Close"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <LabInspection inspReqId={props.irInfo.irId} />
                </Modal>
            ) : null}
            {props.typeOfInspection === ThreadTypeEnum.SHADE_SEGREGATION && shadeSaggregationModelOpen ? (
                <Modal
                    title={
                        <span
                            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
                        >
                        </span>
                    }
                    width={1200}
                    open={shadeSaggregationModelOpen}
                    cancelText="Close"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <ShadeSaggregationInspection />
                </Modal>
            ) : null}
            {props.typeOfInspection === ThreadTypeEnum.RELAXATION && relaxationInspModel ? (
                <Modal
                    title={
                        <span
                            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
                        >
                        </span>
                    }
                    width={1200}
                    open={relaxationInspModel}
                    cancelText="Close"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <RelaxationInspection />
                </Modal>
            ) : null}
            {props.typeOfInspection === ThreadTypeEnum.SHRINKAGE && shrinkageModelOpen ? (
                <Modal
                    title={
                        <span
                            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
                        >
                        </span>
                    }
                    width={1200}
                    open={shrinkageModelOpen}
                    cancelText="Close"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <ShrinkageInspection />
                </Modal>
            ) : null} */}
        </>
    );
};



