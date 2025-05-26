import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BomSpVersionMapping from './bom-sp-version-mapping';
import { OrderCreationService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { SI_MoNumberRequest, StyleProductCodeFgColor } from '@xpparel/shared-models';

// getDistinctProductFgColorInfoForSO // to get multiple product versions
// getOpVersionsForStyleAndProductType // drop down
// getOpVersionInfoForStyleAndProductType // operation version 
// getOrderInfoBySaleOrderProductTypeFgColor // 
const onChange = (key: string) => {

};



interface IProps {
  moNumber: string;
}
const OpVersionBomSubProcessMapTab: React.FC<IProps> = ({ moNumber }) => {
  // const moNumber = 'sdd';
  const orderService = new OrderCreationService();
  const user = useAppSelector((state) => state.user.user.user);
  const [productColors, setProductColors] = useState<StyleProductCodeFgColor[]>([]);

  useEffect(() => {
    getDistinctProductFgColorInfoForMO()
  }, [moNumber]);

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
      children: <BomSpVersionMapping productColors={e} moNumber={moNumber} />,
    }
  })


  return <>
    {/* <Card size='small' style={{marginTop: '20px'}}>  */}
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    {/* </Card> */}
  </>

}

export default OpVersionBomSubProcessMapTab;