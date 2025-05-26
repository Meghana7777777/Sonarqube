import { RollPalletConfirmationResponse, RollSelectionTypeEnum, SpoLogDownloadMethodEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs, PackingListUploadTypeEnum } from "../../../common";
import { BatchInfoModel } from "./batch-info.model";


export class PackingListInfoModel extends CommonRequestAttrs {
    id: number;
    supplierCode: string;
    supplierName: string;
    deliveryDate: Date;
    packListDate: Date;
    packListCode: string;
    description: string;
    remarks: string;
    confirmedDate: Date;
    batchInfo: BatchInfoModel[];
    rollSelectionType: RollSelectionTypeEnum;
    rollsPickPercentage: number;

    unloadingStartTime: Date;
    unloadingCompletedTime: Date;
    uploadType: PackingListUploadTypeEnum;
    downLoadMethod: SpoLogDownloadMethodEnum;
    downLoadedAt: Date;
    constructor(id: number, supplierCode: string, supplierName: string, deliveryDate: Date, packListDate: Date, packListCode: string, description: string, remarks: string, confirmedDate: Date, unloadingStartTime: Date, unloadingCompletedTime: Date, batchInfo: BatchInfoModel[], username: string, unitCode: string, companyCode: string, userId: number, uploadType: PackingListUploadTypeEnum, downLoadMethod: SpoLogDownloadMethodEnum, downLoadedAt: Date, rollSelectionType: RollSelectionTypeEnum, rollsPickPercentage: number) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.supplierCode = supplierCode;
        this.supplierName = supplierName;
        this.deliveryDate = deliveryDate;
        this.packListDate = packListDate;
        this.packListCode = packListCode;
        this.description = description;
        this.remarks = remarks;
        this.confirmedDate = confirmedDate;
        this.unloadingStartTime = unloadingStartTime;
        this.unloadingCompletedTime = unloadingCompletedTime;
        this.batchInfo = batchInfo;
        this.uploadType = uploadType;
        this.downLoadMethod = downLoadMethod;
        this.downLoadedAt = downLoadedAt;
        this.rollSelectionType = rollSelectionType;
        this.rollsPickPercentage = rollsPickPercentage;
    }
}