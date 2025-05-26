import { InsInspectionRollSelectionTypeEnum, InsIrRollIdsRequest, PackingListInfoModel, RollSelectionTypeEnum, ThreadTypeEnum } from "@xpparel/shared-models";
import { InsService } from "@xpparel/shared-services";
import { useEffect, useState } from "react";
// import { useAppSelector } from "packages/ui/src/common";
import { SaveOutlined } from "@ant-design/icons";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxButton, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { AllocationBatchTable, AllocationBatchTableModel } from "../../../../WMS/inspection-preference";
// import { AllocationBatchTable, AllocationBatchTableModel } from "../../../inspection-preference";


export interface IRollSelectionForReRequestProps {
    lotNumber: string;
    inspectionType: ThreadTypeEnum;
    companyCode: string;
    unitCode: string;
    irId: number;
    reloadDashboard: () => void;
}

export const RollSelectionForReRequest = (props: IRollSelectionForReRequestProps) => {
    const { lotNumber, inspectionType, companyCode, unitCode, irId, reloadDashboard } = props;
    const [rollInfo, setRollInfo] = useState<PackingListInfoModel>(null);
    const [selectableInsRollsCount, setSelectableInsRollsCount] = useState<Map<string, number>>(new Map<string, number>());
    const [batchRolls, setBatchRolls] = useState<Map<string, AllocationBatchTableModel[]>>(new Map<string, AllocationBatchTableModel[]>());
    const [selectedInsRolls, setSelectedInsRolls] = useState<Map<string, number[]>>(new Map<string, number[]>());

    const inspectionService = new InsService();
    // const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        console.log('coono')
        getRollInfoForLotAndInspectionType(lotNumber, inspectionType)
    }, []);
    const handleSave = () => {
        const allRolls = selectedInsRolls?.get(lotNumber);
        console.log(allRolls);
        if (!allRolls || allRolls?.length == 0) {
            AlertMessages.getErrorMessage('Please assign at least one roll ');
            return;
        }
        const reqObj = new InsIrRollIdsRequest(null, unitCode, companyCode, null, irId, allRolls);
        inspectionService.mapRollIdsToInspectionRequest(reqObj, true).then((res) => {
            if (res.status) {
                reloadDashboard();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })

    }
    const getRollInfoForLotAndInspectionType = (lotNumber: string, inspectionType: ThreadTypeEnum) => {
        // const reqObj = new LotNumberInspectionCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, lotNumber, inspectionType);
        // const reqObj = new YarnInsLotNumberInspectionCategoryRequest(null, unitCode, companyCode, null, lotNumber, inspectionType);
        // inspectionService.getEligibleRollInfoForInspectionTypeForLot(reqObj, true).then((res) => {
        //     if (res.status) {
        //         console.log(res.data[0]);
        //         res.data[0].rollSelectionType = RollSelectionTypeEnum.MANUAL;
        //         setRollInfo(res.data[0]);
        //         setSystemSelectedInsBatchRolls(res.data[0]);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // }).catch(err => {
        //     AlertMessages.getErrorMessage(err.message);
        // })
    };

    const setSystemSelectedInsBatchRolls = (packListDataLocal?: PackingListInfoModel) => {
        let data = packListDataLocal ? packListDataLocal : rollInfo;
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
                            // isInspectionPickAlreadySaved = true;
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

            selectableInsRollsCountLocal.set(batchInfo.batchNumber, totalRolls.length);
            setSelectableInsRollsCount(selectableInsRollsCountLocal);
            if (!isInspectionPickAlreadySaved) {
                if (data.rollSelectionType === RollSelectionTypeEnum.SYSTEMATIC) {
                    // const rolls: number[] = [];
                    // getRandomIntegersInRange(insRollsCount, 0, totalRolls.length - 1).forEach(rec => {
                    //     rolls.push(totalRolls[rec].rollNumber)
                    // })
                    // selectedInsRollsLocal.set(batchInfo.batchNumber, rolls);
                    // setSelectedInsRolls(selectedInsRollsLocal);
                }
            } else {
                selectedInsRollsLocal.set(batchInfo.batchNumber, savedInsRolls);
                setSelectedInsRolls(selectedInsRollsLocal);
            }
        });
    }

    return <>
        <ScxRow style={{ background: 'none' }} justify='space-between'>
            <ScxColumn xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <AllocationBatchTable key={rollInfo?.batchInfo[0]?.batchNumber} packListData={rollInfo} selectableInsRollsCount={selectableInsRollsCount} selectedInsRolls={selectedInsRolls} batchRolls={batchRolls} setSelectedInsRolls={setSelectedInsRolls} disableSelectedRolls={true} insSelectionType={InsInspectionRollSelectionTypeEnum.MANUAL}/>
            </ScxColumn>
        </ScxRow>
        <br />
        <ScxRow style={{ background: 'none' }} justify='space-between'>
            <ScxColumn xs={24} sm={22} md={22} lg={22} xl={22} xxl={22} />
            <ScxColumn xs={24} sm={2} md={2} lg={2} xl={2} xxl={2}>
                <ScxButton type="primary" onClick={handleSave} icon={<SaveOutlined />} style={{ width: '100%' }} disabled={false}>
                    Save
                </ScxButton>
            </ScxColumn>
        </ScxRow>
    </>
} 