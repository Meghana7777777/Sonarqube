import { ApartmentOutlined, CalculatorOutlined, DashboardOutlined, FileTextOutlined, SnippetsOutlined } from '@ant-design/icons';
import { KnitHeaderInfoModel, ProcessTypeEnum } from '@xpparel/shared-models';
import { KnitOrderService } from '@xpparel/shared-services';
import { Card, Steps } from 'antd';
import { useCallbackPrompt } from 'packages/ui/src/common';
import { useState } from 'react';
import { AlertMessages, RouterPrompt } from '../../../common';
import OpVersionView from '../../KMS/knitting-management/op-version-view/op-view-tab';
import { POInfoCommonProps } from './oes-po-interface';
import OESProcessingOrder from './processing-order/oes-processing-order';

export default function OESMainPanel() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedPoInfo, setSelectedPoInfo] = useState<POInfoCommonProps>();
    const [headerInfo, setHeaderInfo] = useState<KnitHeaderInfoModel>();
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);


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
                return  <></> 
                // <OESProcessingOrder setPrcSerialAndStyleCode={setSelectedPoInfo} onStepChange={onStepChange} />
            case 1:
                return <div style={{ padding: '10px' }}><OpVersionView  processType={'KNIT'} poSerial={selectedPoInfo.processingSerial} /> </div>
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
                            title: "Cut Order",
                            status: "finish",
                            icon: <FileTextOutlined />,
                        },
                        {
                            title: "Operation routing",
                            status: "finish",
                            icon: <ApartmentOutlined />,
                        },
                        // {
                        //     title: "Knit job ratio",
                        //     status: "finish",
                        //     icon: <CalculatorOutlined />,
                        // },
                        // // {
                        // //     title: "Knit job confirmation",
                        // //     status: "finish",
                        // //     icon: <SafetyCertificateOutlined />,
                        // // },
                        // {
                        //     title: "Knit job summary",
                        //     status: "finish",
                        //     icon: <DashboardOutlined />,
                        // },
                        // {
                        //     title: "Knit bundling",
                        //     status: "finish",
                        //     icon: <SnippetsOutlined />,
                        // },


                    ]}
                />
            </Card>

            {renderComponents(currentStep)}


        </>
    )
}
