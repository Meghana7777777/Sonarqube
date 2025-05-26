import { PackingStatusEnum } from "../enum/packing-status.enum";
import { PKPoSubLineModel } from "./pk-po-sub-line.model";

export class PKPoLineModel {
    id: number;
    poLine: string;
    color: string;
    upcBarcode: string;
    qty: number;
    packedQty: number;
    packingStatus: PackingStatusEnum;
    poOrderSubLines: PKPoSubLineModel[];
    incoterm: string;
    buyerAddress: string;
    style: string;
    exfactory: string;
    deliveryDate: string;
    constructor(
        poLine: string,
        color: string,
        upcBarcode: string,
        qty: number,
        packedQty: number,
        packingStatus: PackingStatusEnum,
        poOrderSubLines: PKPoSubLineModel[],
        incoterm?: string,
        buyerAddress?: string,
        style?: string,
        exfactory?: string,
        deliveryDate?: string,

    ) {
        this.poLine = poLine;
        this.color = color;
        this.upcBarcode = upcBarcode;
        this.qty = qty;
        this.packedQty = packedQty;
        this.packingStatus = packingStatus;
        this.poOrderSubLines = poOrderSubLines;
        this.incoterm = incoterm;
        this.buyerAddress = buyerAddress;
        this.style = style;
        this.exfactory = exfactory;
        this.deliveryDate = deliveryDate;
    }
}