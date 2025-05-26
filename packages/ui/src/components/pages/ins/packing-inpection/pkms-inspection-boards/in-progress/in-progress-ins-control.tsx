import { Form, Modal } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useState } from "react";
import { PKMSIrRollsSummary } from "../pending/ir-rolls-summary";
import { PackFabricInspectionRequestCategoryEnum, PKMSPendingMaterialResponse, PackActivityStatusEnum, InsInspectionActivityStatusEnum } from "@xpparel/shared-models";
import { ExperimentOutlined, EyeFilled } from "@ant-design/icons";
import { PKMSFourPointInspectionForm } from "../four-point-inspection/four-point-inspection-form";


interface InProgressInsControlPorps {
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

export const PKMSInProgressInsControl = (props: InProgressInsControlPorps) => {
    const [formRef] = Form.useForm();
    const [irsInfo, setIrsInfo] = useState<PKMSPendingMaterialResponse>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    let modalRef;

    const [currentDecisionSelection, setCurrentDecisionSelection] = useState<CurrentModalOptions>(currentModalDefaultConfigs);


    function reloadDashboard() {
        // destroy the open modal
        // modalRef.destroy();
        // set the value to false
        setShowModal(false);
        // reload the dashboard
        props.reloadDashboard();
    }

    function getInspectionForm(irId: number, inspectionType: PackFabricInspectionRequestCategoryEnum) {
        return <PKMSFourPointInspectionForm
            inspReqId={irId}
            reloadParent={reloadDashboard} inspectionType={props.typeOfInspection}            
             />

    }

    // the modal for confirming the material received for the inspection request
    function renderInspectionUpdateModal(req: PKMSPendingMaterialResponse) {
        return <Modal title='Inspection Update' width={'100vw'} style={{ top: 0, padding: 0 }} open={showModal} footer={null} onCancel={() => {
            setShowModal(false);
            // props.reloadDashboard();
        }}>
            {getInspectionForm(props.irInfo.insReqId, props.typeOfInspection)}
        </Modal>
        // const modal = Modal.confirm({
        //     title: 'Inspection Update',
        //     width: '100vw',
        //     icon: <></>,

        //     style: { top: 0, padding: 0 },
        //     content: (
        //         getInspectionForm(props.irInfo.irId, props.typeOfInspection)
        //     ),
        //     okButtonProps: {
        //         onClick: function () {
        //             // modal.destroy();
        //             // setShowModal(false);
        //             // props.reloadDashboard();
        //             return null;
        //         }
        //     },
        //     maskClosable: true,
        //     closable: true,
        //     // cancelButtonProps: { disabled: false, title: "Cancel" },
        //     // onOk() {
        //     //     setShowModal(false);
        //     // },
        //     onCancel() {
        //         // mandatory
        //         setShowModal(false);
        //         props.reloadDashboard();
        //     }
        // });
    }

    // the respective modal to be rendered i.e. eihter material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum) {
        if (currentModalDefaultConfigs.basicInspectionConfirm) {
            return renderInspectionUpdateModal(req);
        } else if (currentModalDefaultConfigs.labInspectionConfirm) {
            return renderInspectionUpdateModal(req);
        } else if (currentModalDefaultConfigs.relaxationConfirm) {
            return renderInspectionUpdateModal(req);
        } else if (currentModalDefaultConfigs.shadeInspectionConfirm) {
            return renderInspectionUpdateModal(req);
        } else if (currentModalDefaultConfigs.shrinkageConfirm) {
            return renderInspectionUpdateModal(req);
        } else if (currentModalDefaultConfigs.viewInfo) {
            // for the rolls view
            return renderIrItemsInfoModal(req, insType);
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
                <PKMSIrRollsSummary irInfo={props.irInfo} inspectionViewProgress={props.inspectionViewProgress} typeOfInspection={props.typeOfInspection} user={user} />
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
            <ExperimentOutlined key="confirm" title="Update inspection values" style={{ ...buttonsStyle }}
                onClick={() => {
                    setAllModalsValuesToFalse();
                    currentModalDefaultConfigs.basicInspectionConfirm = true;
                    return setTheConfigForSelectedModal(currentModalDefaultConfigs)
                }
                } />
        );
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
    }

    return (
        <>
            {renderPendingInsButtons(props.irInfo, props.typeOfInspection)}
            {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) : ''}
        </>
    );
};



