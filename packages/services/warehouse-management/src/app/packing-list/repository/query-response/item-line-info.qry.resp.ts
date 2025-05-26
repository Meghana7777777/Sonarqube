import { InsInspectionStatusEnum, PhItemLinesObjectTypeEnum, PhLinesGrnStatusEnum } from "@xpparel/shared-models";

export class ItemLineInfoQueryResp {
    roll_id: number;
    object_type: PhItemLinesObjectTypeEnum;
    object_sys_no: number;
    s_width: number;
    s_length: number;
    s_shade: string;
    s_sk_length:number;
    s_sk_width:number;
    s_sk_group: string;
    gross_weight:number;
    qr_code: string;
    i_q_uom: string;
    // preffered_uom: string;
    s_quantity:number;
    allocated_quantity:number;
    issued_quantity:number;
    return_quantity:number;
    inspection_status:InsInspectionStatusEnum;
    grn_status:PhLinesGrnStatusEnum;
    is_released: boolean;
    inspection_pick: boolean;
    ph_items_id: number;
    print_status: boolean;
}