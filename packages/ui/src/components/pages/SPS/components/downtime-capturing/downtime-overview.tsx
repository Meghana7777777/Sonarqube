/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeliveredProcedureOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import DowntimeComponent from './downtime-capturing';
import DowntimeViewComponent from './downtime-monitoring';


export const DowntimeOverview = () => {

    const [activeTab, setActiveTab] = useState<any>();


    const onChangeTab = (tabKey: any) => {
        setActiveTab(tabKey);
    };


    return (
        <Card bodyStyle={{paddingTop:'0px'}}>
                <div>
                    <Tabs
                        onChange={onChangeTab}
                        centered
                        defaultActiveKey={activeTab}
                        items={[                           
                            {
                                label: <><FolderOpenOutlined />Downtime Monitoring</>,
                                key: "1",
                                children: <div><DowntimeViewComponent></DowntimeViewComponent></div>,
                            },
                            {
                                label: <><DeliveredProcedureOutlined />Downtime Capturing</>,
                                key: "2",
                                children: <div><DowntimeComponent></DowntimeComponent></div>,

                            },
                        ]}
                    />
                </div>
            </Card>
    )
}

export default DowntimeOverview