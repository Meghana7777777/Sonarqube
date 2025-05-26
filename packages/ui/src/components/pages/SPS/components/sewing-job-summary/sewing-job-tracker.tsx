import { Card, Tabs } from 'antd';
import SewingJobSizeWiseSummary from './sewing-job-size-wise-summary';
import SewingJobOperationWiseSummary from './sewing-job-operation-wise-summary';
import { SewSerialRequest } from '@xpparel/shared-models';

interface iProps {
    onStepChange: (step: number, selectedRecord: SewSerialRequest) => void;
    poObj: SewSerialRequest
}

const SewingJobTracker = ({ onStepChange, poObj }: iProps) => {
    return (
        <Card bodyStyle={{ paddingTop: '0px' }}>
            <div className="sewing-job-tracker">
                <Tabs defaultActiveKey="1" centered>
                    <Tabs.TabPane tab="Size Wise Summary" key="1">
                        <SewingJobSizeWiseSummary onStepChange={onStepChange} poObj={poObj} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Operation Wise Summary" key="2">
                        <SewingJobOperationWiseSummary onStepChange={onStepChange} poObj={poObj} />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Card>
    );
};

export default SewingJobTracker;
