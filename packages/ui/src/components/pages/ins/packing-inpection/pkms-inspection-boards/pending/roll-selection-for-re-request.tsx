import {  InsIrRollIdsRequest, PackFabricInspectionRequestCategoryEnum, PackingListInfoModel } from "@xpparel/shared-models";
import { InspectionPreferenceService, InsService,  } from "@xpparel/shared-services";
import { useState } from "react";
// import { useAppSelector } from "packages/ui/src/common";
import { SaveOutlined } from "@ant-design/icons";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxButton, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { AllocationBatchTableModel } from "../../../../WMS/inspection-preference";
import { PKMSAllocationBatchTable } from "../inspection-preference";


export interface IRollSelectionForReRequestProps {
    lotNumber: string;
    inspectionType: PackFabricInspectionRequestCategoryEnum;
    insReqId: number;
    reloadDashboard: () => void;
    userFromModal?: any

}

export const PKMSRollSelectionForReRequest = (props: IRollSelectionForReRequestProps) => {
    const { lotNumber, inspectionType, insReqId, reloadDashboard ,userFromModal} = props;
    const [rollInfo, setRollInfo] = useState<PackingListInfoModel>(null);
    const [selectableInsRollsCount, setSelectableInsRollsCount] = useState<Map<string, number>>(new Map<string, number>());
    const [batchRolls, setBatchRolls] = useState<Map<string, AllocationBatchTableModel[]>>(new Map<string, AllocationBatchTableModel[]>());
    const [selectedInsRolls, setSelectedInsRolls] = useState<Map<string, number[]>>(new Map<string, number[]>());
    const insPreferenceService = new InspectionPreferenceService();
    const inspectionService = new InsService();
    const user = userFromModal ? userFromModal : useAppSelector((state) => state.user.user.user);




    const handleSave = () => {
        const allRolls = selectedInsRolls?.get(lotNumber);
        console.log(allRolls);
        if (!allRolls || allRolls?.length == 0) {
            AlertMessages.getErrorMessage('Please assign at least one roll ');
            return;
        }
        const reqObj = new InsIrRollIdsRequest(null, user.unitCode, user.companyCode, null, insReqId, allRolls);
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




    return <>
        <ScxRow style={{ background: 'none' }} justify='space-between'>
            <ScxColumn xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <PKMSAllocationBatchTable key={rollInfo?.batchInfo[0]?.batchNumber} packListData={rollInfo} selectableInsRollsCount={selectableInsRollsCount} selectedInsRolls={selectedInsRolls} batchRolls={batchRolls} setSelectedInsRolls={setSelectedInsRolls} disableSelectedRolls={true} />
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