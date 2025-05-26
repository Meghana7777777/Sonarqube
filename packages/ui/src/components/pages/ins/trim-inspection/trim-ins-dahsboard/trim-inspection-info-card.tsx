import { TrimTypeEnum, InsInspectionActivityStatusEnum, TrimInspectionBasicInfoModel, InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import { Card, Col, Popover, Row } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { AcknowledgedInsControl } from "./acknowledged/acknowledged-ins-control";
import { ClosedInsControl } from "./closed/closed-ins-control";
import './css/styles.css';
import { InProgressInsControl } from "./in-progress/in-progress-ins-control";
import { PendingInsControl } from "./pending/pending-ins-control";

interface InspectionInfoCardProps {
    inspectionRollsInfo: TrimInspectionBasicInfoModel;
    typeOfInspection: TrimTypeEnum;
    insProgress: InsInspectionActivityStatusEnum;
    reloadDashboard: () => void;
    searchData: string;
    color: boolean;
}

export const InspectionInfoCard = (props: InspectionInfoCardProps) => {
    const { searchData } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [formFields, setFormFields] = useState([{ reason: "", meter: "", point: "" }]);
    const reqInfo = props.inspectionRollsInfo;
    const cardRef = useRef<HTMLDivElement>(null);
    const [warningShown, setWarningShown] = useState(false);


    // This useEffect will handle the auto-scroll behavior
    useEffect(() => {
        if (searchData && reqInfo?.batches?.toString() === searchData && cardRef.current) {
            // Scroll to the matching card
            cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [searchData, reqInfo?.batches]);


    // let color = "radial-gradient(circle at 3% 7.4%, rgb(0, 100, 100) 0%, rgb(0, 86, 240) 90%)";
    // let color = "radial-gradient(circle at 0% 7.4%, rgb(121 20 255) 10%, rgb(120 0 255) 90%)";
    let color = "radial-gradient(circle at 0% 7.4%, rgb(20 136 255) 10%, rgb(0 136 255) 90%)";
    let blinkingClass = "";
    if (props.inspectionRollsInfo.finalInspectionStatus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
        // color = "#fdd6d6";
        // color = "radial-gradient(972.6px at 10% 20%, rgb(243, 0, 75) 0%, rgb(255, 93, 75) 90%)";
        color = "radial-gradient(972.6px at 10% 20%, rgb(255 0 0) 0%, rgb(250 76 76) 90%)";
    } else if (props.inspectionRollsInfo.finalInspectionStatus == InsInspectionFinalInSpectionStatusEnum.PASS) {
        // color = "#bdf4ca";
        // color = "linear-gradient(107deg, rgb(13, 198, 180) 8.1%, rgb(33, 198, 138) 79.5%)";
        color = "linear-gradient(107deg, rgb(68 196 107) 8.1%, rgb(16 196 94) 79.5%)";
    } else if (props.inspectionRollsInfo.isReRequest) {
        // color = "#bdf4ca";
        // color = "linear-gradient(107deg, rgb(13, 198, 180) 8.1%, rgb(33, 198, 138) 79.5%)";
        color = "radial-gradient(972.6px at 10% 20%, rgb(255 118 0) 0%, rgb(250, 76, 76) 90%)";
    }

    if (searchData && props.color) {
        blinkingClass = "blinking";
    }

    // renders the buttons for the card
    function renderIrCardButtons(req: TrimInspectionBasicInfoModel, insType: TrimTypeEnum, insProgress: InsInspectionActivityStatusEnum) {
        // based on the inspection type and the progress render the buttons for the open/pending/progress/completed
        switch (insProgress) {
            case InsInspectionActivityStatusEnum.OPEN: return <PendingInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            case InsInspectionActivityStatusEnum.MATERIAL_RECEIVED: return <AcknowledgedInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            case InsInspectionActivityStatusEnum.INPROGRESS: return <InProgressInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
            case InsInspectionActivityStatusEnum.COMPLETED: return <ClosedInsControl reloadDashboard={props.reloadDashboard} irInfo={props.inspectionRollsInfo} typeOfInspection={props.typeOfInspection} inspectionViewProgress={props.insProgress} />;
                break;
        }
    }

    function renderCardTitle(reqInfo: TrimInspectionBasicInfoModel) {
        return <span style={{ color: "white", fontSize: '12px' }} className={`truncated ${searchData === reqInfo?.batches?.toString() ? 'search-highlight' : ''}`} data-fulltext={reqInfo?.batches?.toString()}>B:{reqInfo?.batches?.toString()}</span>;
    }

    function renderCardDescription(reqInfo: TrimInspectionBasicInfoModel) {
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

    function renderHoverContent(rollsInfo: TrimInspectionBasicInfoModel, insProgress: InsInspectionActivityStatusEnum) {
        return (
            <>
                <b>{insProgress === InsInspectionActivityStatusEnum.COMPLETED ? "Inspection Request Completed Info" : "Inspection Request Info"}</b>
                <hr />
                <p>Supplier no: <b>{rollsInfo.supplierCode}</b></p>
                <p>PL no: <b>{rollsInfo.packListCode}</b></p>
                <p>Lot no: <b>{rollsInfo.lotNo}</b></p>
                <p>Batch no: <b>{rollsInfo.batches}</b></p>
                <p>Style no: <b>{rollsInfo.styleNumber}</b> </p>
            </>
        );
    }
    return (
        // <div style={{ width: "30%", float: "left" , marginLeft: 8, padding: 0}}>
        <Col xs={24} sm={24} md={24} lg={12} xl={8}>

            <Card size="small" className={`pd5 ${props.color ? 'blinking' : ''}`} id="ins-card" hoverable={true} bodyStyle={{ overflow: 'hidden' }}
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
