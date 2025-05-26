import { FolderOpenOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";
import { PackOrderCreationStatusEnum, PackSerialRequest } from "@xpparel/shared-models";
import { Card, Tabs } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PackOrderView } from "./pack-order-view";
import { PackOrderCreation } from "./pack-order-creation";

interface PackOrderCreationPageProps {
    onStepChange: (step: number, selectedRecord: PackSerialRequest) => void;
}

export const PackOrderCreationPage = (props: PackOrderCreationPageProps) => {

    const { onStepChange } = props;
    const [activeTab, setActiveTab] = useState(PackOrderCreationStatusEnum.COMPLETED);


    useEffect(() => {
        setActiveTab(PackOrderCreationStatusEnum.COMPLETED);
        onChangeTab(PackOrderCreationStatusEnum.COMPLETED);
    }, []);

    const onChangeTab = (tabKey: PackOrderCreationStatusEnum) => {
        setActiveTab(tabKey);
    };

    const handleOrderSuccess = () => {
        setActiveTab(PackOrderCreationStatusEnum.COMPLETED);
    };
    return <Card bodyStyle={{ paddingTop: '0px' }}>  <Tabs
        onChange={onChangeTab}
        centered
        activeKey={activeTab}
        items={[
            {
                label: (<><FolderOpenOutlined />Packing Orders</>),
                key: PackOrderCreationStatusEnum.COMPLETED,
                children: (<div key={`tab-content-1-${activeTab}`}><PackOrderView onStepChange={onStepChange}/></div>),
            },
            {
                label: (<> <DeliveredProcedureOutlined />Create Pack Order</>),
                key: PackOrderCreationStatusEnum.OPEN,
                children: (<div key={`tab-content-2-${activeTab}`}><PackOrderCreation onOrderSuccess={handleOrderSuccess} /></div>),
            },
        ]}
    /></Card>;
};

export default PackOrderCreationPage;
