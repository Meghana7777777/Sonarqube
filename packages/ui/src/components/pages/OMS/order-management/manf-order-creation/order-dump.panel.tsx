import { AppstoreAddOutlined, CheckCircleOutlined, CloudUploadOutlined, FontSizeOutlined } from '@ant-design/icons'
import { MOHeaderInfoModel, RawOrderHeaderInfoModel, RawOrderNoRequest, SI_MoProductIdRequest } from '@xpparel/shared-models'
import { OrderCreationService, OrderManipulationServices } from '@xpparel/shared-services'
import { Card, Steps } from 'antd'
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common'
import { useEffect, useState } from 'react'
import { AlertMessages, RouterPrompt } from '../../../../common'
import OpVersionTab from '../bom-op-mappin/bom-op-tab'
import ManufacturingOrderDump from './manufacturing-order-dump'
import ManufacturingorderPreview from './manufacturing-order-preview'
import OrderSizeSelectionView from './order-size-selection-view'
import ManufacturingOrderHeaderView from './mo-header-info'

const OrderDumpPanel = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [rawOrderHeaderInfo, setRawOrderHeaderInfo] = useState<RawOrderHeaderInfoModel>();
    const [rawOrderHeaderInfoData, setRawOrderHeaderInfoData] = useState<MOHeaderInfoModel>();

    const [selectedMoNumber, setSelectedMoNumber] = useState<string>(undefined);
    const omsManipulationService = new OrderManipulationServices();
    const orderCreationService = new OrderCreationService();

    const onStepChange = (step: number) => {
        if(selectedMoNumber) {
            setCurrentStep(step);
        } else {
            AlertMessages.getErrorMessage('Please Select MO Number to proceed')
        }
       

    }

    useEffect(() => {
     if(selectedMoNumber){

        getManufacturingOrderHeaderInfoData(selectedMoNumber);
     }
    }, [selectedMoNumber])
    
    const getManufacturingOrderHeaderInfo = (moNumber: string, step?: number) => {
        setSelectedMoNumber(moNumber)

        if(step && moNumber) {
            setCurrentStep(step)
        }
        
        return
        // const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, undefined, undefined, undefined, undefined, true, false, false, true, false);
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
            case 0: return <ManufacturingOrderDump updateMoNumber={(moNumber) => getManufacturingOrderHeaderInfo(moNumber, 1)} />
            case 1: return <OrderSizeSelectionView moNumbers={selectedMoNumber} />
            case 2: return <OpVersionTab moNumber={selectedMoNumber}/>
            case 3: return <ManufacturingorderPreview moNumber={selectedMoNumber} goToFirstStep={() => setCurrentStep(0)}/>
            default: return <></>
        }

    }
    const getManufacturingOrderHeaderInfoData = (moNumber: string) => {
        const req = new SI_MoProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, undefined, undefined, undefined, true, false, false, true,);
        orderCreationService.getMoInfoHeader(req).then((res => {
            if (res.status) {
                setRawOrderHeaderInfoData( res.data[0]);
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
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="Order Creation will be halted" />
        {/* <Badge.Ribbon text={``} color="#faad14"> */}
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
                        title: <>Sizes </>,
                        // status: rawOrderHeaderInfo?.sizesConfirmed ? 'finish' : 'process',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizesConfirmed ? false : true,
                        icon: <FontSizeOutlined />,


                    },
                    {
                        title: 'BOM info',
                        // status: rawOrderHeaderInfo?.packMethodConfirmed ? 'finish' : rawOrderHeaderInfo?.sizesConfirmed ? 'process' : 'wait',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizesConfirmed ? false : true,
                        icon: <AppstoreAddOutlined />,
                    },
                    {
                        title: 'Preview and Confirm',
                        // status: rawOrderHeaderInfo?.moConfirmed ? 'finish' : rawOrderHeaderInfo?.sizeBreadDownConfirmed ? 'process' : 'wait',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizeBreadDownConfirmed ? false : true,
                        icon: <CheckCircleOutlined />,

                    },
                ]}
            />
            {/* <Divider style={{ margin: '5px 0' }} /> */}

        </Card>
        {currentStep!=0 && rawOrderHeaderInfoData && <><br/><ManufacturingOrderHeaderView moInfo={rawOrderHeaderInfoData}  moNum={selectedMoNumber}/><br/></>}
        {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default OrderDumpPanel;