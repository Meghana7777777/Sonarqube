import { GlobalResponseObject } from "../common";

export class KnitJobConformationViewModelResponse extends GlobalResponseObject {
    data: KnitJobConformationViewModel;
    constructor(status: boolean,
            errorCode: number,
            internalMessage: string,
            data?: KnitJobConformationViewModel) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}


export class KnitJobConformationViewModel {
    knitJobBasicInfo: KnitJobBasicInfoModel;
    sizeWiseRmDetails: SizeWiseRmModel[];
    objectDetails: ObjectDetailModel[];
    // allocationSummary: AllocationSummaryModel;
    constructor(
        knitJobBasicInfo: KnitJobBasicInfoModel,
        sizeWiseRmDetails: SizeWiseRmModel[],
        objectDetails: ObjectDetailModel[]
    ) {
        this.knitJobBasicInfo = knitJobBasicInfo;
        this.sizeWiseRmDetails = sizeWiseRmDetails;
        this.objectDetails = objectDetails
    }
}

export class KnitJobBasicInfoModel {
    style: string;
    buyer: string;
    saleOrder: string;
    soLine: string[];
    color: string[];
    productType: string[];
    productName: string;
    productStyleRefNo: string;
    fabricPo: string;
    components: string;
    customer: string;
    itemCode: string;
    fabricReference: string;
    constructor(
        style: string,
        buyer: string,
        saleOrder: string,
        soLine: string[],
        color: string[],
        productType: string[],
        productName: string,
        productStyleRefNo: string,
        fabricPo: string,
        components: string,
        customer: string,
        itemCode: string,
        fabricReference: string,
    ) {
        this.style = style
        this.buyer = buyer
        this.saleOrder = saleOrder
        this.soLine = soLine
        this.color = color
        this.productType = productType
        this.productName = productName
        this.productStyleRefNo = productStyleRefNo
        this.fabricPo = fabricPo
        this.components = components
        this.customer = customer
        this.itemCode = itemCode
        this.fabricReference = fabricReference
    }
}

export class SizeWiseRmModel {
    size: string;
    quantity: number;
    totalBundles: number;
    color: string;
    consumptionDetails: RequirementModel
    constructor(
        size: string,
        quantity: number,
        totalBundles: number,
        color: string,
        consumptionDetails: RequirementModel
    ) {
        this.size = size
        this.quantity = quantity
        this.totalBundles = totalBundles
        this.color = color
        this.consumptionDetails = consumptionDetails
    }
}

export class RequirementModel {
    consumption: number;
    wastage: number;
    ww: number;
    wow: number;
    constructor(
        consumption: number,
        wastage: number,
        ww: number,
        wow: number,
    ) {
        this.consumption = consumption;
        this.wastage = wastage;
        this.ww = ww;
        this.wow = wow;
    }
}

export class ObjectDetailModel {
    sequenceNo: string;
    location: string;
    barcode: string;
    objectNo: number;
    batchNo: string;
    objectQty: number;
    constructor(
        sequenceNo: string,
        location: string,
        barcode: string,
        objectNo: number,
        batchNo: string,
        objectQty: number,
    ) {
        this.sequenceNo = sequenceNo;
        this.location = location;
        this.barcode = barcode;
        this.objectNo = objectNo;
        this.batchNo = batchNo;
        this.objectQty = objectQty;
    }
}

// export class AllocationSummaryModel {
//     grandTotalAllocatedQty: number;
// }
