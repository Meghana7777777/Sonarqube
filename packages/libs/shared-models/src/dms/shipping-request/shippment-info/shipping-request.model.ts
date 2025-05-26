import { ShippingRequestProceedingEnum } from "../../enum";
import { ShippingReqesutItemAttrsModel } from "./shipping-request-item-attrs.model";
import { ShippingReqesutItemModel } from "./shipping-request-item.model";
import { ShippingRequestShippingInfoModel } from "./shipping-request-shipping-info.model";
import { ShippingRequestTruckInfoModel } from "./shipping-request-truck-info.model";

export class ShippingRequestModel {
    id: number; // PK of the d_set entity
    srNo: string; // shipping request no
    shippingReqItems: ShippingReqesutItemModel[];
    approvalStatus: ShippingRequestProceedingEnum;
    aodPrintStatus: boolean;
    shippingInfo: ShippingRequestShippingInfoModel;
    truckInfo: ShippingRequestTruckInfoModel[];
    constructor(
        id: number,
        srNo: string,
        shippingReqItems: ShippingReqesutItemModel[],
        approvalStatus: ShippingRequestProceedingEnum,
        aodPrintStatus: boolean,
        shippingInfo: ShippingRequestShippingInfoModel,
        truckInfo: ShippingRequestTruckInfoModel[]
    ) {
        this.id = id
        this.srNo = srNo;
        this.shippingReqItems = shippingReqItems
        this.approvalStatus = approvalStatus
        this.aodPrintStatus = aodPrintStatus
        this.shippingInfo = shippingInfo
        this.truckInfo = truckInfo
    }
}




