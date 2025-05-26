import { BookOutlined, EyeOutlined, IdcardOutlined, PrinterOutlined } from "@ant-design/icons";
import { InsFabricInspectionRequestCategoryEnum, PackingListSummaryModel } from "@xpparel/shared-models";
import { Badge, Card, Steps } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector, useCallbackPrompt } from "../../../../../common";
import { InspectionSpecificDashboard } from "./inspection-specific-dashboard";


export const InspectionDashboardsMainPage = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [phId, setPhId] = useState<number>();
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<PackingListSummaryModel>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] =
        useCallbackPrompt(showDialog)
    useEffect(() => {

    }, []);



    const onStepChange = (step: number, selectedRecord: PackingListSummaryModel) => {
        if (step) {
            setCurrentStep(step);
        } else {
            setCurrentStep(step);
            //history.replace('/pps/poPlanning')
        }

    }



    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <InspectionSpecificDashboard key={"basic-inspection-dashboard"} typeOfInspection={InsFabricInspectionRequestCategoryEnum.INSPECTION} />
            case 1: return <InspectionSpecificDashboard key={"shae-inspection-dashboard"} typeOfInspection={InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION} />
            case 2: return <InspectionSpecificDashboard key={"lab-inspection-dashboard"} typeOfInspection={InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION} />
            case 3: return <InspectionSpecificDashboard key={"shrinkage-inspection-dashboard"} typeOfInspection={InsFabricInspectionRequestCategoryEnum.SHRINKAGE} />
            // case 4: return <InspectionSpecificDashboard key={"relaxation-inspection-dashboard"} typeOfInspection={InsFabricInspectionRequestCategoryEnum.RELAXATION} />
            default: return <></>
        }
    }

    return (<>
        <Badge.Ribbon color="#faad14">
            <Card size="small" className="card-title-bg-cyan1 pad-0" bodyStyle={{padding:'0px'}}
            // title="Allocation Process" extra={<Button type='default' onClick={() => { onStepChange(0, selectedSummeryRecord) }}>back</Button>}
            >
                <Steps
                    size="small"
                    type="navigation"
                    //  direction="vertical"
                    current={currentStep}
                    onChange={(e) => onStepChange(e, selectedSummeryRecord)}
                    items={[
                        {
                            // title: <>Packing List <Badge count={phId} color='#faad14' /></>,
                            title: <>Four Point Inspection </>,
                            status: 'finish',
                            icon: <BookOutlined />,
                        },
                        {
                            title: <>Shade Inspection</>,
                            status: 'finish',
                            icon: <EyeOutlined />,
                        },
                        {
                            title: <>GSM Inspection</>,
                            status: 'finish',
                            icon: <PrinterOutlined />,
                        },
                        {
                            title: <>Shrinkage Inspection</>,
                            status: 'process',
                            icon: <IdcardOutlined />,
                        },
                        // {
                        //     title: <>Relaxation</>,
                        //     status: 'finish',
                        //     icon: <EyeOutlined />,
                        // }
                    ]}
                />
                {/* <Divider style={{ margin: '5px 0' }} /> */}
            </Card>
            <br/>
            {renderComponents(currentStep)}

        </Badge.Ribbon>

    </>)
}
export default InspectionDashboardsMainPage;


















