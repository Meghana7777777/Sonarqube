import { ExperimentOutlined, EyeFilled } from "@ant-design/icons";
import { InsInspectionActivityStatusEnum, TrimInspectionBasicInfoModel, TrimTypeEnum } from "@xpparel/shared-models";
import { Form, Modal } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useState } from "react";
import FourPointInspectionForm from "../../trim-inspection-forms/trim-inspection/trim-inspection-form";
import { IrRollsSummary } from "../pending/ir-rolls-summary";


interface InProgressInsControlPorps {
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

export const InProgressInsControl = (props: InProgressInsControlPorps) => {
    const [formRef] = Form.useForm();
    const [irsInfo, setIrsInfo] = useState<TrimInspectionBasicInfoModel>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [itemsReqModal, setitemsReqModal] = useState<boolean>(false)
    const [reloadCounter, setReloadCounter] = useState<number>(0);
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

    function getInspectionForm(irId: number, inspectionType: TrimTypeEnum) {
        // if (inspectionType == TrimTypeEnum.TRIMINS) {
           
        // } else if (inspectionType == TrimTypeEnum.TRIMINS) {
        //     return <ShadeInspectionForm inspReqId={irId} reloadParent={reloadDashboard} />
        // }
        //  else if (inspectionType == TrimTypeEnum.LAB_INSPECTION) {
        //     return <LabInspectionForm inspReqId={irId} reloadParent={reloadDashboard} />
        // } else if (inspectionType == TrimTypeEnum.SHRINKAGE) {
        //     return <Shrinkage inspReqId={irId} reloadParent={reloadDashboard} />
        // } else if (inspectionType == TrimTypeEnum.RELAXATION) {
        //     return <RelaxationInspectionForm inspReqId={irId} reloadParent={reloadDashboard} />
        // else {
        //     return <>Screen development in progress</>
        // }

        return <FourPointInspectionForm inspReqId={irId} reloadParent={reloadDashboard} reload={reloadCounter} />
    }

    

    // the modal for confirming the material received for the inspection request
    function renderInspectionUpdateModal(req: TrimInspectionBasicInfoModel) {
        // setShowModal(true)
        // const modal = Modal.confirm({
        // title: 'Inspection Update',
        // width: '100vw',
        // icon: <></>,

        // style: { top: 0, padding: 0 },
        // content: (
        // getInspectionForm(props.irInfo.irId, props.typeOfInspection)
        // ),
        // okButtonProps: {
        // onClick: function () {
        // // modal.destroy();
        // // setShowModal(false);
        // // props.reloadDashboard();
        // return null;
        // }
        // },
        // maskClosable: true,
        // closable: true,
        // // cancelButtonProps: { disabled: false, title: "Cancel" },
        // // onOk() {
        // // setShowModal(false);
        // // },
        // onCancel() {
        // // mandatory
        // setShowModal(false);
        // props.reloadDashboard();
        // }
        // });
    }

    // the respective modal to be rendered i.e. eihter material confirmation or the rolls view based on the inspection type
    function renderModalBasedOnSelection(currentModalDefaultConfigs: CurrentModalOptions, req: TrimInspectionBasicInfoModel, insType: TrimTypeEnum) {
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
        // if(insType == TrimTypeEnum.INSPECTION) {
        items.push(
            <ExperimentOutlined key="confirm" title="Update inspection values" style={{ ...buttonsStyle }}
                onClick={() => {
                    setReloadCounter(preVal => preVal + 1);
                    setShowModal(true);
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
                    setShowModal(false);
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
            {/* {showModal ? renderModalBasedOnSelection(currentModalDefaultConfigs, props.irInfo, props.typeOfInspection) : ''} */}

            <Modal title='Trim Inspection Update' width={'100vw'} style={{ top: 0, padding: 0 }} open={showModal} footer={null} onCancel={() => {
                setShowModal(false);
                // props.reloadDashboard();
            }}>
                {getInspectionForm(props.irInfo.irId, props.typeOfInspection)}
            </Modal>
            <Modal
                open={itemsReqModal}
                onCancel={() => {
                    setitemsReqModal(false)
                }}
                width="95%"
                title='Inspection request items info'
                okButtonProps={{
                    onClick: () => {
                        setitemsReqModal(false);
                    }
                }}
                maskClosable={true}
                closable={true}
            >
                <IrRollsSummary irInfo={props.irInfo} inspectionViewProgress={props.inspectionViewProgress} typeOfInspection={props.typeOfInspection} />
            </Modal>
        </>
    );
};



