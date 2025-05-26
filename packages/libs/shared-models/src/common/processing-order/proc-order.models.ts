import { GlobalResponseObject } from "../global-response-object";
import { ProcessingOrderProductSubLineInfo } from "./processing-order-product-sub-line-info.model";


export class PO_R_ProcOrderSubItemsResponse extends GlobalResponseObject {
    data?: ProcessingOrderProductSubLineInfo[];
}

