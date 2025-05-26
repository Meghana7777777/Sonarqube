import { SaveOutlined } from '@ant-design/icons';
import { InsConfigFabValModel, InsConfigItemsModel, InsFabInsConfigRequest, InsFabricInspectionRequestCategoryEnum, InsInspReqStatusModel, InsInspectionCreateRequest, InsInspectionLevelEnum, InsInspectionRollSelectionTypeEnum, InsTypesEnumType, PackListIdRequest, PackingListInfoModel, PackingListSummaryModel, PhBatchLotRollRequest, PhItemCategoryEnum, RollIdsRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { InspectionConfigService, InsService, LocationAllocationService, PackingListService, WMSInspectionConfigService } from '@xpparel/shared-services';
import { Affix, Button, Input, Select } from 'antd';
import { ScxButton, ScxColumn, ScxForm, ScxRow } from 'packages/ui/src/schemax-component-lib';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from "../../../../common";
import { AlertMessages } from '../../../common';
import { AllocationBatchTable, AllocationBatchTableModel } from './allocation-batch-table-comp';
import { InspectionFabItem } from './inspection-preference';

const { Option } = Select;
interface IAllocationTabFormProps {
  summeryDataRecord: PackingListSummaryModel;
  inspectionPickSaveFlag: boolean;
  fabItemData: InspectionFabItem;
  pickPercentage: number;
  packListData: PackingListInfoModel;
  insSelectionType: InsInspectionRollSelectionTypeEnum;
  insConfigItems: InsConfigItemsModel[];
  insTypeForSuggestion: InsTypesEnumType;
  insType: InsTypesEnumType
  getInsConfigData: () => Promise<void>
  itemCategory: PhItemCategoryEnum;
  getPalletGroupInfo: () => void;
  isAllInsConfigurationsSaved: () => void
}
interface RouteMapObj {
  top: { startIndex: number, endIndex: number }
  bottom: { startIndex: number, endIndex: number }
}

export const AllocationTabForm = (props: IAllocationTabFormProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { summeryDataRecord, inspectionPickSaveFlag, pickPercentage, packListData, insSelectionType, insConfigItems, insType, insTypeForSuggestion, fabItemData, getInsConfigData, itemCategory, getPalletGroupInfo, isAllInsConfigurationsSaved } = props;
  const [selectedAllocation, setSelectedAllocation] = useState(InsInspectionLevelEnum.BATCH);
  const [selectableInsRollsCount, setSelectableInsRollsCount] = useState<Map<string, number>>(new Map<string, number>());
  const [selectedInsRolls, setSelectedInsRolls] = useState<Map<string, number[]>>(new Map<string, number[]>());
  const [batchRolls, setBatchRolls] = useState<Map<string, AllocationBatchTableModel[]>>(new Map<string, AllocationBatchTableModel[]>());
  const [selectedRollIds, setsSelectedRollIds] = useState<number[]>([]);

  const [formRef] = ScxForm.useForm();
  const packingListService = new PackingListService();
  const service = new InspectionConfigService();
  const wmsInspService = new WMSInspectionConfigService();

  useEffect(() => {
    setsSelectedRollIds(insConfigItems.map(rec => Number(rec.refId)))
  }, [insConfigItems]);

  useEffect(() => {
    setSystemSelectedInsBatchRolls(packListData);
  }, [packListData, selectedRollIds]);



  const handleAllocationChange = (value) => {
    setSelectedAllocation(value);
  };

  const refreshButtonHandler = () => {
    formRef.validateFields().then((values) => {
      if (InsInspectionLevelEnum.BATCH === values.insRollSelectionBase) {
        setSystemSelectedInsBatchRolls();
      }
    }).catch(err => {
      console.log(err);
    })
  };
  const getRandomIntegersInRange = (insRollsCount: number, fromIndex: number, toIndex: number) => {
    // const result = [];
    // for (let i = 0; i < insRollsCount; i++) {
    //   const randomInt = Math.floor(Math.random() * (toIndex - fromIndex + 1)) + fromIndex;
    //   result.push(randomInt);
    // }
    // return result;
    if (insRollsCount > (toIndex - fromIndex + 1)) {
      throw new Error('Cannot generate unique numbers. Range is smaller than the required count.');
    }
    const result = new Set<number>();
    while (result.size < insRollsCount) {
      const randomInt = Math.floor(Math.random() * (toIndex - fromIndex + 1)) + fromIndex;
      result.add(randomInt);
    }

    return Array.from(result);
  };

  const setSystemSelectedInsBatchRolls = (packListDataLocal?: PackingListInfoModel) => {
    let data = packListDataLocal ? packListDataLocal : packListData;
    const batchRollsLocal = new Map(batchRolls);
    const selectableInsRollsCountLocal = new Map<string, number>(selectableInsRollsCount);
    const selectedInsRollsLocal = new Map();
    let isInspectionPickAlreadySaved = false;
    data?.batchInfo?.forEach((batchInfo) => {
      const totalRolls: AllocationBatchTableModel[] = [];
      const savedInsRolls: number[] = [];
      batchInfo.lotInfo?.forEach((lot) => {
        lot.rollInfo.forEach((roll) => {
          if (selectedRollIds.includes(Number(roll.id))) {
            if (!isInspectionPickAlreadySaved) {
              isInspectionPickAlreadySaved = true;
            }
            savedInsRolls.push(Number(roll.id));
          }
          const obj: AllocationBatchTableModel = {
            ...roll,
            supplierCode: data.supplierCode,
            phId: data.id,
            inspectionDetails: lot.inspectionDetails
          }
          totalRolls.push(obj);
        });
      });
      batchRollsLocal.set(batchInfo.batchNumber, totalRolls);
      setBatchRolls(batchRollsLocal);
      const sum = totalRolls.reduce((acc, roll) => acc + Number(roll.supplierQuantity || 0), 0)
      const insRollLength = Math.ceil((Number(pickPercentage) / 100) * sum);
      selectableInsRollsCountLocal.set(batchInfo.batchNumber, insRollLength);
      setSelectableInsRollsCount(selectableInsRollsCountLocal);
      if (!isInspectionPickAlreadySaved) {
        if (insSelectionType === InsInspectionRollSelectionTypeEnum.SYSTEMATIC) {
          const sortedRolls = totalRolls.sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));
          selectedInsRollsLocal.set(batchInfo.batchNumber, getSelectedRolls(sortedRolls, insRollLength));
          setSelectedInsRolls(selectedInsRollsLocal);
        }
      } else {
        selectedInsRollsLocal.set(batchInfo.batchNumber, savedInsRolls);
        setSelectedInsRolls(selectedInsRollsLocal);
      }
    });
  }

  const constructArrayFromRange = (start: number, end: number): number[] => {
    if (start > end) {
      return [];
      // throw new Error("Start number should be less than or equal to the end number.");
    }

    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  const getSelectedRolls = (rollList: AllocationBatchTableModel[], requiredQuantity: number) => {
    console.log(rollList);
    console.log(requiredQuantity);


    if (rollList.length === 1) {
      return requiredQuantity > 0 ? [rollList[0].rollNumber] : [];
    }

    const selectedRolls = [];
    let quantity = 0;
    const routeMap = new Map<number, RouteMapObj>();

    // Find median index
    let medianIndex = Math.floor(rollList.length / 2);

    routeMap.set(rollList[medianIndex].rollNumber, {
      top: { startIndex: 0, endIndex: medianIndex - 1 },
      bottom: { startIndex: medianIndex + 1, endIndex: rollList.length - 1 }, // Fix endIndex
    });

    if (requiredQuantity >= quantity) {
      quantity += Number(rollList[medianIndex].supplierQuantity);
      selectedRolls.push(rollList[medianIndex].rollNumber);
    }

    if (requiredQuantity <= quantity) {
      return selectedRolls;
    }

    for (const [key, val] of routeMap.entries()) {
      const topArray = constructArrayFromRange(val.top.startIndex, val.top.endIndex);
      if (topArray.length > 0) {
        const topMidIndex = Math.floor(topArray.length / 2);
        const topMedianIndex = topArray[topMidIndex];

        if (rollList[topMedianIndex]) {
          routeMap.set(rollList[topMedianIndex].rollNumber, {
            top: { startIndex: topArray[0], endIndex: topMedianIndex - 1 },
            bottom: { startIndex: topMedianIndex + 1, endIndex: topArray[topArray.length - 1] },
          });

          if (requiredQuantity >= quantity) {
            quantity += Number(rollList[topMedianIndex].supplierQuantity);
            selectedRolls.push(rollList[topMedianIndex].rollNumber);
          }
        }
      }

      const bottomArray = constructArrayFromRange(val.bottom.startIndex, val.bottom.endIndex);
      if (bottomArray.length > 0) {
        const bottomMidIndex = Math.floor(bottomArray.length / 2);
        const bottomMedianIndex = bottomArray[bottomMidIndex];

        if (rollList[bottomMedianIndex]) {
          routeMap.set(rollList[bottomMedianIndex].rollNumber, {
            top: { startIndex: bottomArray[0], endIndex: bottomMedianIndex - 1 },
            bottom: { startIndex: bottomMedianIndex + 1, endIndex: bottomArray[bottomArray.length - 1] },
          });

          if (requiredQuantity >= quantity) {
            quantity += Number(rollList[bottomMedianIndex].supplierQuantity);
            selectedRolls.push(rollList[bottomMedianIndex].rollNumber);
          }
        }
      }

      if (requiredQuantity <= quantity) {
        break;
      }
    }

    return selectedRolls;
  };


  const handleSave = () => {
    if (selectedInsRolls.size === 0) {
      AlertMessages.getErrorMessage(`No rolls selected`);
      return;
    }
    let inSufficientInfo = false;
    const lotLevelSelectedRolls: Map<string, number[]> = new Map();
    const preInspectionDetailsMap: Map<string, InsInspReqStatusModel[]> = new Map();
    const lotQtyMap: Map<string, number> = new Map();
    const batchQtyMap: Map<string, number> = new Map();
    const lotBatchMap: Map<string, string> = new Map();
    const rollIDtoDataMap: Map<number, AllocationBatchTableModel> = new Map();
    for (const [batch, totalRolls] of selectableInsRollsCount.entries()) {
      if (!(selectedInsRolls.get(batch) && selectedInsRolls.get(batch).length)) {
        AlertMessages.getErrorMessage(`No Rolls Selected ${batch}`);
        return;
      }

      let selectedRollLength = 0;
      // Required insRollLength (supplier quantity)
      const requiredRollLength = selectableInsRollsCount.get(batch);

      // Iterate over all rolls in the batch and check if the roll is selected
      for (const roll of batchRolls.get(batch)) {
        rollIDtoDataMap.set(roll.id, roll)
        if (!batchQtyMap.has(roll.batchNumber)) {
          batchQtyMap.set(roll.lotNumber, Number(roll.supplierQuantity));
        } else {
          let batchQty = batchQtyMap.get(roll.lotNumber) + Number(roll.supplierQuantity);
          batchQtyMap.set(roll.lotNumber, batchQty);
        }

        if (selectedInsRolls.get(batch).includes(roll.id)) {
          // Roll is selected, add its supplierQuantity to selectedRollLength
          selectedRollLength += Number(roll.supplierQuantity);

          if (!lotLevelSelectedRolls.has(roll.lotNumber)) {
            lotLevelSelectedRolls.set(roll.lotNumber, [roll.id]);
            preInspectionDetailsMap.set(roll.lotNumber, roll.inspectionDetails);
            lotQtyMap.set(roll.lotNumber, Number(roll.supplierQuantity));
            lotBatchMap.set(roll.lotNumber, roll.batchNumber);
          } else {
            lotLevelSelectedRolls.get(roll.lotNumber).push(roll.id);
            let lotQty = lotQtyMap.get(roll.lotNumber) + Number(roll.supplierQuantity);
            lotQtyMap.set(roll.lotNumber, lotQty);
          }
        }
      }
      if (selectedRollLength <= requiredRollLength) {
        if (requiredRollLength - selectedRollLength > 0) {
          inSufficientInfo = true;
          const diff = requiredRollLength - selectedRollLength;
          AlertMessages.getErrorMessage(`Please select additional ${diff} rolls (supplier quantity) from batch: ${batch}`);
          break;
        }
      }
    }

    if (inSufficientInfo) {
      return;
    }
    const insRolls = []
    for (const [lot, rolls] of lotLevelSelectedRolls.entries()) {
      insRolls.push(...rolls);
    }
    const fabInsData = new InsConfigFabValModel(fabItemData.id, fabItemData.insType, fabItemData.perc, fabItemData.materialReady, fabItemData.selected, undefined, undefined, fabItemData.insSelectionType,
      insRolls.map(rec => new InsConfigItemsModel(rec, rollIDtoDataMap.get(rec).barcode)), summeryDataRecord.id, itemCategory
    )

    const req = new InsFabInsConfigRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.supplierCode, [fabInsData], summeryDataRecord.id, undefined);
    wmsInspService.saveFabInsConfigPLLevel(req).then(res => {
      if (res.status) {
        getInsConfigData();
        isAllInsConfigurationsSaved();
        getPalletGroupInfo();
        if (insTypeForSuggestion === insType) {
          const reqModel = new RollIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, insRolls);
          packingListService.updatePickInspectionStatusForRollId(reqModel).then((childRes) => {
            if (childRes.status) {
              AlertMessages.getSuccessMessage(childRes.internalMessage);
            } else {
              AlertMessages.getErrorMessage(childRes.internalMessage);
            }
          }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
          });
        };
        AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
      console.log(err)
    })



  };




  return (
    <div>
      <ScxForm form={formRef} autoComplete="off" initialValues={{ insRollSelectionBase: InsInspectionLevelEnum.BATCH, insSelectionType, pickPercentage }}>
        <ScxRow gutter={16}>
          <ScxColumn xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
            <ScxRow gutter={16}>
              <ScxColumn xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
                <ScxForm.Item name="pickPercentage" >
                  <Input disabled defaultValue={pickPercentage} />
                </ScxForm.Item>
              </ScxColumn>
              <ScxColumn xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
                <ScxForm.Item name="insSelectionType" >
                  <Input disabled defaultValue={insSelectionType} />
                </ScxForm.Item>
              </ScxColumn>
            </ScxRow>
          </ScxColumn>
          <ScxColumn xs={24} sm={5} md={5} lg={5} xl={5} xxl={5}>
            <ScxForm.Item name="insRollSelectionBase">
              <Select onChange={handleAllocationChange} value={selectedAllocation} defaultValue={InsInspectionLevelEnum.BATCH} disabled>
                {Object.keys(InsInspectionLevelEnum).map((key) => (
                  <Option value={InsInspectionLevelEnum[key]} key={key}>
                    {InsInspectionLevelEnum[key]}
                  </Option>
                ))}
              </Select>
            </ScxForm.Item>
          </ScxColumn>
          <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
            <ScxForm.Item>
              <ScxButton type="primary" onClick={refreshButtonHandler} disabled={inspectionPickSaveFlag}>
                Refresh
              </ScxButton>
            </ScxForm.Item>
          </ScxColumn>
        </ScxRow>
      </ScxForm>
      {selectedAllocation === InsInspectionLevelEnum.BATCH &&
        <AllocationBatchTable packListData={packListData}
          selectableInsRollsCount={selectableInsRollsCount}
          selectedInsRolls={selectedInsRolls}
          batchRolls={batchRolls}
          setSelectedInsRolls={setSelectedInsRolls}
          insSelectionType={insSelectionType}
        />}
      <Affix offsetBottom={0}>
        {/* <ScxRow style={{ background: 'none' }} justify='space-between'>
          <ScxColumn xs={24} sm={22} md={22} lg={22} xl={22} xxl={22} />
          <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
            <ScxButton
              type="primary"
              onClick={handleSave}
              icon={<SaveOutlined />}
              style={{ width: '100%' }}
              disabled={insConfigItems.length != 0}
            >
              Save
            </ScxButton>
          </ScxColumn>
        </ScxRow> */}

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%', marginTop: '10px' }}>
          <Button type="primary" onClick={handleSave} icon={<SaveOutlined />} style={{ width: 120 }} disabled={insConfigItems.length !== 0}>Save</Button>
        </div>
      </Affix>
    </div>
  );
}
