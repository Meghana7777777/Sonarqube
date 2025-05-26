import { GlobalResponseObject } from "../../common";

export class SewJobBundleSheetResponse extends GlobalResponseObject {
    data: SewJobBundleSheetModel[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: SewJobBundleSheetModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class SewJobBundleSheetModel {
    itemCode: string;
    itemColor: string;
    objectCode: string;
    locationCode: string;
    requiredQty: number;
    allocatedQty: number;
    issuedQty: number;
    constructor(itemCode: string, itemType: string, itemColor: string, objectCode: string, locationCode: string, requiredQty: number, allocatedQty: number, issuedQty: number) {
        this.itemCode = itemCode;
        this.itemColor = itemColor;
        this.objectCode = objectCode;
        this.issuedQty = issuedQty;
        this.requiredQty = requiredQty; 
        this.allocatedQty = allocatedQty;       
        this.locationCode = locationCode;
    }
}

export class SewitemCodeWiseConsumptionResponse extends GlobalResponseObject {
    data: SewJobMaterialModel[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: SewJobMaterialModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class SewJobMaterialModel {
    jobNumber: string;
    fgColor: string;
    size: string;
    itemCode: string;
    productRef: string;
    consumption: number;
    requiredQty: number;
    constructor(jobNumber: string, fgColor: string, size: string, itemCode: string, productRef: string, consumption: number, requiredQty: number) {
        this.jobNumber = jobNumber;
        this.fgColor = fgColor;
        this.size = size;
        this.itemCode = itemCode;
        this.productRef = productRef;
        this.consumption = consumption;  
        this.requiredQty = requiredQty;      
    }
}