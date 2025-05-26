import { GlobalResponseObject } from "../common/global-response-object";

export class PoWhRequestMaterialData {
    id:number;
    itemCode: string;
    itemType: string;
    itemName: string;
    objectCode: string;
    supplierCode: string;
    objectType: string;
    requiredQty: number;
    allocatedQty: number;
    issuedQty: number;

    constructor(
        id:number,
        itemCode: string,
        itemType: string,
        itemName: string,
        objectCode: string,
        supplierCode: string,
        objectType: string,
        requiredQty: number,
        allocatedQty: number,
        issuedQty: number,
    ) {
        this.id = id;
        this.itemCode = itemCode;
        this.itemType = itemType;
        this.itemName = itemName;
        this.objectCode = objectCode;
        this.supplierCode = supplierCode;
        this.objectType = objectType;
        this.requiredQty = requiredQty;
        this.allocatedQty = allocatedQty;
        this.issuedQty = issuedQty;
    }
}


export class PoWhRequestMaterialDataResponse extends GlobalResponseObject {
    data: PoWhRequestMaterialData[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: PoWhRequestMaterialData[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}