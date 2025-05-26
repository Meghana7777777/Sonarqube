import { BarcodeOutlined, CarryOutOutlined, CheckCircleOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons'
import { FgWhOutActivityActionsEnum, FgWhReqHeaderFilterReq, PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum } from '@xpparel/shared-models'
import { PKMSFgWarehouseService } from '@xpparel/shared-services'
import { Badge, Card, Steps } from 'antd'
import { useAppSelector } from 'packages/ui/src/common'
import { useEffect, useState } from 'react'
import FGWAApprovedTab from './fgwh-action-tabs/fgwa-approved-tab'
import FGWAFgOutTab from './fgwh-action-tabs/fgwa-fg-out-tab'
import FGWAOpenTab from './fgwh-action-tabs/fgwa-open-tab'
import FGWALocationOutTab from './fgwh-action-tabs/fgwa-fg-location-out-tab'
import FGWAFgOutCompletedTab from './fgwh-action-tabs/fgwa-fg-out-completed-tab'



export default function FGWareHouseOutActivity() {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [countInfo, setCountInfo] = useState<any[]>([]);

    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const fgWHService = new PKMSFgWarehouseService();


    useEffect(() => {
        getCountAgainstCurrentStage();
    }, []);

    const getCountAgainstCurrentStage = () => {
        const req = new FgWhReqHeaderFilterReq(
            userName,
            orgData.unitCode,
            orgData.companyCode,
            userId,
            PkmsFgWhReqTypeEnum.OUT,
            null,
            null
        );
        fgWHService.getCountAgainstCurrentStage(req).then((res) => {
            if (res.status) {
                setCountInfo(res.data);
            } else {
                setCountInfo([]);
            }
        }).catch(err => {
            console.log(err?.message)
        });
    };


    const statusUpdate = () => {
        getCountAgainstCurrentStage();
    };

    const onStepChange = (step: number) => {
        setCurrentStep(step);
    }

    const renderComponents = (step: number) => {
        switch (step) {
            case 0:
                return <FGWAOpenTab reqType={PkmsFgWhReqTypeEnum.OUT} statusUpdate={statusUpdate} />;
            case 1:
                return <FGWAApprovedTab reqType={PkmsFgWhReqTypeEnum.OUT} statusUpdate={statusUpdate} />;
            case 2:
                return <FGWALocationOutTab statusUpdate={statusUpdate} />;
            case 3:
                return <FGWAFgOutTab statusUpdate={statusUpdate}/>
            case 4:
                return <FGWAFgOutCompletedTab statusUpdate={statusUpdate}/>
            default:
                return <h1>Development in progress</h1>;
        }
    };

    const counts: React.CSSProperties = {
        backgroundColor: "#52c41a",
        color: "#fff",
        minWidth: "20px",
        height: "20px",
        lineHeight: "20px",
        textAlign: "center",
        borderRadius: "50%",
        fontSize: "10px",
        fontWeight: "bold",
        marginLeft: 4,
    };

    return (
        <Card size="small" className="card-title-bg-cyan1 pad-0 grn-process" bodyStyle={{ padding: '0px' }}>
            <Steps
                size="small"
                type="navigation"
                //  direction="vertical"
                current={currentStep}
                onChange={(e) => onStepChange(e)}
                items={[
                    {
                        title: (
                            <>
                                {FgWhOutActivityActionsEnum.OPEN} { } <></>
                                <Badge
                                    count={
                                        countInfo.find(
                                            (e) => e.currentStage === PkmsFgWhCurrStageEnum.OPEN
                                        )?.count || 0
                                    }
                                    style={counts}
                                />
                            </>
                        ),
                        status: 'finish',
                        icon: <FileTextOutlined />,

                    },
                    {
                        title: <>
                            {FgWhOutActivityActionsEnum.APPROVED} { } <></>
                            <Badge
                                count={
                                    countInfo.find(
                                        (e) => e.currentStage === PkmsFgWhCurrStageEnum.APPROVED
                                    )?.count || 0
                                }
                                style={counts}
                            />
                        </>,
                        status: 'finish',
                        icon: <CheckCircleOutlined />,
                    },
                    {
                        title: <>
                            {FgWhOutActivityActionsEnum.LOCATION_OUT} { } <></>
                            <Badge
                                count={
                                    countInfo.find(
                                        (e) => e.currentStage === PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS || e.currentStage === PkmsFgWhCurrStageEnum.PRINT
                                    )?.count || 0
                                }
                                style={counts}
                            />
                        </>,
                        status: 'finish',
                        icon: <EnvironmentOutlined />,
                    },
                    {
                        title: <>
                            {FgWhOutActivityActionsEnum.FG_OUT} { } <></>
                            <Badge
                                count={
                                    countInfo.find(
                                        (e) => e.currentStage === PkmsFgWhCurrStageEnum.FG_OUT_PROGRESS || e.currentStage === PkmsFgWhCurrStageEnum.LOC_UNMAP_COMPLETED
                                    )?.count || 0
                                }
                                style={counts}></Badge>
                        </>,
                        status: 'finish',
                        icon: <BarcodeOutlined />,
                    },
                    {
                        title: <>
                            {FgWhOutActivityActionsEnum.FG_OUT_COMPLETED} { } <></>
                            <Badge
                                count={
                                    countInfo.find(
                                        (e) => e.currentStage === PkmsFgWhCurrStageEnum.FG_OUT_COMPLETE 
                                    )?.count || 0
                                }
                                style={counts}></Badge>
                        </>,
                        status: 'finish',
                        icon: <CarryOutOutlined />,
                    }
                ]}
            />
            {renderComponents(currentStep)}
        </Card>
    )
}
