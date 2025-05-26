import { GlobalResponseObject } from "../../../common";
import { FabricInformation } from "../mo";

export class SaleOrderDataInfoModel {    
    basicSaleOrderDetails: SaleOrderInfo;
    saleOrderItems: SaleOrderItemData[];
    saleOrderItemsData: FabricInformation[];
}

export class SaleOrderInfo {
    saleOrderId: string;
    saleOrder: string;
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


export class SaleOrderItemData {
    saleOrderItemNo: string;    
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


// export class FabricInformation {
//     saleOrderItemNo: string;
//     itemCode: string;
//     itemName:string;
//     itemDescription: string;
//     itemColor: string;
//     itemUom: string;
//     poQty: number;
//     grnQty: number;
//     itemCategory: string;
//     supplierCode: string;
//     supplierName: string;
//     fabricMeters : string;
// }

export class SaleOrderDataInfoModelResponse extends GlobalResponseObject{
    data : SaleOrderDataInfoModel;
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
    */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: SaleOrderDataInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}