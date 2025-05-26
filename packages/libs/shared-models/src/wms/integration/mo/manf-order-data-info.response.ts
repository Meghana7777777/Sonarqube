import { GlobalResponseObject } from "../../../common";

export class ManufacturingOrderDataInfoModel {    
    basicManufacturingOrderDetails: ManufacturingOrderInfo;
    manufacturingOrderItems: ManufacturingOrderItemData[];
    manufacturingOrderItemsData: FabricInformation[];
}

export class ManufacturingOrderInfo {
    manufacturingOrderId: string;
    manufacturingOrder: string;
    customerCode: string;
    customerName: string;
    profitCenterCode: string;
    profitCenterName: string;
    productName: string;
    productCategory: string;
    quantity: number;
    styleName: string;
    styleCode: string;
    styleDesc: string;
}


export class ManufacturingOrderItemData {
    manufacturingOrderItemNo: string;    
    styleName: string;
    styleCode: string;
    styleDesc: string;
    garmentVendorCode: string;
    garmentVendorName: string;
    garmentVendorUnit: string;
    garmentVendorPo:string;
    garmentVendorPoItem:string;
    buyerPo:string;
    quantity: number;
    plannedCutDate:string;
    plannedProductionDate:string;
    plannedDeliveryDate:string;
}


export class FabricInformation {
    manufacturingOrderItemNo: string;
    itemCode: string;
    itemName:string;
    itemDescription: string;
    itemColor: string;
    itemUom: string;
    poQty: number;
    grnQty: number;
    itemCategory: string;
    supplierCode: string;
    supplierName: string;
    fabricMeters : string;
}

export class ManufacturingOrderDataInfoModelResponse extends GlobalResponseObject{
    data : ManufacturingOrderDataInfoModel;
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
    */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: ManufacturingOrderDataInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}