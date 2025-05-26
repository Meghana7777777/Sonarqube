export class CartonBasicInfoModel {
    cartonId: number;
    cartonProtoId: number;
    cartonNo: number;
    barcode: string;
    originalQty: number;
    leftOverQuantity: number;
    scannedQuantity: number;
    packOrderId: number;
    packListId: number;
    packListCode: string;
    inspectionPick: boolean;
    grossWeight: number;
    netWeight: number;
    plannedGrossWeight: number;
    plannedNetWeight: number;
    length: number;
    width: number;
    height: number;
    constructor(
        cartonId: number,
        cartonProtoId: number,
        cartonNo: number,
        barcode: string,
        originalQty: number,
        leftOverQuantity: number,
        scannedQuantity: number,
        packOrderId: number,
        packListId: number,
        packListCode: string,
        inspectionPick: boolean,
        grossWeight: number,
        netWeight: number,
        plannedGrossWeight: number,
        plannedNetWeight: number,
        length: number,
        width: number,
        height: number
    ) {
        this.cartonId = cartonId;
        this.cartonNo = cartonNo;
        this.barcode = barcode;
        this.cartonProtoId = cartonProtoId;
        this.originalQty = originalQty;
        this.leftOverQuantity = leftOverQuantity;
        this.scannedQuantity = scannedQuantity;
        this.packOrderId = packOrderId;
        this.packListId = packListId;
        this.packListCode = packListCode;
        this.inspectionPick = inspectionPick;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.plannedGrossWeight = plannedGrossWeight;
        this.plannedNetWeight = plannedNetWeight;
        this.length = length;
        this.width = width;
        this.height = height;
    }
}