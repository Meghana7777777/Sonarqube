import React, { useState } from 'react';
import { Card, Steps } from 'antd';
import { BookOutlined, SolutionOutlined, FormOutlined, PicLeftOutlined } from '@ant-design/icons';
import OperationMapping from './operation-mapping';
import ViewSewingJobs from './view-sewing-jobs';
import SewingJobGeneration from './sewing-job-generation';
import { PoSummaryModel, SewSerialRequest } from '@xpparel/shared-models';
import SewPoHeaderView from './sew-po-header-view';
import { sewingJobBatchDetailsData } from './components-dumy-data';
import { AlertMessages, RouterPrompt } from '../../../common';
import { setSelectedPO, useAppDispatch, useCallbackPrompt } from 'packages/ui/src/common';
import MoCreation from './sewing-order-creation/mo-creation-overview';
import SewingJobGenerationPage from '../sewing-job-gen/sew-job-gen-page';
import SewingJobGenerationForPlannedPage from '../sewing-job-gen-planned/sew-job-gen-for-plan-page';
import SewingJobGroupPlannedPage from '../sewing-job-gen-planned/sew-job-groups-page';
import SewingJobTracker from './sewing-job-summary/sewing-job-tracker';
// import SewingJobGenerationForPlannedPage from '../sewing-job-gen-planned/sew-job-gen-for-plan-page';
// import SewingJobGroupPlannedPage from '../sewing-job-gen-planned/sew-job-groups-page';

const SewingLayout = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<SewSerialRequest>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);



    const onStepChange = (step: number, selectedRecord: SewSerialRequest) => {
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

    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <MoCreation onStepChange={onStepChange} />
            case 1: return <OperationMapping poObj={selectedSummeryRecord} onStepChange={onStepChange} />;
            // case 2: return <SewingJobGenerationPage sewSerialObj={selectedSummeryRecord} />;
            case 2: return <SewingJobGroupPlannedPage sewSerialObj={selectedSummeryRecord} />;
            // case 3: return <ViewSewingJobs poSerial={selectedSummeryRecord?.poSerial} onStepChange={onStepChange} />;
            case 4: return <SewingJobTracker onStepChange={onStepChange} poObj={selectedSummeryRecord} />;
            default: return null;
        }
    };

    const stepItems = [
        {
            title: 'Routing Order Creation',
            icon: <BookOutlined />,
        },
        {
            title: 'Operation Mapping',
            icon: <SolutionOutlined />,
        },
        {
            title: 'Routing Job Generation',
            icon: <FormOutlined />,
        },
        {
            title: 'View Routing Jobs',
            icon: <PicLeftOutlined />,
        },
        // {
        //     title: 'Routing Job Tracker',
        //     icon: <PicLeftOutlined />,
        // },
    ];

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
           {(currentStep > 0) ? <SewPoHeaderView poSerial={selectedSummeryRecord?.poSerial} /> : <br />}
            {renderComponents(currentStep)}

            {/* <SewingJobTracker/> */}
        </>
    );
};

export default SewingLayout;
