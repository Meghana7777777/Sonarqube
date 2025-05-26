import { AppstoreAddOutlined, AppstoreOutlined, BookOutlined, CheckSquareOutlined, FolderOpenOutlined, FormOutlined, IdcardOutlined, InsertRowBelowOutlined, OneToOneOutlined, OrderedListOutlined, PicLeftOutlined, SendOutlined, SolutionOutlined, TableOutlined } from '@ant-design/icons';
import { CutDispatchStatusEnum, PackMethodEnum, PoSummaryModel } from '@xpparel/shared-models';
import { Badge, Card, Divider, Steps, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import { setSelectedPO, useAppDispatch, useCallbackPrompt } from '../../../../common';
import { AlertMessages, RouterPrompt } from '../../../common';
import CreateDispatchPage from './create-dispatch-page';
import DispatchHeaderViewGrid from './dispatch-header-view-grid';



export const DispatchHeaderStep = () => {
    const [currentChildTabKey, setCurrentChildTabKey] = useState<string>("1");
    const [currentHeaderTabKey, setCurrentHeaderTabKey] = useState<string>("1");


    useEffect(() => {

    }, []);


    const tabChildComponents: TabsProps['items'] = [
        {
            key: '1',
            label: <><FolderOpenOutlined />Open</>,
            children: <DispatchHeaderViewGrid dispatchStatus={CutDispatchStatusEnum.OPEN} />
        },
        {
            key: '2',
            label: <><SendOutlined />Sent</>,
            children: <DispatchHeaderViewGrid dispatchStatus={CutDispatchStatusEnum.SENT} />
        },

    ];
    const changeChildTab = (key) => {
        setCurrentChildTabKey(key)
    }

    const tabHeaderComponents: TabsProps['items'] = [
        {
            key: '1',
            label: <><AppstoreOutlined />All Dispatch Requests</>,
            children: <>
                <Tabs size='small' defaultActiveKey={currentChildTabKey} onChange={changeChildTab} key={currentHeaderTabKey + currentChildTabKey} items={tabChildComponents} />
            </>,

        },
        {
            key: '2',
            label: <><AppstoreAddOutlined />Create Dispatch</>,
            children: <CreateDispatchPage />,
        },

    ];
    const changeHeaderTab = (key) => {
        setCurrentHeaderTabKey(key)
    }

    return (<>

        <Card size="small" className="card-title-bg-cyan1  po-process" bodyStyle={{ paddingTop: 0 }} >
            <Tabs centered size='small' className="dispatch-tab" onChange={changeHeaderTab} key={currentHeaderTabKey} defaultActiveKey={currentHeaderTabKey} items={tabHeaderComponents} />
        </Card>



    </>)
}

export default DispatchHeaderStep;