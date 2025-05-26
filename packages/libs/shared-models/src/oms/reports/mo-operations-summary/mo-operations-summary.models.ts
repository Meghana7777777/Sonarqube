import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { OrderTypeEnum } from "../../../oes";
import { ProcessTypeEnum } from "../../enum";

export class MoCombinationFlags {
    product: boolean;
    destination: boolean;
    deliveryDate: boolean;
    color: boolean
}

export class MoCombinationDetails {
    product: string;
    destination: string;
    deliveryDate: string;
    color: string

}

export class MoCombinationRequest extends CommonRequestAttrs {
    moNumber: string;
    combinationFlags: MoCombinationFlags;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, moNumber: string, combinationFlags: MoCombinationFlags) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.combinationFlags = combinationFlags;
    }

}

export class MoCombinationWithPslIdsModel {
    moPslIds: number[]
    combination: MoCombinationDetails
    moNumber: string

    constructor(moPslIds: number[], combination: MoCombinationDetails, moNumber: string) {
        this.moPslIds = moPslIds;
        this.combination = combination;
        this.moNumber = moNumber;
    }
}

export class MoCombinationWithPslIdsResponse extends GlobalResponseObject {
    data: MoCombinationWithPslIdsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoCombinationWithPslIdsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class MoPslIdsOrderFeatures {
    product: string
    deliveryDate: string;
    destination: string;
    size: string;
    color: string;
    quantity: number;
    moPslId: number;
    moNumber: string;
    oqType: OrderTypeEnum
    constructor(product: string, deliveryDate: string, destination: string, size: string, color: string, quantity: number, moPslId: number, moNumber: string, oqType: OrderTypeEnum
    ) {
        this.product = product;
        this.deliveryDate = deliveryDate;
        this.destination = destination;
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.moPslId = moPslId;
        this.moNumber = moNumber;
        this.oqType = oqType
    }
}

export class MoPslIdsOrderFeaturesResponse extends GlobalResponseObject {
    data: MoPslIdsOrderFeatures[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoPslIdsOrderFeatures[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class MoPslIdQtysInfoModel {
    moPslId: number;
    completedQty: number;
    rejectedQty: number;
    constructor(moPslId: number, completedQty: number, rejectedQty: number) {
        this.moPslId = moPslId;
        this.completedQty = completedQty;
        this.rejectedQty = rejectedQty;

    }
}

export class MoPslIdQtysInfoResponse extends GlobalResponseObject {
    data: MoPslIdQtysInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoPslIdQtysInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class MoProductColorReq extends CommonRequestAttrs {
    productCode: string;
    fgColor: string;
    moNumber: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, productCode: string, fgColor: string, moNumber: string) {
        super(username, unitCode, companyCode, userId);
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.moNumber = moNumber;

    }
}

export class MoOpSequenceInfoModel {
    processType: ProcessTypeEnum;
    sequence: number;
    lastOpGroup?: string


    constructor(processType: ProcessTypeEnum, sequence: number, lastOpGroup?: string) {
        this.processType = processType;
        this.sequence = sequence;
        this.lastOpGroup = lastOpGroup
    }
}

export class MoOpSequenceInfoResponse extends GlobalResponseObject {
    data: MoOpSequenceInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoOpSequenceInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }


}

export class MoPslIdProcessTypeReq extends CommonRequestAttrs {
    moPslIds: number[];
    processType: ProcessTypeEnum;
    lastOpGroup?:string

    constructor(username: string, unitCode: string, companyCode: string, userId: number, moPslIds: number[], processType: ProcessTypeEnum,lastOpGroup?:string) {
        super(username, unitCode, companyCode, userId);
        this.moPslIds = moPslIds;
        this.processType = processType;
        this.lastOpGroup = lastOpGroup
    }

}

export class MoOperationReportedQtyInfoModel {
    processType: ProcessTypeEnum;
    completedQty: number;
    rejectedQty: number;

    constructor(processType: ProcessTypeEnum, completedQty: number, rejectedQty: number) {
        this.processType = processType;
        this.completedQty = completedQty;
        this.rejectedQty = rejectedQty;

    }
}

export class MoOperationReportedQtyInfoResponse extends GlobalResponseObject {
    data: MoOperationReportedQtyInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoOperationReportedQtyInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

