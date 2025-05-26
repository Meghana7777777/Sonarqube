import { OrderTypeEnum } from "../../oes";

export class PoSummaryDataModel {
    quantityType: OrderTypeEnum;
    productCodeDetails: PoProductCodeDetailsModel[];

    constructor(quantityType: OrderTypeEnum, productCodeDetails: PoProductCodeDetailsModel[]) {
        this.quantityType = quantityType;
        this.productCodeDetails = productCodeDetails;
    }
}

export class PoProductCodeDetailsModel {
    productCode: string;
    colorDetails: PoColorDetailsModel[];

    constructor(productCode: string, colorDetails: PoColorDetailsModel[]) {
        this.productCode = productCode;
        this.colorDetails = colorDetails;
    }
}

export class PoColorDetailsModel {
    color: string;
    poSizeDetails: PoSizeDetailsModel[];

    constructor(color: string, poSizeDetails: PoSizeDetailsModel[]) {
        this.color = color;
        this.poSizeDetails = poSizeDetails;
    }
}

export class PoSizeDetailsModel {
    size: string;
    quantity: number;
    constructor( size: string, quantity: number){
        this.size = size;
        this.quantity = quantity;
    }
}
