import { GlobalResponseObject, PhItemCategoryEnum } from "../../common";
import { InsInspectionStatusEnum } from "../../ins";
import { InspectionStatusEnum } from "../enum/inspection-status.enum";

export class InsRollBasicInfoResponse extends GlobalResponseObject {
    data?: InsRollBasicInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsRollBasicInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class InsRollBasicInfoModel {
    rollId: number;
    barcode: string;
    packListId: number;
    originalQty: number;
    leftOverQuantity: number;
    phLinesId: number; // Batch or lot table id
    batch: string;
    lot: string;
    width: string;
    inspectionPick: boolean;
    issuedQuantity: number; // the total issued qty by the dockets in CPS/ manual issued qty
    inputQuantity: number;
    sShade: string;
    shrinkageGroup: number;
    itemCode: string;
    itemDesc: string;
    aShade: string;
    sWidth: number;
    sQuantity: number;
    inputQtyUom: string;
    inputWidthUom: string;
    grnDate: Date;
    measuredWidth: number;
    measuredWeight: number;
    relaxWidth: string;
    allocatedQty: number; // the total allocated qty by the dockets in CPS
    externalRollNumber: string;
    itemCategory: PhItemCategoryEnum;
    itemColor: string;
    aGsm:number;
// need to add gsm
    constructor(rollId: number, inspectionPick: boolean, barcode: string, packListId: number, originalQty: number, leftOverQuantity: number, phLinesId: number, batch: string, lot: string, width: string, issuedQuantity: number, inputQuantity: number, sShade: string, shrinkageGroup: number, itemCode: string, itemDesc: string, aShade: string, sWidth: number, sQuantity: number, grnDate: Date, inputQtyUom: string, inputWidthUom: string, measuredWidth: number, measuredWeight: number, relaxWidth: string, allocatedQty: number, externalRollNumber: string, itemCategory: PhItemCategoryEnum, itemColor: string,aGsm:number ) {
        this.rollId = rollId;
        this.barcode = barcode;
        this.packListId = packListId;
        this.originalQty = originalQty;
        this.leftOverQuantity = leftOverQuantity;
        this.phLinesId = phLinesId;
        this.batch = batch;
        this.lot = lot;
        this.width = width;
        this.inspectionPick = inspectionPick;
        this.issuedQuantity = issuedQuantity;
        this.inputQuantity = inputQuantity;
        this.sShade = sShade;
        this.shrinkageGroup = shrinkageGroup;
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.aShade = aShade;
        this.sWidth = sWidth;
        this.sQuantity = sQuantity;
        this.grnDate = grnDate;
        this.inputQtyUom = inputQtyUom;
        this.inputWidthUom = inputWidthUom;
        this.measuredWidth = measuredWidth;
        this.measuredWeight = measuredWeight;
        this.relaxWidth = relaxWidth;
        this.allocatedQty = allocatedQty;
        this.externalRollNumber = externalRollNumber;
        this.itemCategory = itemCategory;
        this.itemColor = itemColor;
        this.aGsm = aGsm;
    }
}
