import { OrderTypeEnum } from "@xpparel/shared-models";

export class PoSizeQtysQueryResponse {
    size: string;
    quantity: number;
    oq_type: OrderTypeEnum;
    po_oq_id: number;
}