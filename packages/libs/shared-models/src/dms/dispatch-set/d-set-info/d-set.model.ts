import { DSetItemModel } from "./d-set-item.model";

export class DSetModel {
    id: number; // PK of the d_set entity
    moNumber: string;
    productName: string;
    dSetCode: string;
    shippingReqCreated: boolean;
    dSetItems: DSetItemModel[];
    constructor(
        id: number,
        moNumber: string,
        productName: string,
        dSetCode: string,
        shippingReqCreated: boolean,
        dSetItems: DSetItemModel[]
    ) {
        this.id = id
        this.moNumber = moNumber
        this.productName = productName
        this.dSetCode = dSetCode
        this.shippingReqCreated = shippingReqCreated;
        this.dSetItems = dSetItems
    }
}










