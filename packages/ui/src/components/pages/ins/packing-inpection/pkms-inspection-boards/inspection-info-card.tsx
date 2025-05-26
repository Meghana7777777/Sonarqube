import { PKMSPendingMaterialResponse, PackActivityStatusEnum, PackFinalInspectionStatusEnum, PackFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum } from "@xpparel/shared-models";
import { Card, Col, Popover, Row } from "antd";
import Meta from "antd/es/card/Meta";
import { useRef, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { PKMSAcknowledgedInsControl } from "./acknowledged/acknowledged-ins-control";
import { PKMSClosedInsControl } from "./closed/closed-ins-control";
import './css/styles.css';
import { PKMSInProgressInsControl } from "./in-progress/in-progress-ins-control";
import { PKMSPendingInsControl } from "./pending/pending-ins-control";
interface InspectionInfoCardProps {
    inspectionRollsInfo: PKMSPendingMaterialResponse;
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
    insProgress: InsInspectionActivityStatusEnum;
    reloadDashboard: () => void;
    searchData: string;

}

export const PKMSInspectionInfoCard = (props: InspectionInfoCardProps) => {
    const { searchData } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const reqInfo = props.inspectionRollsInfo;
    const cardRef = useRef<HTMLDivElement>(null);
    const [warningShown, setWarningShown] = useState(false);

    // let color = "radial-gradient(circle at 3% 7.4%, rgb(0, 100, 100) 0%, rgb(0, 86, 240) 90%)";
    // let color = "radial-gradient(circle at 0% 7.4%, rgb(121 20 255) 10%, rgb(120 0 255) 90%)";
    let color = "radial-gradient(circle at 0% 7.4%, rgb(20 136 255) 10%, rgb(0 136 255) 90%)";
    if (props.inspectionRollsInfo.finalInspectionStatus == PackFinalInspectionStatusEnum.FAIL) {
        // color = "#fdd6d6";
        // color = "radial-gradient(972.6px at 10% 20%, rgb(243, 0, 75) 0%, rgb(255, 93, 75) 90%)";
        color = "radial-gradient(972.6px at 10% 20%, rgb(255 0 0) 0%, rgb(250 76 76) 90%)";
    } else if (props.inspectionRollsInfo.finalInspectionStatus == PackFinalInspectionStatusEnum.PASS) {
        // color = "#bdf4ca";
        // color = "linear-gradient(107deg, rgb(13, 198, 180) 8.1%, rgb(33, 198, 138) 79.5%)";
        color = "linear-gradient(107deg, rgb(68 196 107) 8.1%, rgb(16 196 94) 79.5%)";
    }
    else {
        // color = "#bdf4ca";
        // color = "linear-gradient(107deg, rgb(13, 198, 180) 8.1%, rgb(33, 198, 138) 79.5%)"; 
        color = "radial-gradient(972.6px at 10% 20%, rgb(20 135 255) 0%, rgb(20 135 255) 90%)";
    }

    // renders the buttons for the card
    function renderIrCardButtons(req: PKMSPendingMaterialResponse, insType: PackFabricInspectionRequestCategoryEnum, insProgress: InsInspectionActivityStatusEnum) {
        switch (insProgress) {
            case InsInspectionActivityStatusEnum.OPEN: return <PKMSPendingInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress}   />;
                break;
            case InsInspectionActivityStatusEnum.MATERIAL_RECEIVED: return <PKMSAcknowledgedInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            case InsInspectionActivityStatusEnum.INPROGRESS: return <PKMSInProgressInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            case InsInspectionActivityStatusEnum.COMPLETED: return <PKMSClosedInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            default:
                return <></>
        }
    }

    function renderCardTitle(reqInfo: PKMSPendingMaterialResponse) {
        return <span style={{ color: "white", fontSize: '12px' }} className={`truncated ${searchData === reqInfo?.insCode?.toString() ? 'search-highlight' : ''}`} data-fulltext={reqInfo?.insCode?.toString()}>B:{reqInfo?.insCode?.toString()}</span>;
    }

    function renderCardDescription(reqInfo: PKMSPendingMaterialResponse) {
        return <>
            {/* {"Total Items : " + reqInfo.totalItemsForInspection} */}
        </>
    }

    const text = <span>Title</span>;
    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    function renderHoverContent(rollsInfo: PKMSPendingMaterialResponse, insProgress: InsInspectionActivityStatusEnum) {
        return (
            <>
                <b>{insProgress === InsInspectionActivityStatusEnum.COMPLETED ? "Inspection Request Completed Info" : "Inspection Request Info"}</b>
                <hr />
                <p>PL no: <b>{rollsInfo.packListNo}</b></p>
                <p>Po no: <b>{rollsInfo.poNumber}</b></p>
                <p>Ins Code: <b>{rollsInfo.insCode}</b></p>
                <p>Style no: <b>{rollsInfo.style}</b> </p>
                <p>Buyer no: <b>{rollsInfo.buyerAddress}</b></p>
            </>
        );
    }
    return (
        // <div style={{ width: "30%", float: "left" , marginLeft: 8, padding: 0}}>
        <Col xs={24} sm={24} md={24} lg={12} xl={8}>

            <Card size="small" className="pd5" id="ins-card" hoverable={true} bodyStyle={{ overflow: 'hidden' }}
                style={{ width: "100%", background: color, border: "1px solid #d7cece", margin: "4px", color: "white", borderRadius: "8px", overflowY: "scroll", fontSize: '4px' }}
                // actions={ [ renderIrCardButtons(props.inspectionRollsInfo, props.typeOfInspection, props.insProgress) ] }
                // actions={[ 
                //     <SettingOutlined key="setting" />,
                //     <EyeFilled key="View"/>
                // ]}
                // extra= {  }
                ref={cardRef}
            >
                <Popover placement="rightTop" content={renderHoverContent(props.inspectionRollsInfo, props.insProgress)} overlayInnerStyle={{ background: '#ffffee' }}>
                    <Meta
                        avatar={""}
                        style={{ fontSize: '12px' }}
                        title={renderCardTitle(props.inspectionRollsInfo)}
                        description={renderCardDescription(props.inspectionRollsInfo)}
                    />
                </Popover>
                <hr />
                <Row style={{ color: "#000" }}>
                    {renderIrCardButtons(props.inspectionRollsInfo, props.typeOfInspection, props.insProgress)}
                </Row>
            </Card>

        </Col>
        // </div>
    );
};
