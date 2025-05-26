import { ShippingRequestShippingInfoModel, ShippingRequestTruckInfoModel } from "../shippment-info";
import { ShippingItemsAbstractModel } from "./s-request-items-abstract.model";

export class AodAbstarctModel {
    shippingInfo: ShippingRequestShippingInfoModel;
    truckInfo: ShippingRequestTruckInfoModel[];
    shippingItemsAbstractInfo: ShippingItemsAbstractModel[];
    constructor(
        shippingInfo: ShippingRequestShippingInfoModel,
        truckInfo: ShippingRequestTruckInfoModel[],
        shippingItemsAbstractInfo: ShippingItemsAbstractModel[]
    ) {
        this.shippingInfo = shippingInfo
        this.truckInfo = truckInfo
        this.shippingItemsAbstractInfo = shippingItemsAbstractInfo
    }
}
