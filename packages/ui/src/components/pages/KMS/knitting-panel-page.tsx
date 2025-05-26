import React, { useEffect, useState } from 'react'

import { Badge, Card, Divider, Steps } from 'antd'
import { AppstoreAddOutlined, BookOutlined, CheckCircleOutlined, CloudUploadOutlined, FontSizeOutlined, IdcardOutlined, InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons'
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common'

import { RawOrderHeaderInfoModel, RawOrderNoRequest } from '@xpparel/shared-models'
import { MOInfoService, OrderManipulationServices } from '@xpparel/shared-services'
import { AlertMessages, RouterPrompt } from '../../common'
import KnitProcessingOrder from './knitting-management/po-creation/knit-processing-order'
import OpVersionPage from '../OMS/op-version-view-page'
// Not Using
interface IOrderManipulation {
    orderIdPk: number;
    manufacturingOrderNo: string;
}
const KnitOrderPanel = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [rawOrderHeaderInfo, setRawOrderHeaderInfo] = useState<RawOrderHeaderInfoModel>();
    const [selectedMoNumber, setSelectedMoNumber] = useState<string>(undefined);
    const omsManipulationService = new MOInfoService();
    // useEffect(() => {
    //     if (props.orderIdPk) {
    // }, []);
    const onStepChange = (step: number) => {
        setCurrentStep(step);

    }
    const getManufacturingOrderHeaderInfo = (moNumber: string, step?: number) => {
        if(step) {
            setCurrentStep(step)
            return
        }
        if (moNumber) {
            setSelectedMoNumber(moNumber);
        }
        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, undefined, undefined, undefined, undefined, true, false, false, true, false);
        omsManipulationService.getRawOrderHeaderInfo(req).then((res => {
            if (res.status) {
                const data = res.data[0];
                setRawOrderHeaderInfo(data);
            } else {
                setRawOrderHeaderInfo(undefined);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setRawOrderHeaderInfo(undefined);
            AlertMessages.getErrorMessage(error.message)
        });

    }
    const renderComponents = (step: number) => {
        switch (step) {
            // case 0: return <KnitProcessingOrder />
            // case 1: return <OpVersionPage style={''} productType={''} />
            // case 2: return <OpVersionTab moNumber={selectedMoNumber}/>
            // case 3: return <OrderManipulationView orderIdPk={null} updateStep={() => getManufacturingOrderHeaderInfo(null)} />
            default: return <></>
        }

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
                        title: "Knitting Order ",
                        status: 'process',
                        icon: <CloudUploadOutlined />,
                    },
                    {
                        title: <>Operation Version </>,
                        // status: rawOrderHeaderInfo?.sizesConfirmed ? 'finish' : 'process',
                        status: 'wait',
                        // disabled: rawOrderHeaderInfo?.sizesConfirmed ? false : true,
                        icon: <FontSizeOutlined />,


                    },
                    {
                        title: 'Bom info',
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
        {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default KnitOrderPanel;