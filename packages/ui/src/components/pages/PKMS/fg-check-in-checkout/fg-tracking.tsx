import { Card, Tabs } from 'antd';
import { fgInBarcodeData, userNameData } from './fg-component-dummy-data';
import FgInScan from './fg-in';
import FgOutScan from './fg-out';
import './fg-tracking.css';

export const FgTracking = () => {
    return (

        <Card bodyStyle={{ paddingTop: '0px' }}>
            <div className="fg-tracking-container">
                <Tabs defaultActiveKey="1" centered>
                    <Tabs.TabPane tab="Fg In Scan" key="1">
                        <div>
                            <FgInScan
                                scanStartTime={' '}
                                selectedRecord={null}
                            />
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
