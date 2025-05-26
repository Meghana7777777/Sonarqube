import { PackingStatusEnum } from "../enum/packing-status.enum";


export class PKPoSubLineModel {
    id:number;
    size: string;
    ratio: number;
    upcBarcode: string;
    quantity: number;
    packedQty: number;
    deliveryDate: string;
    packingStatus: PackingStatusEnum;
    constructor(
        size: string,
        ratio: number,
        upcBarcode: string,
        quantity: number,
        packedQty: number,
        deliveryDate: string,
        packingStatus: PackingStatusEnum,
    ) {
        this.size = size;
        this.ratio = ratio;
        this.upcBarcode = upcBarcode;
        this.quantity = quantity;
        this.packedQty = packedQty;
        this.deliveryDate = deliveryDate;
        this.packingStatus = packingStatus;
    }
}