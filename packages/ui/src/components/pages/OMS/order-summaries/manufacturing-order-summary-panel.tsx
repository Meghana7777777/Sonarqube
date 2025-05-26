import { FolderOpenOutlined } from '@ant-design/icons';
import { ManufacturingOrderSummaryEnum, CommonRequestAttrs, SI_ManufacturingOrderInfoModel } from '@xpparel/shared-models';
import { OrderCreationService } from '@xpparel/shared-services';
import { Card, Form, Tabs, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import OSTABInsideComp from './os-tab-inside-comp';



interface IOrderSummaryPageProps {
    onStepChange: (step: number, selectedRecord: SI_ManufacturingOrderInfoModel) => void;
}

const { TreeNode } = TreeSelect;
export const OrderSummaryPage = (props: IOrderSummaryPageProps) => {
    const { onStepChange } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [activeTab, setActiveTab] = useState();
    const [orderSummery, setOrderSummery] = useState<SI_ManufacturingOrderInfoModel[]>([]);
    const [form] = Form.useForm();
    const orderCreationService = new OrderCreationService()

    useEffect(() => {
        onChangeTab(ManufacturingOrderSummaryEnum.IN_PROGRESS);
    }, []);




    const onChangeTab = (tabKey) => {
        setActiveTab(tabKey)
        form.resetFields();

        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        setOrderSummery([]);
        getOrderSummery(req, tabKey);

    };


    const getOrderSummery = (req: CommonRequestAttrs, tabKey) => {
        orderCreationService[(tabKey === ManufacturingOrderSummaryEnum.OPEN) ? 'getOpenMo' : tabKey === ManufacturingOrderSummaryEnum.IN_PROGRESS ? 'getInProgressMo' : 'getClosedMo'](req)
            .then((res) => {
                if (res.status) {
                    setOrderSummery(res.data);
                } else {
                    setOrderSummery([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    return (
        <>
            <Card className='packing-list-sum' bodyStyle={{ paddingTop: '0px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={onChangeTab}
                    centered
                    items={
                        [
                            {
                                label: <><FolderOpenOutlined />OPEN</>,
                                key: ManufacturingOrderSummaryEnum.OPEN,
                                children: <OSTABInsideComp form={form} tabKey={ManufacturingOrderSummaryEnum.OPEN} orderSummery={orderSummery} onStepChange={onStepChange} onChangeTab={onChangeTab} setActiveTab={setActiveTab} getOrderSummery={null} />,
                            },
                            {
                                label: <><FolderOpenOutlined />In Progress</>,
                                key: ManufacturingOrderSummaryEnum.IN_PROGRESS,
                                children: <OSTABInsideComp orderSummery={orderSummery} onStepChange={onStepChange} />,
                            },
                            {
                                label: <><FolderOpenOutlined />Closed</>,
                                key: ManufacturingOrderSummaryEnum.CLOSED,
                                children: <OSTABInsideComp orderSummery={orderSummery} onStepChange={onStepChange} />,
                            }
                        ]
                    }
                />
            </Card>
        </>
    )
}

export default OrderSummaryPage;