import { InsInspectionLevelEnum } from "@xpparel/shared-models";
import { PalletBinStatusEnum } from "../../enum";
import { ActualRollInfoModel } from "./actual-roll-info.model";

export class RollInfoUIModel {
    id: number;
    rollNumber: number;
    externalRollNumber: string;
    objectType: string;
    inputQuantity: number;
    supplierQuantity: number;
    uom: string;
    inputWidth: number;
    supplierWidth: number;
    supplierLength: number;
    inputLength: number;
    shade: string;
    skLength: number;
    skWidth: number;
    skGroup: number;
    netWeight: number;
    gsm: number;
    inputQuantityUom: string;
    inputWidthUom: string;
    inputLengthUom: string;
    remarks: string;
    printStatus: boolean;
    printReleased: boolean;
    qrCodeInfo: string; // the entire text that has to be converted into QR
    pickForInspection: boolean;
    isOverRideSysAllocation: boolean; // false
    lotNo: string;
    batchNo: string;
    status: PalletBinStatusEnum;
    groupedBy?: InsInspectionLevelEnum;
    groupedObjDesc?: string;
    groupedObjNumber?: string;
    phId: number;
    barcode: string;
    measuredWeight: number;
    objectSeqNumber: number;    
    batchNumber: string;    
    packListCode: string;
    actualRollInfo:ActualRollInfoModel;
    
}
