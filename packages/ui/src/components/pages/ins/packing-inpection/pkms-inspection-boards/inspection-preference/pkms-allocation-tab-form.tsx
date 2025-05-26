import { SaveOutlined } from "@ant-design/icons";
import { PackingListSummaryModel, InsInspectionLevelEnum, PackingListInfoModel, PhBatchLotRollRequest, RollSelectionTypeEnum, PKMSInspectionCreateRequest, PKMSInspReqStatusModel, PKMSInspectionLevelEnum, PackFabricInspectionRequestCategoryEnum, PackListIdRequest } from "@xpparel/shared-models";
import { PackingListService, InsService, FGLocationAllocationService } from "@xpparel/shared-services";
import { Select, Affix } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxForm, ScxRow, ScxColumn, ScxButton } from "packages/ui/src/schemax-component-lib";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { AllocationBatchTableModel, PKMSAllocationBatchTable } from "./pkms-allocation-batch-table-comp";

 

const { Option } = Select;
interface IAllocationTabFormProps {
  summeryDataRecord: PackingListSummaryModel;
  setInspectionPickSaveFlag: Dispatch<SetStateAction<boolean>>;
  inspectionPickSaveFlag: boolean;
}
interface RouteMapObj {
  top: { startIndex: number, endIndex: number }
  bottom: { startIndex: number, endIndex: number }
}

