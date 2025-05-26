import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import OpVersionViewPage from './op-version-view-page';
import { KnitOrderService, OrderCreationService, SewingProcessingOrderService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ProcessingOrderInfoModel, ProcessingOrderInfoRequest, SI_MoNumberRequest, StyleProductCodeFgColor } from '@xpparel/shared-models';
import { POInfoCommonProps } from '../knit-interface';


interface IMoStyleProduct extends StyleProductCodeFgColor {
  moNumbers: string[]
}
interface IProps {
  poSerial: number;
  processType: 'KNIT'|'SEWING';
}
const OpVersionView: React.FC<IProps> = ({ poSerial ,processType}) => {

  const orderService = new OrderCreationService();
  const knitOrderService = new KnitOrderService();
  const sewProcessingService = new SewingProcessingOrderService();
  const user = useAppSelector((state) => state.user.user.user);

  const [poProductData, setPoProductData] = useState<ProcessingOrderInfoModel[]>([]);
  const [moProductColors, setMoProductColors] = useState<IMoStyleProduct[]>([]);
const services = {
  'KNIT' : knitOrderService,
  'SEWING' : sewProcessingService
}
  // getStyleProductCodeFgColorForPo

  useEffect(() => {
    getKnittingProcessOrderInfo(poSerial)
  }, [poSerial]);

  const getKnittingProcessOrderInfo = (poSerial: number) => {
    const reqObj = new ProcessingOrderInfoRequest(
      user?.userName,                        // username
      user?.orgData?.unitCode,              // unitCode
      user?.orgData?.companyCode,           // companyCode
      user?.userId,                          // userId
      poSerial,              // processingSerial
      undefined,                             // processType (intentionally left undefined)
      false,                                 // iNeedPrcOrdFeatures
      true,                                  // iNeedPrcOrdMoInfo
      false,                                 // iNeedPrcOrdMoFeatures
      true,                                  // iNeedPrcOrdLineInfo
      false,                                 // iNeedPrcOrdLineFeatures
      true,                                 // iNeedPrcOrdProductInfo
      false,                                 // iNeedPrcOrdProductFeatures
      true,                                 // iNeedPrcOrdSubLineInfo
      false                                  // iNeedPrcOrdSubLineFeatures
    );
    const service = services[processType];
    service.getProcessingOrderInfo(reqObj).then(res => {
      if (res.status) {
        setPoProductData(res.data);
        constructMoProduct(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
    });
  };
  const constructMoProduct = (poData: ProcessingOrderInfoModel[]) => {
    const productMap = new Map<string, IMoStyleProduct>();
    poData.forEach(ePo => {
      ePo.prcOrdMoInfo.forEach(moObj => { // Mo Number
        moObj.prcOrdLineInfo.forEach(oLObj => {
          oLObj.productInfo.forEach(productObj => { // Product
            productObj.prcOrdSubLineInfo.forEach(subLineObj => {
              const productColorKey = productObj.productCode + "-" + subLineObj.fgColor;

              if (!productMap.has(productColorKey)) {
                const productColorObj: IMoStyleProduct = {
                  fgColor: subLineObj.fgColor,
                  moNumbers: [],
                  productCode: productObj.productCode,
                  productName: productObj.productName,
                  productType: productObj.productType,
                  styleCode: ePo.styleCode
                }
                productMap.set(productColorKey, productColorObj)
              }
              const productColorMo = productMap.get(productColorKey).moNumbers;
              if (!productColorMo.includes(moObj.moNumber)) {
                productColorMo.push(moObj.moNumber)
              }
            });
          });
        });
      });
    });
    const moProductColorData = Array.from(productMap.values());
    setMoProductColors(moProductColorData);
  }


  const items: TabsProps['items'] = moProductColors.map((e, i) => {
    return {
      key: i + e.productType + e.fgColor,
      label: <>{`${e.productCode} | ${e.fgColor}`}</>,
      children: <OpVersionViewPage productColors={e} moNumber={e?.moNumbers[0]} />,
    }
  })


  return <>
    {/* <Card size='small'> */}
    <Tabs defaultActiveKey="1" items={items} />
    {/* </Card> */}
  </>

}

export default OpVersionView;