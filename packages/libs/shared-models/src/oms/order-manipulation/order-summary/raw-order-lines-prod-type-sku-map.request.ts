import { CommonRequestAttrs } from "../../../common"
import { PackMethodEnum } from "../../enum";
import { RawOrderProdTypeSkuMapRequest } from "./raw-order-prod-type-sku-map.request";

export class RawOrderLinesProdTypeSkuMapRequest extends CommonRequestAttrs {
   rawOrderProductTypeSkuMap: RawOrderProdTypeSkuMapRequest[];
   orderId: number;
   packMethod: PackMethodEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        rawOrderProductTypeSkuMap: RawOrderProdTypeSkuMapRequest[],
        orderId: number,
        packMethod: PackMethodEnum
    ) {
        super(username, unitCode, companyCode, userId);

        this.rawOrderProductTypeSkuMap = rawOrderProductTypeSkuMap;
        this.orderId = orderId;
        this.packMethod = packMethod;
    }
}
