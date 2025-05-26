import { PslOperationModel } from "./psl-operation-model";

export class MoProductSubLineModel {

    fgColor: string;
    size: string;
    quantity: number;
    extRefNumber1: string;
    extRefNumber2: string;
    destination: string;
    deliveryDate: string;
    schedule: string;
    zFeature: string;
    planProdDate: string;
    planCutDate: string;
    buyerPo: string;
    pslOperations: PslOperationModel[];

    constructor(

        fgColor: string,
        size: string,
        quantity: number,
        extRefNumber1: string,
        extRefNumber2: string,
        destination: string,
        deliveryDate: string,
        schedule: string,
        zFeature: string,
        planProdDate: string,
        planCutDate: string,
        buyerPo: string,
        pslOperations: PslOperationModel[]
    ) {

        this.fgColor = fgColor;
        this.size = size;
        this.quantity = quantity;
        this.extRefNumber1 = extRefNumber1;
        this.extRefNumber2 = extRefNumber2;
        this.destination = destination;
        this.deliveryDate = deliveryDate;
        this.schedule = schedule;
        this.zFeature = zFeature;
        this.planProdDate = planProdDate;
        this.planCutDate = planCutDate;
        this.buyerPo = buyerPo
        this.pslOperations = pslOperations;
    }
}
