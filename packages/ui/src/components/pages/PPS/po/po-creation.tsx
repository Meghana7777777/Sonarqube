import { DeliveredProcedureOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { PoSummaryModel, SoListModel, SoListRequest, SoStatusEnum } from '@xpparel/shared-models';
import { OrderManipulationServices } from '@xpparel/shared-services';
import { Card, Form, Select, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import CreatePo from './po-create';
import POView from './po-view';


interface IPoCreationProps {
    onStepChange: (step: number, selectedRecord: PoSummaryModel) => void;
}
const { Option } = Select;
export const PoCreation = (props: IPoCreationProps) => {
    const { onStepChange } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [activeTab, setActiveTab] = useState<any>();

    useEffect(() => {
        setActiveTab(SoStatusEnum.COMPLETED.toString());
        onChangeTab(SoStatusEnum.COMPLETED.toString());
    }, []);



    const onChangeTab = (tabKey) => {
        setActiveTab(tabKey);
    };


    return (
        <>
            <Card  className='packing-list-sum' bodyStyle={{paddingTop:'0px'}}>
                <div>
                    <Tabs
                        onChange={onChangeTab}
                        centered
                        defaultActiveKey={activeTab}
                        items={[                           
                            {
                                label: <><FolderOpenOutlined />Cut Orders</>,
                                key: SoStatusEnum.COMPLETED.toString(),
                                children: <POView onStepChange={onStepChange} />,
                            },
                            {
                                label: <><DeliveredProcedureOutlined />Create Cut Order</>,
                                key: SoStatusEnum.OPEN.toString(),
                                children: <CreatePo />,
                            },
                        ]}
                    />
                </div>
            </Card>
        </>
    )
}

export default PoCreation