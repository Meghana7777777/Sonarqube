
import {
  CartonDataForEachPl,
  FGItemCategoryEnum,
  InsBuyerCodeRequest,
  InsConfigItemsModel,
  InsFgInsConfigModel,
  InsInspectionRollSelectionTypeEnum,
  InsTypesEnumType,
  PhItemCategoryEnum,
  PoIdRequest
} from '@xpparel/shared-models';

import { PercentageOutlined } from '@ant-design/icons';
import { InspectionConfigService, PKMSInspectionConfigService, PackListViewServices } from '@xpparel/shared-services';
import { Collapse, CollapseProps, FormInstance, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { ScxCard } from '../../../../schemax-component-lib';
import { AlertMessages } from '../../../common';
import InspectionBySelection from './inspection-by-selection';
import FGInspectionConfigPKMS from './pkms-fg-config';
// import { AllocationTabForm } from './allocation-tab-form';





export interface InspectionFabItem {
  id: number
  key: string;
  label: string;
  selected: boolean;
  perc: number;
  materialReady: boolean;
  insType: InsTypesEnumType;
  insSelectionType: InsInspectionRollSelectionTypeEnum;
  insConfigItems: InsConfigItemsModel[];
}


export interface InspectionItem {
  key: string;
  label: string;
  selected: boolean;
  perc: number | "";
  materialReady: boolean;
  insType: InsTypesEnumType,
  insSelectionType: InsInspectionRollSelectionTypeEnum;
  itemCategory: PhItemCategoryEnum | FGItemCategoryEnum,
  isCreatedInSelfModule: boolean,
  insConfigItems: InsConfigItemsModel[];

}

export interface InspectionPreferenceProps {
  packOrder: String;
  formRef: FormInstance<any>
}

export const InspectionPreference = (props: InspectionPreferenceProps) => {
  const { packOrder, formRef } = props;
  const [fgData, setFgData] = useState<InspectionItem[]>([]);
  const [selectedInspectionsData, setSelectedInspectionsData] = useState<InspectionItem[]>([]);
  const [selectedTabLabel, setSelectedTabLabel] = useState<string>('');
  const [inspectionTabs, setInspectionTabs] = useState<string>(selectedInspectionsData[0]?.insType);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const service = new InspectionConfigService();
  const packListViewServices = new PackListViewServices();
  const pkmsInspectionConfigService = new PKMSInspectionConfigService()
  const [cartonData, setCartonData] = useState<CartonDataForEachPl[]>([]);
  const [inspectionPercentage, setInspectionPercentage] = useState<number>(0)

  useEffect(() => {
    if (packOrder) {
      getInsConfigData();
      getCartonDataForInspection();
    }
  }, [packOrder]);


  const getInsConfigData = async () => {
    try {
      const req = new InsBuyerCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, formRef.getFieldValue('customerName'), undefined, FGItemCategoryEnum.FG);
      const res = await pkmsInspectionConfigService.getFgInsConfigPLLevel(req);
      if (res.status) {
        setDefaultInsTypeForSuggestion(res.data[0])
        const data = transform(res.data);
        setSelectedInspectionsData(data.filter(item => item.selected = true));
        setInspectionPercentage(Number(data[0].perc))
        getCartonDataForInspection();
        setFgData(data);
      } else {
        setFgData([]);
        transform([]);
        setSelectedInspectionsData([]);
      }
    } catch (error) {
      console.log(error)
    }

  }

  const transform = (data: InsFgInsConfigModel[]): InspectionItem[] => {
    return data[0]?.insConfigs?.map(item => ({
      key: item.insType,
      label: item.insType,
      selected: item.selected,
      perc: item.pickPerc,
      materialReady: item.requiredForMaterialReady,
      insType: item.insType,
      insSelectionType: item.insSelectionType,
      itemCategory: item.itemCategory,
      isCreatedInSelfModule: item.isCreatedInSelfModule,
      insConfigItems: item.insConfigItems,
    }))
  }





  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'PackList Level Configurations',
      children: <FGInspectionConfigPKMS data={fgData} formRef={formRef} getInsConfigData={getInsConfigData} />
    },
  ]

  const setDefaultInsTypeForSuggestion = (data: InsFgInsConfigModel) => {
    // if (data.plRefId) {
    //   const selectedInsTypes = data.insConfigs.map(rec => rec.insType);
    //   if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.INSPECTION)) {
    //     setInsTypeForSuggestion(InsFabricInspectionRequestCategoryEnum.INSPECTION);
    //   } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION)) {
    //     setInsTypeForSuggestion(InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION);
    //   } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION)) {
    //     setInsTypeForSuggestion(InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION);
    //   } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.SHRINKAGE)) {
    //     setInsTypeForSuggestion(InsFabricInspectionRequestCategoryEnum.SHRINKAGE);
    //   } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.RELAXATION)) {
    //     setInsTypeForSuggestion(InsFabricInspectionRequestCategoryEnum.RELAXATION);
    //   }
    // }
  };




  const getCartonDataForInspection = () => {
    const req = new PoIdRequest(Number(packOrder), userName, orgData.unitCode, orgData.companyCode, userId)
    packListViewServices.getCartonDataForInspection(req).then((res) => {
      if (res.status) {
        setCartonData(res.data);
      } else {
        setCartonData([])
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    })
      .catch(err => {
        console.log(err)
      })
  }



  return (
    <ScxCard>
      <Tabs
        centered
        defaultActiveKey={'1'}
        onChange={(activeKey) => {
          getInsConfigData()
          if (activeKey === '1') {
            setSelectedTabLabel(null);
          } else {
            setSelectedTabLabel(activeKey);
          }
        }}
        items={[
          {
            key: '1',
            label: 'Preference',
            children: <Collapse defaultActiveKey={['1']} items={items} />,
          },
          {
            key: '2',
            label: 'Selection Criteria',
            disabled: fgData.some((rec) => !rec.isCreatedInSelfModule),
            children: (
              <Tabs
                defaultActiveKey={selectedInspectionsData[0]?.insType}
                activeKey={inspectionTabs}
                tabBarExtraContent={<>Percentage: <Tag color='magenta'>{inspectionPercentage}{<PercentageOutlined />}</Tag></>}
                onChange={(activeKey) => {
                  setInspectionTabs(activeKey);
                  getCartonDataForInspection();
                  const activeKeyRecord = selectedInspectionsData.find((rec) => rec.insType === activeKey);
                  setInspectionPercentage(Number(activeKeyRecord.perc))
                }

                }
                items={
                  selectedInspectionsData.map((rec) => ({
                    key: rec.insType,
                    label: rec.insType,

                    children: <InspectionBySelection
                      inspectionData={rec}
                      poID={Number(packOrder)}
                      cartonData={cartonData}
                      formRef={formRef}
                      insConfigItems={rec.insConfigItems}
                    />

                  }))
                }
              />
            ),
          },
        ]}
      />
    </ScxCard>
  );
};

export default InspectionPreference;

