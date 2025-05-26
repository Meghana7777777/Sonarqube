import { PkShippingRequestProceedingEnum } from "../../enum";
import { PkShippingReqesutItemAttrsModel } from "./pk-shipping-request-item-attrs.model";
import { PkShippingReqesutItemModel } from "./pk-shipping-request-item.model";
import { PkShippingRequestShippingInfoModel } from "./pk-shipping-request-shipping-info.model";
import { PkShippingRequestTruckInfoModel } from "./pk-shipping-request-truck-info.model";

export class PkShippingRequestModel {
    id: number; // PK of the d_set entity
    srNo: string; // shipping request no
    shippingReqItems: PkShippingReqesutItemModel[];
    approvalStatus: PkShippingRequestProceedingEnum;
    aodPrintStatus: boolean;
    shippingInfo: PkShippingRequestShippingInfoModel;
    truckInfo: PkShippingRequestTruckInfoModel[];
    constructor(
        id: number,
        srNo: string,
        shippingReqItems: PkShippingReqesutItemModel[],
        approvalStatus: PkShippingRequestProceedingEnum,
        aodPrintStatus: boolean,
        shippingInfo: PkShippingRequestShippingInfoModel,
        truckInfo: PkShippingRequestTruckInfoModel[]
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




