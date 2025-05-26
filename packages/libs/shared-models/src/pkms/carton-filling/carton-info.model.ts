export class CartonInfoModel {
    cartonId: number;
    cartonProtoId: number;
    cartonNo: number;
    barcode: string;
    qty: number;
    inspectionPick: boolean;
    width: number;
    length: number;
    height: number;
    grossWeight: number;
    netWeight: number;
    packListNumber?: string;
    packListId?: number;
    constructor(
        cartonId: number,
        cartonProtoId: number,
        cartonNo: number,
        qty: number,
        inspectionPick: boolean,
        barcode: string,
        width: number,
        length: number,
        height: number,
        grossWeight: number,
        netWeight: number,
        packListNumber?: string,
        packListId?: number
    ) {
        this.cartonId = cartonId;
        this.cartonNo = cartonNo;
        this.cartonProtoId = cartonProtoId;
        this.qty = qty;
        this.inspectionPick = inspectionPick;
        this.barcode = barcode;
        this.width = width;
        this.length = length;
        this.height = height;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.packListNumber = packListNumber;
        this.packListId = packListId;
    }
}