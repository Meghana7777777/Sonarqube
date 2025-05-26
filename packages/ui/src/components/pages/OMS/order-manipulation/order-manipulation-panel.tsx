import React, { useEffect, useState } from 'react'
import OrderSizeSelection from './order-size-selection'
import { AlertMessages, RouterPrompt } from '../../../common'
import { Badge, Card, Divider, Steps } from 'antd'
import { BookOutlined, IdcardOutlined, SolutionOutlined } from '@ant-design/icons'
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common'
import ItemSkuMapping from './sku-mapping'
import ColorQtyUpdating from './color-qty-updating'
import OrderManipulationView from './order-manipulation-view'
import { RawOrderHeaderInfoModel, RawOrderNoRequest } from '@xpparel/shared-models'
import { OrderManipulationServices } from '@xpparel/shared-services'
interface IOrderManipulation {
    orderIdPk: number;
    manufacturingOrderNo: string;
}
const OrderManipulationPanel = (props: IOrderManipulation) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [rawOrderHeaderInfo, setRawOrderHeaderInfo] = useState<RawOrderHeaderInfoModel>();
    const omsManipulationService = new OrderManipulationServices();
    useEffect(() => {
        if (props.orderIdPk) {
            getManufacturingOrderHeaderInfo(props.orderIdPk);
        }
    }, []);
    const onStepChange = (step: number) => {
        setCurrentStep(step);
        // getManufacturingOrderHeaderInfo(props.orderIdPk);

    }
    const getManufacturingOrderHeaderInfo = (orderIdPk: number) => {

        const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
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
            case 0: return <OrderSizeSelection orderIdPk={props.orderIdPk} updateStep={() => getManufacturingOrderHeaderInfo(props.orderIdPk)} />
            case 1: return <ItemSkuMapping orderIdPk={props.orderIdPk} updateStep={() => getManufacturingOrderHeaderInfo(props.orderIdPk)}/>
            case 2: return <ColorQtyUpdating orderIdPk={props.orderIdPk} updateStep={() => getManufacturingOrderHeaderInfo(props.orderIdPk)}/>
            case 3: return <OrderManipulationView orderIdPk={props.orderIdPk} updateStep={() => getManufacturingOrderHeaderInfo(props.orderIdPk)}/>
            default: return <></>
        }

    }


    return (<>
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="Order Creation will be halted" />
        {/* <Badge.Ribbon text={``} color="#faad14"> */}
            <Card size="small" className="order-manipulation">
                <Steps
                    size="small"
                    // type="navigation"
                    //  direction="vertical"
                    // progressDot
                    current={currentStep}
                    onChange={(e) => onStepChange(e)}
                    items={[
                        {
                            title: <>Size Selection </>,
                            status: rawOrderHeaderInfo?.sizesConfirmed ? 'finish' : 'process',
                            // icon: <BookOutlined />,
                        },
                        {
                            title: 'Item Code Mapping',
                            status: rawOrderHeaderInfo?.packMethodConfirmed ? 'finish' : rawOrderHeaderInfo?.sizesConfirmed ? 'process' : 'wait',
                            disabled: rawOrderHeaderInfo?.sizesConfirmed ? false : true
                            // icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Color & Size Quantity Updation',
                            status: rawOrderHeaderInfo?.sizeBreadDownConfirmed ? 'finish' : rawOrderHeaderInfo?.packMethodConfirmed ? 'process' : 'wait',
                            disabled: rawOrderHeaderInfo?.packMethodConfirmed ? false : true
                            // icon: <IdcardOutlined />,
                        },
                        {
                            title: 'View & Confirm the order',
                            status: rawOrderHeaderInfo?.moConfirmed ? 'finish' : rawOrderHeaderInfo?.sizeBreadDownConfirmed ? 'process' : 'wait',
                            disabled: rawOrderHeaderInfo?.sizeBreadDownConfirmed ? false : true
                            // icon: <IdcardOutlined />,
                        },
                    ]}
                />
                {/* <Divider style={{ margin: '5px 0' }} /> */}

            </Card>
            {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default OrderManipulationPanel;