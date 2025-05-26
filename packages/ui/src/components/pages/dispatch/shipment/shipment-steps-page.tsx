import { BookOutlined, IdcardOutlined, SolutionOutlined } from "@ant-design/icons";
import { Card, Steps, Table } from "antd";

import { useEffect, useState } from 'react';
import CreateShippableSetPage from "./shippable-set/create-shippable-set-page";
import ReadyToShip from "./ready-dispatch/ready-to-ship-page";

import DispatchPage from "./create-dispatch/shipping-request-page-creation";
import PendingDispatchPage from "./pending-dispatch/pending-dispatch-page";

export const ShipMentPage = () => {

    const [currentStep, setCurrentStep] = useState<number>(0);
    useEffect(() => {

    }, [])
    const onStepChange = (step: number) => {

        setCurrentStep(step);
    }
    const renderComponents = (step: number) => {
        switch (step) {
            case 0:
                return <CreateShippableSetPage />;
            case 1:
                return <DispatchPage />;
            case 2:
                return <PendingDispatchPage />
            case 3:
                return <ReadyToShip key="case3" disableActions={false} stepCase={3} showPrintAod={false} />;  
            case 4:
                return <ReadyToShip key="case4" disableActions={true} stepCase={4} showPrintAod={true} />;   
              

            default: 
                return <h1>No Component</h1>;
        }
    };

    return <>
        <Card size="small" className="card-title-bg-cyan1 pad-0 grn-process" bodyStyle={{ padding: '0px' }}>
            <Steps
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
            {renderComponents(currentStep)}
        </Card>
    </>
}
export default ShipMentPage;