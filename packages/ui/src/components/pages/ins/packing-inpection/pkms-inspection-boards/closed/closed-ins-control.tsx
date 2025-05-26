import { DislikeFilled, EyeFilled, LikeFilled } from "@ant-design/icons";
import { InsInspectionActivityStatusEnum, PKMSPendingMaterialResponse, PackFabricInspectionRequestCategoryEnum, PackFinalInspectionStatusEnum } from "@xpparel/shared-models";
import { Button, Form, Modal } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { getProperDateWithTime } from "packages/ui/src/components/common/helper-functions";
import { useState } from "react";
import InspectionTable from "../../../../WMS/inspection/inspection-forms/four-point-inspection/four-point-insp";
import { PKMSFourPointInspectionReports } from "../four-point-inspection/pkms-four-point-inspection-reports";
 


interface ClosedInsControlPorps {
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
export const PKMSClosedInsControl = (props: ClosedInsControlPorps) => {
    const [formRef] = Form.useForm();
    const [irsInfo, setIrsInfo] = useState<PKMSPendingMaterialResponse>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const [currentDecisionSelection, setCurrentDecisionSelection] = useState<CurrentModalOptions>(currentModalDefaultConfigs);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [labInspModelOpen, setLabInspModelOpen] = useState<boolean>(false);
    const [shadeSaggregationModelOpen, setShadeSaggregationModelOpen] = useState<boolean>(false);
    const [relaxationInspModel, setRelaxationInspModel] = useState<boolean>(false);
    const [shrinkageModelOpen, setShrinkageModelOpen] = useState<boolean>(false);


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


    // the modal for confirming the material received for the inspection request
    function renderInspectionStatusModal(req: PKMSPendingMaterialResponse) {
        const modal = Modal.confirm({
            title: 'Inspection Result',
            content: (
                <div>
                    <div>Request no  : <b>{req.insCode}</b></div>
                    <div>Request created on  : <b>{getProperDateWithTime(req.insCreationTime)}</b></div>
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
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum, inspStats: InsInspectionActivityStatusEnum) {
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
            return renderIrItemsInfoModal(req, insType, inspStats);
        }
        return null;
    }


    // the modal for showing the items in the inspection
    function renderIrItemsInfoModal(req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum, inspStats: InsInspectionActivityStatusEnum) {
        let contentComponent = <></>;
        if (inspStats === InsInspectionActivityStatusEnum.COMPLETED) {
            console.log(contentComponent);
            switch (insType) {
                case PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION:
                    contentComponent = <PKMSFourPointInspectionReports irId={req.insReqId} inspectionType={props?.typeOfInspection} />;
                    break;
                case PackFabricInspectionRequestCategoryEnum.POST_INSPECTION:
                    contentComponent = <PKMSFourPointInspectionReports irId={req.insReqId} inspectionType={props?.typeOfInspection} />;
                    break;
                case PackFabricInspectionRequestCategoryEnum.FCA:
                    contentComponent = <PKMSFourPointInspectionReports irId={req.insReqId} inspectionType={props?.typeOfInspection} />;
                    break;
                  
            }
        } else {
            contentComponent = <p>Inspection not completed yet.</p>;
        }
    
        return (
            <ModalComponent title="Inspection request items info" closeModal={() => setShowModal(false)}>
                {contentComponent}
            </ModalComponent>
        );
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
        const isFailed = req.finalInspectionStatus == PackFinalInspectionStatusEnum.FAIL ? true : false;
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
    }

    return (
        <>
            {renderPendingInsButtons(props.irInfo, props.typeOfInspection)}
            {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection, props.inspectionViewProgress) : ''}
            {props.typeOfInspection === PackFabricInspectionRequestCategoryEnum.POST_INSPECTION && isModalOpen ? (
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
                    <InspectionTable inspReqId={props.irInfo.insReqId} />
                </Modal>
            ) : null}

        </>
    );
};



