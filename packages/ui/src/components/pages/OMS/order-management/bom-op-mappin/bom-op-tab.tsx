import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BomOpVersionMapping from './bom-op-version-mapping';
import { OrderCreationService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { SI_MoNumberRequest, StyleProductCodeFgColor } from '@xpparel/shared-models';

// getDistinctProductFgColorInfoForMO // to get multiple product versions
// getOpVersionsForStyleAndProductType // drop down
// getOpVersionInfoForStyleAndProductType // operation version 
// getOrderInfoBySaleOrderProductTypeFgColor // 
const onChange = (key: string) => {
    console.log(key);
};


  
interface IProps {
    moNumber: string;
}
export const OpVersionTab: React.FC<IProps> = ({moNumber}) => {

    const orderService = new OrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [productColors, setProductColors] = useState<StyleProductCodeFgColor[]>([]);

    useEffect(() => {
        getDistinctProductFgColorInfoForMO()
    }, []);

    const getDistinctProductFgColorInfoForMO = () => {
        const reqObj = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, undefined, false, false, false, false, false, false, false, false, false, false, false);
        orderService.getDistinctProductFgColorInfoForMO(reqObj).then(res => {
            if (res.status) {
                setProductColors(res.data);               
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const items: TabsProps['items'] = productColors.map((e, i) => {
        return {
            key: i + e.productType + e.fgColor,
            label: <>{`${e.productCode}-${e.fgColor}`}</>,
            children: <BomOpVersionMapping productColors={e} moNumber={moNumber}/>,
        }
    })


    return (
    <>
    {/* <Card size='small'> */}
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    {/* </Card> */}
    </>
    )

}

export default OpVersionTab;