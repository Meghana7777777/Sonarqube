import { ApartmentOutlined, CalculatorOutlined, DashboardOutlined, FileTextOutlined, SafetyCertificateOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import KnitJobRatioCreation from './knit-job-ratio-creation/knit-job-ratio-creation';
import KnitProcessingOrder from './po-creation/knit-processing-order';
import KnitJobConfirmation from './knit-job-confirmation/knit-job-confirmation';
import KnitJobSummary from './knit-job-summary/knit-job-summary';
import { AlertMessages, RouterPrompt } from '../../../common';
import { useCallbackPrompt } from 'packages/ui/src/common';
import { KnitBundlePoPage } from './knit-bundle-po/knit-bundle-po-page';
import OpVersionView from './op-version-view/op-view-tab';
import { POInfoCommonProps } from './knit-interface';
import KnittingHeaderInfo from './knit-header';
import { KnitOrderService } from '@xpparel/shared-services';
import { KC_KnitRatioCreationRequest, KnitHeaderInfoModel, KnitHeaderInfoResoponse } from '@xpparel/shared-models';


export default function KnittingMainPanel() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedPoInfo, setSelectedPoInfo] = useState<POInfoCommonProps>();
    const [headerInfo, setHeaderInfo] = useState<KnitHeaderInfoModel>();
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const knitOrderService = new KnitOrderService()
    
   
    const onStepChange = (step: number, selectedRecord: POInfoCommonProps) => {
        if (step) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage(`Please Select an MO and Proceed.`);
                // return false;
            } else {
                setCurrentStep(step);
                setShowDialog(true)
                setSelectedPoInfo(selectedRecord);   
            }
        } else {
            setCurrentStep(step);
            //   history.replace('/pps/poPlanning')

        }

    }

    const renderComponents = (step: number) => {
        switch (step) {
            case 0:
                return <KnitProcessingOrder setPrcSerialAndStyleCode={setSelectedPoInfo} onStepChange={onStepChange} />
            case 1:
                return <div style={{ padding: '10px' }}><OpVersionView  processType='KNIT' poSerial={selectedPoInfo.processingSerial} /> </div>
            case 2:
                //selectedPoInfo.processingSerial
                //selectedPoInfo.styleCode
                return <KnitJobRatioCreation processingSerial={selectedPoInfo?.processingSerial} styleCode={selectedPoInfo?.styleCode} />
            // case 3:
            //     return <KnitJobConfirmation processingSerial={selectedPoInfo?.processingSerial} styleCode={selectedPoInfo?.styleCode} />
            case 3:
                return <KnitJobSummary processingSerial={selectedPoInfo?.processingSerial} styleCode={selectedPoInfo?.styleCode} />
            case 4:
                return <KnitBundlePoPage processingSerial={selectedPoInfo.processingSerial} />
            default:
                return <h1>No Component</h1>;
        }
    };

    return (
        <>
            <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText={`Current process will be halted`} />
            <Card
                size="small"
                className="card-title-bg-cyan1 pad-0 grn-process"
                bodyStyle={{ padding: "0px" }}
            >   <Steps
                    size="small"
                    type="navigation"
                    //  direction="vertical"
                    current={currentStep}
                    onChange={(e) => onStepChange(e, selectedPoInfo)}
                    items={[
                        {
                            title: "Knit Order",
                            status: "finish",
                            icon: <FileTextOutlined />,
                        },
                        {
                            title: "Operation routing",
                            status: "finish",
                            icon: <ApartmentOutlined />,
                        },
                        {
                            title: "Knit job ratio",
                            status: "finish",
                            icon: <CalculatorOutlined />,
                        },
                        // {
                        //     title: "Knit job confirmation",
                        //     status: "finish",
                        //     icon: <SafetyCertificateOutlined />,
                        // },
                        {
                            title: "Knit job summary",
                            status: "finish",
                            icon: <DashboardOutlined />,
                        },
                        {
                            title: "Knit bundling",
                            status: "finish",
                            icon: <SnippetsOutlined />,
                        },


                    ]}
                />
                 </Card>
                {currentStep !==0 && <KnittingHeaderInfo processSer={selectedPoInfo.processingSerial ? selectedPoInfo.processingSerial : null} />}
                
                {renderComponents(currentStep)}
             
           
        </>
    )
}
