import { BookOutlined, IdcardOutlined, SolutionOutlined } from "@ant-design/icons";
import { Card, Steps, Table } from "antd";

import { useEffect, useState } from 'react';
import PkDispatchPage from "./pk-create-dispatch/pk-shipping-request-page-creation";
import { PkPendingDispatchPage } from "./pk-pending-dispatch";
import PkReadyToShip from "./pk-ready-dispatch/pk-ready-to-ship-page";
import { PkCreateShippableSetPage } from "./pk-shippable-set";
import '../pk-shipment/pk-ready-dispatch/pk-dispatch.css'


export const PkShipMentPage = () => {

    const [currentStep, setCurrentStep] = useState<number>(0);
    useEffect(() => {

    }, [])
    const onStepChange = (step: number) => {

        setCurrentStep(step);
    }
    const renderComponents = (step: number) => {
        switch (step) {
            case 0:
                return <PkCreateShippableSetPage />;
            case 1:
                return <PkDispatchPage />;
            case 2:
                return <PkPendingDispatchPage />
            case 3:
                return <PkReadyToShip key="case3" disableActions={false} stepCase={3} showPrintAod={false} />;  
            case 4:
                return <PkReadyToShip key="case4" disableActions={true} stepCase={4} showPrintAod={true} />;   
              

            default: 
                return <h1>No Component</h1>;
        }
    };

    return <>
        <Card size="small" className="card-title-bg-cyan1 pad-0 po-process" bodyStyle={{ padding: '0px 15px' }}>
            <Steps
             className="custom-step-gap"
                size="small"
                type="navigation"
                //  direction="vertical"
                current={currentStep}
                onChange={(e) => onStepChange(e)}
                items={[
                    {
                        // title: <>Packing List <Badge count={phId} color='#faad14' /></>,
                        title: 'Create Shippable Sets',
                        status: 'finish',
                        icon: <BookOutlined />,
                    },
                    {
                        title: 'Create Dispatch',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: 'Pending Dispatches',
                        status: 'process',
                        icon: <IdcardOutlined />,
                    },
                    {
                        title: 'Ready to Ship',
                        status: 'process',
                        icon: <IdcardOutlined />,
                    },
                    {
                        title: 'Dispatched',
                        status: 'process',
                        icon: <IdcardOutlined />,
                    },
                ]}
            />
        </Card>
        {renderComponents(currentStep)}
    </>
}
export default PkShipMentPage;