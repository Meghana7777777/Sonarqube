import {
  DistinctPLItemCategoriesModel,
  FGItemCategoryEnum,
  InsConfigItemsModel,
  InsInspectionRollSelectionTypeEnum,
  InsTypesEnumType,
  PackingListSummaryModel,
  PackListIdRequest,
  PhItemCategoryEnum,
  PLHeadIdReq
} from '@xpparel/shared-models';

import { LocationAllocationService, PackingListService, WMSInspectionConfigService } from '@xpparel/shared-services';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { ScxCard } from '../../../../schemax-component-lib';
import { AlertMessages } from '../../../common';
import { PreferenceForCategory } from './preference-for-category';

interface IInspectionPreferenceProps {
  summeryDataRecord: PackingListSummaryModel;
}


export interface InspectionFabItem {
  id: number
  key: string;
  label: string;
  selected: boolean;
  perc: number;
  materialReady: boolean;
  insType: InsTypesEnumType
  insSelectionType: InsInspectionRollSelectionTypeEnum;
  insConfigItems: InsConfigItemsModel[];
  itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;
}

export const InspectionPreference = (props: IInspectionPreferenceProps) => {
  const { summeryDataRecord } = props;
  const [distinctPLItemCategories, setDistinctPLItemCategories] = useState<DistinctPLItemCategoriesModel[]>();
  const [isAllInsConfigSaved, setIsAllInsConfigSaved] = useState<boolean>(false);
  const [palletGroupCreated, setPalletGroupCreated] = useState<boolean>(false);


  const user = useAppSelector((state) => state.user.user.user);
  const packageService = new PackingListService();
  const locationService = new LocationAllocationService();
  const wmsInspService = new WMSInspectionConfigService();

  useEffect(() => {
    getDistinctItemCategoriesData();
    isAllInsConfigurationsSaved();
    getPalletGroupInfo();
  }, []);

  const isAllInsConfigurationsSaved = () => {
    wmsInspService.isAllInsConfigurationsSaved(new PackListIdRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, summeryDataRecord.id)).then(res => {
      if (res.status)
        setIsAllInsConfigSaved(true);
      else
        setIsAllInsConfigSaved(false);
    }).catch(err => {
      setIsAllInsConfigSaved(false);
      AlertMessages.getErrorMessage(err.message)
    })
  }
  const getPalletGroupInfo = () => {
    locationService.getPalletGroupInfo(new PackListIdRequest(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId, summeryDataRecord.id)).then(res => {
      if (res.status)
        setPalletGroupCreated(false);
      else
        setPalletGroupCreated(true);
    }).catch(err => {
      setPalletGroupCreated(true);
      AlertMessages.getErrorMessage(err.message)
    })
  }
  const getDistinctItemCategoriesData = () => {
    const req = new PLHeadIdReq(summeryDataRecord.id, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    packageService.getDistinctItemCategoriesData(req)
      .then((res) => {
        if (res.status) {
          setDistinctPLItemCategories(res.data);
        } else {
          setDistinctPLItemCategories([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const createPalletGroupsForPackList = (phId: number) => {
    const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
    locationService.createPalletGroupsForPackList(phIdReq).then((res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    })
  }

  return (
    <ScxCard extra={<><Button type="primary" onClick={() => createPalletGroupsForPackList(summeryDataRecord.id)} disabled={isAllInsConfigSaved ? (palletGroupCreated ? true : false) : true}>Save Pallet Groups</Button></>}>
      {distinctPLItemCategories?.length > 0 && (
        <Tabs
          centered
          defaultActiveKey={'0'}
          items={distinctPLItemCategories.map((itemCat, index) => ({
            key: index.toString(),
            label: itemCat.itemCategory,
            children: <PreferenceForCategory
            isAllInsConfigurationsSaved={isAllInsConfigurationsSaved}
            getPalletGroupInfo={getPalletGroupInfo}
            summeryDataRecord={summeryDataRecord}
             itemCat={itemCat} 
             />
          }))}
        />
      )}
    </ScxCard>
  );
};

export default InspectionPreference;

