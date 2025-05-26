import { BuildOutlined, ClusterOutlined, DashboardOutlined, EyeOutlined, FileAddOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Steps } from 'antd';
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages, RouterPrompt } from '../../../common';
import PrcessJobGeneration from './process-job-generation/sps-process-job-generation';
import SpsProcessingOrder from './processing-order/sps-processing-order';
import ViewProcessJobs from './view-jobs/view-process-jobs';
import SPSHeaderInfo from './sps-po-header-view';
import { KnitHeaderInfoModel, ProcessTypeEnum, SewSerialRequest } from '@xpparel/shared-models';
import { SewingProcessingOrderService } from '@xpparel/shared-services';
import OpVersionView from '../../KMS/knitting-management/op-version-view/op-view-tab';
import ViewSewingJobs from '../components/view-sewing-jobs';
import { title } from 'process';
import MoveToInvPage from '../move-to-inventory/move-to-inv-page';


export default function SPSProcessingOrderLayout() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<any>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [headerInfo, setHeaderInfo] = useState<KnitHeaderInfoModel>();
    const[procSerial,setProcSerial]=useState<number>()
    const user = useAppSelector((state) => state.user.user.user);
    const sewingProcessingOrderService= new SewingProcessingOrderService()

    useEffect(()=>{
        getSpsHeaderInfo(selectedSummeryRecord?.processingSerial)
        setProcSerial(selectedSummeryRecord?.processingSerial)
    },[selectedSummeryRecord])
    const stepItems = [
        {
            title: 'Process Order Creation',
            icon: <FileAddOutlined />,
        },
        {
            title: 'Operation Mapping',
            icon: <ClusterOutlined />,
        },
        {
            title: 'Job Generation',
            icon: <BuildOutlined />,
        },
        {
            title: 'View  Jobs',
            icon: <EyeOutlined />,
        },
        {
            title: 'Move to Inventory',
            icon: <SendOutlined />
        }
        // {
        //     title: 'Job Tracker',
        //     icon: <DashboardOutlined />,
        // },
    ];

    const onStepChange = (step: number, selectedRecord: any) => {
        if (step) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage("Please Select Sew Order and Proceed.");

            } else {
                setCurrentStep(step);
                setShowDialog(true)
                setSelectedSummeryRecord(selectedRecord);
            }
        } else {
            setCurrentStep(step);


        }

    }

    const getSpsHeaderInfo = (procesSerNum:number) => {
        try {
            const req = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,procesSerNum,undefined,undefined,undefined)
            sewingProcessingOrderService.getHeaderInfoForSewSerial(req).then(res => {
                if (res.status) {
                    setHeaderInfo(res.data)
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <SpsProcessingOrder onStepChange={onStepChange} setPrcSerialAndStyleCode={setSelectedSummeryRecord} />
            case 1: return   <div style={{ padding: '10px' }}><OpVersionView processType='SEWING' poSerial={selectedSummeryRecord?.processingSerial} /> </div>
            case 2: return  <PrcessJobGeneration  actionType='CREATE' processingSerial={selectedSummeryRecord?.processingSerial} /> ;
            case 3: return  <PrcessJobGeneration  actionType='VIEW' processingSerial={selectedSummeryRecord?.processingSerial} /> ;
            // case 3: return <ViewSewingJobs poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 4: return <h1>{step}</h1>;
            case 5: return <MoveToInvPage poSerial={selectedSummeryRecord?.processingSerial} productName={headerInfo.productCodes} fgColor={headerInfo.fgColors}/>
            // case 4: return <h1>{step}</h1>;
            default: return null;
        }
    };

    return (
        <>
            <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="SPS Process will be halted" />

            <Card
                size="small"
                className="card-title-bg-cyan1 pad-0 po-process"
                bodyStyle={{ padding: '0px 10px' }}
            >
                <Steps
                    size="small"
                    type="navigation"
                    current={currentStep}
                    onChange={(e) => onStepChange(e, selectedSummeryRecord)}
                >
                    {stepItems.map((item, index) => (
                        <Steps.Step
                            key={index}
                            title={item.title}
                            icon={item.icon}
                        />
                    ))}
                </Steps>
            </Card>
           {selectedSummeryRecord&&(currentStep > 0) ? <SPSHeaderInfo procSerial = {procSerial} moInfo={headerInfo ? headerInfo : null} /> : <br />}
            {renderComponents(currentStep)}


            {/* <SewingJobTracker/> */}
        </>
    )
}