export const PKMSAllocationTabForm = (props: IAllocationTabFormProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { summeryDataRecord, inspectionPickSaveFlag, setInspectionPickSaveFlag } = props;
  const [selectedAllocation, setSelectedAllocation] = useState(InsInspectionLevelEnum.BATCH);
  const [packListData, setPackListData] = useState<PackingListInfoModel>();
  const [selectableInsRollsCount, setSelectableInsRollsCount] = useState<Map<string, number>>(new Map<string, number>());
  const [selectedInsRolls, setSelectedInsRolls] = useState<Map<string, number[]>>(new Map<string, number[]>());
  const [batchRolls, setBatchRolls] = useState<Map<string, AllocationBatchTableModel[]>>(new Map<string, AllocationBatchTableModel[]>());
  const [formRef] = ScxForm.useForm();
  const packageService = new PackingListService();
  const inspectionService = new InsService();
  const locationService = new FGLocationAllocationService();

  useEffect(() => {
    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, undefined, undefined, undefined, summeryDataRecord.supplierCode,undefined);
    getPackListNumber(req);
  }, []);


  const getPackListNumber = (req: PhBatchLotRollRequest, showErrorMsg: boolean = false) => {
    packageService.getPackListInfo(req).then((res) => {
      if (res.status) {
        setPackListData(res.data[0]);
        setSystemSelectedInsBatchRolls(res.data[0]);
      } else {
        if (showErrorMsg) {
          AlertMessages.getErrorMessage(res.errorCode + " - " + res.internalMessage)
        }
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message);
    });
  };

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
    data.batchInfo?.forEach((batchInfo) => {
      const totalRolls: AllocationBatchTableModel[] = [];
      const savedInsRolls: number[] = [];
      batchInfo.lotInfo?.forEach((lot) => {
        lot.rollInfo.forEach((roll) => {
          if (roll.pickForInspection) {
            if (!isInspectionPickAlreadySaved) {
              isInspectionPickAlreadySaved = true;
            }
            savedInsRolls.push(roll.id);
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
      const insRollLength = Math.ceil((Number(data.rollsPickPercentage) / 100) * sum);
      selectableInsRollsCountLocal.set(batchInfo.batchNumber, insRollLength);
      setSelectableInsRollsCount(selectableInsRollsCountLocal);
      if (!isInspectionPickAlreadySaved) {
        if (data.rollSelectionType === RollSelectionTypeEnum.SYSTEMATIC) {
          const sortedRolls = totalRolls.sort((a, b) => Number(a.rollNumber) - Number(b.supplierQuantity));
          selectedInsRollsLocal.set(batchInfo.batchNumber, getSelectedRolls(sortedRolls, insRollLength));
          setSelectedInsRolls(selectedInsRollsLocal);
        }
      } else {
        selectedInsRollsLocal.set(batchInfo.batchNumber, savedInsRolls);
        setSelectedInsRolls(selectedInsRollsLocal);
      }
    });
    setInspectionPickSaveFlag(isInspectionPickAlreadySaved);
  }

  const constructArrayFromRange = (start: number, end: number): number[] => {
    if (start > end) {
      throw new Error("Start number should be less than or equal to the end number.");
    }

    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  const getSelectedRolls = (rollList: AllocationBatchTableModel[], requiredQuantity: number) => {
    const selectedRolls = [];
    let quantity = 0;
    const routeMap = new Map<number, RouteMapObj>();
    let medianIndex = Math.floor(rollList.length / 2);
    routeMap.set(rollList[medianIndex].rollNumber, {
      top: {  startIndex: 0, endIndex: medianIndex - 1 },
      bottom: {  startIndex: medianIndex + 1, endIndex: rollList.length },
    })
    if (requiredQuantity >= quantity) {
      quantity += Number(rollList[medianIndex].supplierQuantity);
      selectedRolls.push(rollList[medianIndex].rollNumber);
    }
    if (requiredQuantity <= quantity) {
      return selectedRolls;
    } else {
      for (const [key, val] of routeMap.entries()) {
          const topArray = constructArrayFromRange(val.top.startIndex, val.top.endIndex);
          const topMidIndex = Math.floor(topArray.length / 2);
          const topMedianIndex = topArray[topMidIndex];
          routeMap.set(rollList[topMedianIndex].rollNumber, {
            top: { startIndex: topArray[0], endIndex: topMedianIndex-1 },
            bottom: { startIndex: topMedianIndex + 1, endIndex: topArray[topArray.length-1] },
          })
          if (requiredQuantity >= quantity) {
            quantity += Number(rollList[topMedianIndex].supplierQuantity);
            selectedRolls.push(rollList[topMedianIndex].rollNumber);
          }

          const bottomArray = constructArrayFromRange(val.bottom.startIndex, val.bottom.endIndex);
          const bottomMidIndex = Math.floor(bottomArray.length / 2);
          const bottomMedianIndex = bottomArray[bottomMidIndex];
          routeMap.set(rollList[bottomMedianIndex].rollNumber, {
            top: { startIndex: bottomArray[0], endIndex: bottomMedianIndex-1 },
            bottom: { startIndex: bottomMedianIndex + 1, endIndex: bottomArray[bottomArray.length-1] },
          })
          if (requiredQuantity >= quantity) {
            quantity += Number(rollList[bottomMedianIndex].supplierQuantity);
            selectedRolls.push(rollList[bottomMedianIndex].rollNumber);
          }
        
        if (requiredQuantity <= quantity) {
          break;
        }
      }
      return selectedRolls;
    }
  }

const handleSave = () => {
  if (selectedInsRolls.size === 0) {
    AlertMessages.getErrorMessage(`No rolls selected`);
    return;
  }

  let inSufficientInfo = false;
  const requests: PKMSInspectionCreateRequest [] = [];
  const lotLevelSelectedRolls: Map<string, number[]> = new Map();
  const preInspectionDetailsMap: Map<string, PKMSInspReqStatusModel[]> = new Map();
  const lotQtyMap: Map<string, number> = new Map();
  const batchQtyMap: Map<string, number> = new Map();
  const lotBatchMap: Map<string, string> = new Map();

  for (const [batch, totalRolls] of selectableInsRollsCount.entries()) {
    let selectedRollLength = 0;
    // Required insRollLength (supplier quantity)
    const requiredRollLength = selectableInsRollsCount.get(batch); 

    // Iterate over all rolls in the batch and check if the roll is selected
    for (const roll of batchRolls.get(batch)) {
      if (!batchQtyMap.has(roll.batchNumber)) {
        batchQtyMap.set(roll.lotNumber, Number(roll.supplierQuantity));
      } else {
        let batchQty = batchQtyMap.get(roll.lotNumber) + Number(roll.supplierQuantity);
        batchQtyMap.set(roll.lotNumber, batchQty);
      }

      if (selectedInsRolls.get(batch).includes(roll.id)) {
        // Carton is selected, add its supplierQuantity to selectedRollLength
        selectedRollLength += Number(roll.supplierQuantity);

        if (!lotLevelSelectedRolls.has(roll.lotNumber)) {
          lotLevelSelectedRolls.set(roll.lotNumber, [roll.id]);
          preInspectionDetailsMap.set(roll.lotNumber, roll.inspectionDetails as any);
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
      inSufficientInfo = true;
      const diff = requiredRollLength - selectedRollLength;
      AlertMessages.getErrorMessage(`Please select additional ${diff} rolls (supplier quantity) from batch: ${batch}`);
      break;
    }
  }

  if (inSufficientInfo) {
    return;
  }
  for (const [lot, rolls] of lotLevelSelectedRolls.entries()) {
    const request: PKMSInspectionCreateRequest  = new PKMSInspectionCreateRequest (user?.userName,user?.orgData?.unitCode,user?.orgData?.companyCode,user?.userId,summeryDataRecord.id,lot,PKMSInspectionLevelEnum.LOT,lot,rolls,PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION,0,preInspectionDetailsMap.get(lot),lotQtyMap.get(lot),batchQtyMap.get(lotBatchMap.get(lot))
    );
    requests.push(request);
  }

  inspectionService.inspectionConfirm(undefined).then((res) => {
    if (res.status) {
      createPalletGroupsForPackList(summeryDataRecord.id);
      AlertMessages.getSuccessMessage(res.internalMessage);
    } else {
      AlertMessages.getErrorMessage(res.internalMessage);
    }
  }).catch((err) => {
    AlertMessages.getErrorMessage(err.message);
  });
};


  const createPalletGroupsForPackList = (phId: number) => {
    const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
    locationService.createContainerGroupsForPackList(phIdReq).then((res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, summeryDataRecord.id, undefined, undefined, undefined, summeryDataRecord.supplierCode,undefined);
        getPackListNumber(req);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    })
  }

  return (
    <div>
      <ScxForm form={formRef} autoComplete="off" initialValues={{ insRollSelectionBase: InsInspectionLevelEnum.BATCH }}>
        <ScxRow gutter={16}>
          <ScxColumn xs={24} sm={16} md={16} lg={16} xl={16} xxl={16} />
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
      {selectedAllocation === InsInspectionLevelEnum.BATCH && <PKMSAllocationBatchTable packListData={packListData} selectableInsRollsCount={selectableInsRollsCount} selectedInsRolls={selectedInsRolls} batchRolls={batchRolls} setSelectedInsRolls={setSelectedInsRolls} />}
      <Affix offsetBottom={0}>
        <ScxRow style={{ background: 'none' }} justify='space-between'>
          <ScxColumn xs={24} sm={22} md={22} lg={22} xl={22} xxl={22} />
          <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
            <ScxButton type="primary" onClick={handleSave} icon={<SaveOutlined />} style={{ width: '100%' }} disabled={inspectionPickSaveFlag}>
              Save
            </ScxButton>
          </ScxColumn>
        </ScxRow>
      </Affix>
    </div>
  );
};

