import { PkShippingRequestShippingInfoModel, PkShippingRequestTruckInfoModel } from "../shippment-info";
import { PkShippingItemsAbstractModel } from "./pk-s-request-items-abstract.model";

export class PkAodAbstarctModel {
    shippingInfo: PkShippingRequestShippingInfoModel;
    truckInfo: PkShippingRequestTruckInfoModel[];
    shippingItemsAbstractInfo: PkShippingItemsAbstractModel[];
    constructor(
        shippingInfo: PkShippingRequestShippingInfoModel,
        truckInfo: PkShippingRequestTruckInfoModel[],
        shippingItemsAbstractInfo: PkShippingItemsAbstractModel[]
    ) {
        this.shippingInfo = shippingInfo
        this.truckInfo = truckInfo
        this.shippingItemsAbstractInfo = shippingItemsAbstractInfo
    }
}
