import { PackingStatusEnum } from "@xpparel/shared-models";
import { PkRatioModel } from "./pk-size-ratio.model";

export class CartonPrintModel {
    ctnNo: string;
    poNo: string;
    style: string;
    color: string;
    sizeRatio: PkRatioModel[];
    cartonQty: number;
    destination: string;
    exFactory: string;
    packListNo: string;
    buyerAddress: string;
    moNo: string;
    supplier: string;
    cartonsPerPackJob: number;
    status?: PackingStatusEnum;
    constructor(
        ctnNo: string,
        poNo: string,
        style: string,
        color: string,
        sizeRatio: PkRatioModel[],
        cartonQty: number,
        destination: string,
        exFactory: string,
        packListNo: string,
        buyerAddress: string,
        moNo: string,
        supplier: string,
        cartonsPerPackJob?: number,
        status?: PackingStatusEnum,
    ) {
        this.ctnNo = ctnNo;
        this.poNo = poNo;
        this.style = style;
        this.color = color;
        this.sizeRatio = sizeRatio;
        this.cartonQty = cartonQty;
        this.destination = destination;
        this.exFactory = exFactory;
        this.packListNo = packListNo;
        this.buyerAddress = buyerAddress;
        this.moNo = moNo;
        this.supplier = supplier;
        this.cartonsPerPackJob = cartonsPerPackJob;
        this.status = status;
    }
}