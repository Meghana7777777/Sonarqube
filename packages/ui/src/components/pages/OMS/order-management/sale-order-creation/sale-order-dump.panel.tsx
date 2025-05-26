import { CheckCircleOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { MOHeaderInfoModel, RawOrderHeaderInfoModel, RawOrderNoRequest, SI_MoProductIdRequest, SI_SoProductIdRequest, SOHeaderInfoModel } from '@xpparel/shared-models'
import { OrderManipulationServices, SaleOrderCreationService } from '@xpparel/shared-services'
import { Badge, Card, Steps } from 'antd'
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common'
import { useState } from 'react'
import { AlertMessages, RouterPrompt } from '../../../../common'
import SaleOrderDump from './sale-order-dump'
import SaleorderPreview from './sale-order-preview'
import ManufacturingOrderHeaderView from './so-header-info'
import ConfirmedSaleOrdersPage from './confirmed-sale-orders'


const SaleOrderDumpPanel = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [rawOrderHeaderInfo, setRawOrderHeaderInfo] = useState<RawOrderHeaderInfoModel>();
    const [selectedSoNumber, setSelectedSoNumber] = useState<string>(undefined);
    const [rawOrderHeaderInfoData, setRawOrderHeaderInfoData] = useState<SOHeaderInfoModel>();

    const omsManipulationService = new OrderManipulationServices();
    const saleOrderCreationService = new SaleOrderCreationService();

    const onStepChange = (step: number) => {
        if (selectedSoNumber || step != 1) {
            setCurrentStep(step);
        } else {
            AlertMessages.getErrorMessage('Please Select SO Number to proceed')
        }


    }
    const getSaleOrderHeaderInfo = (soNumber: string, step?: number) => {
        setSelectedSoNumber(soNumber);
        if (step && soNumber) {
            setCurrentStep(step)
        }
        if (soNumber) {
            getSaleOrderHeaderInfoData(soNumber)
        }
        return
        // const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, soNumber, undefined, undefined, undefined, undefined, true, false, false, true, false);
        // omsManipulationService.getRawOrderHeaderInfo(req).then((res => {
        //     if (res.status) {
        //         const data = res.data[0];
        //         setRawOrderHeaderInfo(data);
        //     } else {
        //         setRawOrderHeaderInfo(undefined);
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     setRawOrderHeaderInfo(undefined);
        //     AlertMessages.getErrorMessage(error.message)
        // });

    }
    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <SaleOrderDump updateSoNumber={(soNumber) => getSaleOrderHeaderInfo(soNumber, 1)}></SaleOrderDump>
            case 1: return <SaleorderPreview soNumber={selectedSoNumber} goToFirstStep={() => setCurrentStep(2)} />;
            case 2: return <ConfirmedSaleOrdersPage />
            default: return <></>
        }

    }
    const getSaleOrderHeaderInfoData = (soNumber: string) => {
        const req = new SI_SoProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, soNumber, undefined, undefined, undefined, true, false, false, true,);
        saleOrderCreationService.getSoInfoHeader(req).then((res => {
            if (res.status) {
                setRawOrderHeaderInfoData(res.data[0]);
            } else {
                setRawOrderHeaderInfoData(undefined);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setRawOrderHeaderInfoData(undefined);
            AlertMessages.getErrorMessage(error.message)
        });
    }


    return (<>
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="Sale Order Creation will be halted" />
        {/* <Badge.Ribbon text={`So Number : ${selectedSoNumber ? selectedSoNumber : '-'}`} color="#faad14"> */}
        <Card size="small" bodyStyle={{ padding: '0' }} className="order-manipulation">
            <Steps
                size="small"
                type='navigation'
                current={currentStep}
                onChange={(e) => onStepChange(e)}
                items={[
                    {
                        title: "Excel upload ",
                        status: 'process',
                        icon: <CloudUploadOutlined />,
                    },
                    {
                        title: 'Preview and Confirm',
                        // status: rawOrderHeaderInfo?.soConfirmed ? 'finish' : rawOrderHeaderInfo?.sizeBreadDownConfirmed ? 'process' : 'wait',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizeBreadDownConfirmed ? false : true,
                        icon: <CheckCircleOutlined />,

                    },
                    {
                        title: 'Confirmed Sale Orders',
                        // status: rawOrderHeaderInfo?.soConfirmed ? 'finish' : rawOrderHeaderInfo?.sizeBreadDownConfirmed ? 'process' : 'wait',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizeBreadDownConfirmed ? false : true,
                        icon: <CheckCircleOutlined />,

                    },
                ]}
            />
            {/* <Divider style={{ margin: '5px 0' }} /> */}

        </Card>
        {/* {rawOrderHeaderInfoData && currentStep !== 0 && currentStep !== 2 && <><br /><ManufacturingOrderHeaderView soInfo={rawOrderHeaderInfoData} soNum={selectedSoNumber} /><br /></>} */}
        {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default SaleOrderDumpPanel;