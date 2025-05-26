import { SaveOutlined } from '@ant-design/icons';
import { CartonDataForEachPl, CartonDataModel, FGItemCategoryEnum, InsCartonSelectLevelEnum, InsConfigItemsModel, InsConfigValModel, InsFgInsConfigRequest, InsInspectionRollSelectionTypeEnum, SystematicPreferenceReqModel } from '@xpparel/shared-models';
import { FGLocationAllocationService, FgInspectionCreationService, PKMSInspectionConfigService } from '@xpparel/shared-services';
import { Affix, Button, Col, Form, FormInstance, Row, Select } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import InspectionCartonDetails from './inspection-carton.details';
import { InspectionItem } from './inspection-fg-preference';
interface IProps {
  // setInspectionPickSaveFlag: Dispatch<SetStateAction<boolean>>;
  // inspectionPickSaveFlag: boolean;

  poID: number
  inspectionData: InspectionItem
  cartonData: CartonDataForEachPl[];
  formRef: FormInstance<any>;
  insConfigItems: InsConfigItemsModel[];
}
interface RouteMapObj {
  top: { startIndex: number, endIndex: number }
  bottom: { startIndex: number, endIndex: number }
}
const InspectionBySelection = (props: IProps) => {
  const { poID, cartonData, formRef, inspectionData, insConfigItems } = props;
  const [selectedAllocation, setSelectedAllocation] = useState(InsCartonSelectLevelEnum.PACKING_LIST);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [selectedInsCartonsKeys, setSelectedInsCartonsKeys] = useState<Map<number, string[]>>(new Map<number, string[]>());
  const [packListCarton, setPackListCarton] = useState<Map<number, CartonDataModel[]>>(new Map<number, CartonDataModel[]>());
  const [selectedInsCartonsCount, setSelectableInsCartonsCount] = useState<Map<number, number>>(new Map<number, number>());
  const [preferenceReqModel, setPreferenceReqModel] = useState<SystematicPreferenceReqModel>(new SystematicPreferenceReqModel(userName, orgData.unitCode, orgData.companyCode, userId, poID, inspectionData.insSelectionType, Number(inspectionData.perc), '', [inspectionData.insType]))
  const pKMSInspectionConfigService = new PKMSInspectionConfigService()
  const fgInspectionCreationService = new FgInspectionCreationService();
  const fgLocationAllocationService = new FGLocationAllocationService()
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);


  useEffect(() => {
    setSystemSelectedInsBatchRolls(cartonData);
  }, [cartonData]);




  const handleAllocationChange = (value) => {
    setSelectedAllocation(value);
  };

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

  const setSystemSelectedInsBatchRolls = (cartonDataLocal?: CartonDataForEachPl[]) => {
    const data = cartonDataLocal ? cartonDataLocal : cartonData;
    const batchRollsLocal = new Map(packListCarton);
    const selectableInsCartonsCountLocal = new Map<number, number>(selectedInsCartonsCount);
    const selectedInsCartonsLocal = new Map();

    let isInspectionPickAlreadySaved = false;
    data?.forEach((packList) => {
      const totalRolls: CartonDataModel[] = [];
      const savedInsRolls: string[] = [];

      packList.packLists?.forEach((carton) => {
        if (carton.pickForInspection) {
          if (!isInspectionPickAlreadySaved) {
            isInspectionPickAlreadySaved = true;
          }
          savedInsRolls.push(carton.barCode);
        }
        const obj: CartonDataModel = {
          ...carton,
          // supplierCode: data.supplierCode,
          // phId: data.id,
          // inspectionDetails: lot.inspectionDetails
        };
        totalRolls.push(obj);
      });

      batchRollsLocal.set(packList.packListId, totalRolls);

      setPackListCarton(batchRollsLocal);


      const insRollsCount = Math.ceil((Number(inspectionData.perc) / 100) * totalRolls.length);

      selectableInsCartonsCountLocal.set(packList.packListId, insRollsCount);
      setSelectableInsCartonsCount(selectableInsCartonsCountLocal);
      if (!isInspectionPickAlreadySaved) {
        if (inspectionData.insSelectionType === InsInspectionRollSelectionTypeEnum.SYSTEMATIC) {
          const sortedRolls = totalRolls.sort((a, b) => Number(a.barCode) - Number(b.barCode));
          selectedInsCartonsLocal.set(packList.packListId, getSelectedCartons(sortedRolls, insRollsCount));
          setSelectedInsCartonsKeys(selectedInsCartonsLocal);
        }
      } else {
        selectedInsCartonsLocal.set(packList.packListId, savedInsRolls);
        setSelectedInsCartonsKeys(selectedInsCartonsLocal);
      }
    });

  };

  const refreshButtonHandler = () => {
    formRef.validateFields().then((values) => {
      if (InsCartonSelectLevelEnum.PACKING_LIST === values.insCartonSelectionBase) {
        setSystemSelectedInsBatchRolls();
      }
    }).catch(err => {
      console.log(err);
    })
  };

  // get the selected rolls the rolls acc to percentage when it is systematic 
  const getSelectedCartons = (crtns?: CartonDataModel[], requiredQuantity?: number): string[] => {
    if (!crtns || !requiredQuantity) return [];
    const selectedRolls: string[] = [];
    let quantity = 0;
    const routeMap = new Map<string, RouteMapObj>();

    const medianIndex = Math.floor(crtns.length / 2);
    routeMap.set(crtns[medianIndex].barCode, {
      top: { startIndex: 0, endIndex: medianIndex - 1 },
      bottom: { startIndex: medianIndex + 1, endIndex: crtns.length - 1 },
    });

    // Add the first median roll
    if (requiredQuantity > quantity) {
      quantity++;
      selectedRolls.push(crtns[medianIndex].barCode);
    }

    // Check if we've already reached the required quantity
    if (requiredQuantity <= quantity) return selectedRolls;

    for (const [key, val] of routeMap.entries()) {
      // Top portion
      if (val.top.startIndex <= val.top.endIndex) {
        const topArray = constructArrayFromRange(val.top.startIndex, val.top.endIndex);
        if (topArray.length > 0) {
          const topMidIndex = Math.floor(topArray.length / 2);
          const topMedianIndex = topArray[topMidIndex];

          if (topMedianIndex >= 0 && topMedianIndex < crtns.length) {
            routeMap.set(crtns[topMedianIndex].barCode, {
              top: { startIndex: val.top.startIndex, endIndex: topMedianIndex - 1 },
              bottom: { startIndex: topMedianIndex + 1, endIndex: val.top.endIndex },
            });

            if (requiredQuantity > quantity) {
              quantity++;
              selectedRolls.push(crtns[topMedianIndex].barCode);
            }
          }
        }
      }

      // Bottom portion
      if (val.bottom.startIndex <= val.bottom.endIndex) {
        const bottomArray = constructArrayFromRange(val.bottom.startIndex, val.bottom.endIndex);
        if (bottomArray.length > 0) {
          const bottomMidIndex = Math.floor(bottomArray.length / 2);
          const bottomMedianIndex = bottomArray[bottomMidIndex];

          if (bottomMedianIndex >= 0 && bottomMedianIndex < crtns.length) {
            routeMap.set(crtns[bottomMedianIndex].barCode, {
              top: { startIndex: val.bottom.startIndex, endIndex: bottomMedianIndex - 1 },
              bottom: { startIndex: bottomMedianIndex + 1, endIndex: val.bottom.endIndex },
            });

            if (requiredQuantity > quantity) {
              quantity++;
              selectedRolls.push(crtns[bottomMedianIndex].barCode);
            }
          }
        }
      }

      // Stop if we've reached the required quantity
      if (requiredQuantity <= quantity) break;
    }
    return selectedRolls;
  };


  const disabledSaveButton = (): boolean => {
    let selectedQty = 0;
    let requiredQty = 0;
    cartonData.forEach((rec) => {
      rec.packLists.forEach((c) => {
        const prev = selectedInsCartonsKeys.get(rec.packListId).includes(c.barCode);
        if (prev) {
          selectedQty += c.requiredQty
        }
        requiredQty += c.requiredQty
      })
    })
    return selectedQty !== requiredQty
  }


  const handleSave = () => {
    if (selectedInsCartonsCount.size == 0) {
      AlertMessages.getErrorMessage(`Please select a cartons to continue.`);
      return;
    } else {
      const packListIdsArray: number[] = [];
      const arrayOfInsConfig: InsConfigValModel[] = []
      selectedInsCartonsKeys.forEach((cartonBarCodes, packListId) => {
        packListIdsArray.push(packListId);
        const cartons = cartonBarCodes.map(rec => new InsConfigItemsModel(undefined, rec))
        const insConfigs = new InsConfigValModel(0, inspectionData.insType, Number(inspectionData.perc), inspectionData.materialReady, inspectionData.selected, undefined, formRef.getFieldValue('customerName'), inspectionData.insSelectionType, cartons, packListId, FGItemCategoryEnum.FG);
        arrayOfInsConfig.push(insConfigs);
      })
      const req = new InsFgInsConfigRequest(userName, orgData.unitCode, orgData.companyCode, userId, formRef.getFieldValue('customerName'), arrayOfInsConfig, formRef.getFieldValue('poId'), FGItemCategoryEnum.FG)
      pKMSInspectionConfigService.savePKMSFgInsConfigPLLevel(req).then(async res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsSaveDisabled(true);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => console.log(err.message));

    }
  };



  return (
    <div>
      <Form form={formRef} initialValues={{ insCartonSelectionBase: InsCartonSelectLevelEnum.PACKING_LIST }}>
        <Row>
          <Col span={20}></Col>
          <Col>
            <Form.Item name="insCartonSelectionBase"  >
              <Select onChange={handleAllocationChange} value={selectedAllocation} defaultValue={InsCartonSelectLevelEnum.PACKING_LIST} disabled>
                {Object.keys(InsCartonSelectLevelEnum).map((key) => (
                  <Select.Option value={InsCartonSelectLevelEnum[key]} key={key}>
                    {InsCartonSelectLevelEnum[key]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {selectedAllocation === InsCartonSelectLevelEnum.PACKING_LIST && <InspectionCartonDetails
        packListCarton={packListCarton} preferenceReqModel={preferenceReqModel} selectedInsCartonsCount={selectedInsCartonsCount} packListCrtnData={cartonData} cartonData={cartonData} selectedInsCartonsKeys={selectedInsCartonsKeys} setSelectedInsCartonsKeys={setSelectedInsCartonsKeys} />}
      <Affix offsetBottom={0}>
        <Row>
          <Col span={10} ></Col>
          <Col span={12} ></Col>
          <Col>
            <Button type='primary' style={{ offset: 21 }} onClick={handleSave} icon={<SaveOutlined />}
            // disabled={isSaveDisabled || insConfigItems.length !== 0}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Affix>
    </div>
  )
}
export default InspectionBySelection
