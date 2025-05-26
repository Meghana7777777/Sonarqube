import { AllInspectionDisplayValues, DistinctPLItemCategoriesModel, InsFabInsConfigModel, InsFabricInspectionRequestCategoryEnum, InsSupplierCodeRequest, InsTypesEnum, InsTypesEnumType, PackingListInfoModel, PackingListSummaryModel, PackListIdRequest, PhBatchLotRollRequest, PhItemCategoryEnum, SystemPreferenceModel, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";
import { GrnServices, LocationAllocationService, PackingListService, WMSInspectionConfigService } from "@xpparel/shared-services";
import { Button, Collapse, CollapseProps, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../../../common';
import { AllocationTabForm } from "./allocation-tab-form";
import FABInspectionConfigWMS from "./fabric-config";
import { InspectionFabItem } from "./inspection-preference";
import { AlertMessages } from "../../../common";


interface IPreferenceForCategoryProps {
    summeryDataRecord: PackingListSummaryModel;
    itemCat: DistinctPLItemCategoriesModel;
    getPalletGroupInfo?: () => void;
    isAllInsConfigurationsSaved?: () => void
}
export const PreferenceForCategory = (props: IPreferenceForCategoryProps) => {
    const { summeryDataRecord, itemCat, getPalletGroupInfo, isAllInsConfigurationsSaved } = props;
    const [packListData, setPackListData] = useState<PackingListInfoModel>();
    const [fabricData, setFabricData] = useState<InspectionFabItem[]>([]);
    const [data, setData] = useState<InsFabInsConfigModel[]>([]);
    const [selectedInspectionsData, setSelectedInspectionsData] = useState<InspectionFabItem[]>([]);
    const [insTypeForSuggestion, setInsTypeForSuggestion] = useState<InsTypesEnumType>(undefined);


    const user = useAppSelector((state) => state.user.user.user);

    const wmsInspService = new WMSInspectionConfigService();
    const packageService = new PackingListService();

    useEffect(() => {
        getInsConfigData();
        const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, undefined, undefined, undefined, summeryDataRecord.supplierCode, itemCat.itemCategory);
        getPackListData(req);
    }, []);

    const getPackListData = (req: PhBatchLotRollRequest, showErrorMsg: boolean = false) => {
        packageService.getPackListInfo(req).then((res) => {
            if (res.status) {
                setPackListData(res.data[0]);
            } else {
                if (showErrorMsg) {
                    AlertMessages.getErrorMessage(res.errorCode + " - " + res.internalMessage)
                }
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    };



    const setDefaultInsTypeForSuggestion = (selectedInsTypes: InsTypesEnumType[]) => {
        let insTypeForSuggestion: InsTypesEnumType = undefined;
        if (itemCat.itemCategory === PhItemCategoryEnum.FABRIC) {
            if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.INSPECTION)) {
                insTypeForSuggestion = InsFabricInspectionRequestCategoryEnum.INSPECTION;
            } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION)) {
                insTypeForSuggestion = InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION;
            } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION)) {
                insTypeForSuggestion = InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION;
            } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.SHRINKAGE)) {
                insTypeForSuggestion = InsFabricInspectionRequestCategoryEnum.SHRINKAGE;
            } else if (selectedInsTypes.includes(InsFabricInspectionRequestCategoryEnum.RELAXATION)) {
                insTypeForSuggestion = InsFabricInspectionRequestCategoryEnum.RELAXATION;
            }
        }
        if (itemCat.itemCategory === PhItemCategoryEnum.THREAD) {
            if (selectedInsTypes.includes(ThreadTypeEnum.THREADINS)) {
                insTypeForSuggestion = ThreadTypeEnum.THREADINS;
            }
        }
        if (itemCat.itemCategory === PhItemCategoryEnum.TRIM) {
            if (selectedInsTypes.includes(TrimTypeEnum.TRIMINS)) {
                insTypeForSuggestion = TrimTypeEnum.TRIMINS;
            }
        }

        if (itemCat.itemCategory === PhItemCategoryEnum.YARN) {
            if (selectedInsTypes.includes(YarnTypeEnum.YARNINS)) {
                insTypeForSuggestion = YarnTypeEnum.YARNINS;
            }
        }
        return insTypeForSuggestion
    }



    const getInsConfigData = async () => {
        try {
            const req = new InsSupplierCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.supplierCode, summeryDataRecord.id, itemCat.itemCategory);
            const res = await wmsInspService.getFabInsConfigPLLevel(req);
            if (res.status) {
                setData(res.data);
                if (res.data[0].plRefId) {
                    const selectedInsTypes = res.data[0].insConfigs.map(rec => rec.insType);
                    setInsTypeForSuggestion(setDefaultInsTypeForSuggestion(selectedInsTypes));
                }
                const data = transform(res.data);
                setSelectedInspectionsData(data.filter(item => item.selected === true));
                setFabricData(data);
            } else {
                setFabricData([]);
            }
        } catch (error) {
            console.log(error)
        }

    }

    const transform = (data: InsFabInsConfigModel[]): InspectionFabItem[] => {
        return data[0].insConfigs.map(item => ({
            id: item.id,
            key: item.insType,
            label: item.insType,
            selected: item.selected,
            perc: item.pickPerc,
            materialReady: item.requiredForMaterialReady,
            insType: item.insType,
            insSelectionType: item.insSelectionType,
            insConfigItems: item.insConfigItems,
            plRefId: summeryDataRecord.id,
            itemCategory: item.itemCategory
        }))
    }



    const getItems = (itemCategory: PhItemCategoryEnum) => {
        const items: CollapseProps['items'] = [
            {
                key: '1',
                label: 'PackList Level Configurations',
                children: <FABInspectionConfigWMS
                    summeryDataRecord={summeryDataRecord}
                    fabricData={fabricData}
                    setFabricData={setFabricData}
                    inspectionPickSaveFlag={!!data[0]?.plRefId}
                    getInsConfigData={getInsConfigData}
                    itemCategory={itemCategory}
                    insTypeForSuggestion={insTypeForSuggestion}
                    setDefaultInsTypeForSuggestion={setDefaultInsTypeForSuggestion}
                />,
            },
        ]
        return items
    }

    return <Tabs centered defaultActiveKey={'1'} items={
        [
            {
                key: '1',
                label: 'Preference',
                children: <Collapse
                    defaultActiveKey={['1']}
                    items={getItems(itemCat.itemCategory)}
                />,
            },
            {
                key: '2',
                label: 'Selection Criteria',
                disabled: !data[0]?.plRefId,
                children:
                    <Tabs defaultActiveKey="1" items={
                        selectedInspectionsData.map(rec => {
                            return {
                                key: rec.insType,
                                label: AllInspectionDisplayValues[rec.insType],
                                children: <AllocationTabForm
                                    summeryDataRecord={summeryDataRecord}
                                    inspectionPickSaveFlag={rec.selected}
                                    pickPercentage={rec.perc}
                                    packListData={packListData}
                                    insSelectionType={rec.insSelectionType}
                                    insConfigItems={rec.insConfigItems}
                                    insTypeForSuggestion={insTypeForSuggestion}
                                    insType={rec.insType}
                                    fabItemData={rec}
                                    getInsConfigData={getInsConfigData}
                                    itemCategory={itemCat.itemCategory}
                                    getPalletGroupInfo={getPalletGroupInfo}
                                    isAllInsConfigurationsSaved={isAllInsConfigurationsSaved}

                                />,
                            }
                        })
                    } />

                ,
            }
        ]
    } />;
};

export default PreferenceForCategory;
