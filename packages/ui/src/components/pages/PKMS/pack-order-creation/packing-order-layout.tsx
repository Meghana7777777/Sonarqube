import { BookOutlined, PrinterOutlined, SolutionOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { PackSerialRequest, ProcessingOrderViewInfoModel } from '@xpparel/shared-models';
import { Card, Col, Row, Steps } from 'antd';
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common';
import { useState } from 'react';
import { ReactComponent as Items } from '../../../../assets/icons/Purchase order Icons.svg';
import { AlertMessages, RouterPrompt } from '../../../common';
import { PackListCreation } from '../pack-list-creation/pack-list-creation';
import { PackListViewGrid } from '../pack-list-view';
import OmsDynamicItemsFromToPkms from './oms-dynamic-items-to-pkms';
import PKMSProcessingOrderCreation from './pkms-processing-order-creation';


export const PackingOrderLayout = () => {
    const user = useAppSelector((state) => state.user.user.user);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<PackSerialRequest>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog); 
    const [selectedStyleAndMo, setSelectedStyleAndMo] = useState<{ style: string, mo: string }>({ style: '', mo: '' });

    const onStepChange = (step: number, selectedRecord: PackSerialRequest) => {
        if (step || step === 0) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage("Please Select Packing Order and Proceed.");
            } else {
                setCurrentStep(step);
                setShowDialog(true)
                setSelectedSummeryRecord(selectedRecord);
            }
        } else {
            AlertMessages.getErrorMessage('Please Select Correct Step')
        }

    }




    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <PKMSProcessingOrderCreation onProceed={onProceed} setSelectedStyleAndMo={setSelectedStyleAndMo} currentStep={currentStep} selectedStyleAndMo={selectedStyleAndMo} />
            case 1: return <OmsDynamicItemsFromToPkms selectedSummeryRecord={selectedSummeryRecord} setCurrentStep={setCurrentStep} />;
            case 2: return <PackListCreation selectedSummeryRecord={selectedSummeryRecord} />;
            case 3: return <PackListViewGrid selectedSummeryRecord={selectedSummeryRecord} />;
            default: return <></>;
        }
    };

    const onProceed = (rec: ProcessingOrderViewInfoModel) => {
        setCurrentStep(1);
        const pkList = new PackSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rec.processingSerial, rec.processingSerial, true, true, rec.moNumber)
        setSelectedSummeryRecord(pkList)
    }

    const stepItems = [
        {
            title: 'Packing Order Creation',
            icon: <BookOutlined />,
        },
        {
            title: 'Items',
            icon: <Icon component={Items} />,
        },
        {
            title: 'Pack List Creation',
            icon: <SolutionOutlined />,
        },
        {
            title: 'Print Barcodes',
            icon: <PrinterOutlined />,
        },
    ];

    return (
        <>
            <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="Packing Process will be halted" />

            <Card
                title={<>
                    <Row>
                        <Col >
                            Style: <b>{selectedStyleAndMo?.style}</b>
                        </Col>

                        <Col offset={1}>
                            Mo:<b>{selectedStyleAndMo?.mo}</b>
                        </Col>
                    </Row>

                </>}
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
            {/* {(currentStep > 0) ? <SewPoHeaderView poSerial={2} /> : <br />} */}
            <Card>
                {renderComponents(currentStep)}

            </Card>
        </>
    );
};

export default PackingOrderLayout;
