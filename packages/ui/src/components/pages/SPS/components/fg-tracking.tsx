import React from 'react';
import { Card, Tabs } from 'antd';
import './fg-tracking.css';
import FgInScan from './fg-in';
import FgOutScan from './fg-out';

const FgTracking = () => {
    return (

        <Card bodyStyle={{ paddingTop: '0px' }}>
            <div className="fg-tracking-container">
                <Tabs defaultActiveKey="1" centered>
                    <Tabs.TabPane tab="Fg In Scan" key="1">
                        <div>
                            <FgInScan />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Fg Out Scan" key="2">
                        <FgOutScan />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Card>

    );
};

export default FgTracking;
