import { GrnStatusEnum } from "@xpparel/shared-models";

export class BatchLotItemQtyResp {
    packing_list_id: number;
    batch_number: number;
    lot_number: string;
    item_code: string;
    packing_list_quantity: number;
    grn_status: GrnStatusEnum;
}