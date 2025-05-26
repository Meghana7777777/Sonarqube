import { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import { DeliveredProcedureOutlined, FolderOpenOutlined } from '@ant-design/icons';
import MoViewScreen from './mo-view-screen';
import CreateMO from './mo-create-screen';
import { PoSummaryModel, SewSerialRequest, MoStatusEnum } from '@xpparel/shared-models';

interface MOCreationProps {
    onStepChange: (step: number, selectedRecord: SewSerialRequest) => void;
}

const MoCreation = (props: MOCreationProps) => {
    const { onStepChange } = props;
    const [activeTab, setActiveTab] = useState('1');


    useEffect(() => {
        setActiveTab(MoStatusEnum.COMPLETED.toString());
        onChangeTab(MoStatusEnum.COMPLETED.toString());
    }, []);

    const onChangeTab = (tabKey: string) => {
        setActiveTab(tabKey);
    };

    const handleOrderSuccess = () => {
        setActiveTab(MoStatusEnum.COMPLETED.toString());
    };

    return (
        <Card bodyStyle={{ paddingTop: '0px' }}>
            <div>
                <Tabs
                    onChange={onChangeTab}
                    centered
                    activeKey={activeTab}
                    items={[
                        {
                            label: (<><FolderOpenOutlined />Routing Orders</>),
                            key: MoStatusEnum.COMPLETED.toString(),
                            children: (<div key={`tab-content-1-${activeTab}`}><MoViewScreen onStepChange={onStepChange} /></div>),
                        },
                        {
                            label: (<> <DeliveredProcedureOutlined /> Create Routing Order</>),
                            key: MoStatusEnum.OPEN.toString(),
                            children: (<div key={`tab-content-2-${activeTab}`}><CreateMO onOrderSuccess={handleOrderSuccess} /></div>),
                        },
                    ]}
                />
            </div>
        </Card>
    );
};

export default MoCreation;