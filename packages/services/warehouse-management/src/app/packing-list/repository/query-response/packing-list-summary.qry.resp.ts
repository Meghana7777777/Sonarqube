import { GrnStatusEnum, InsInspectionStatusEnum } from "@xpparel/shared-models";

export class PackingListSummaryQueryResp {
    id: number;
    batch_count: number;
    lot_count: number;
    roll_count: number;
    s_quantity: number;
    i_q_uom: string;
    grn_status: GrnStatusEnum;
    inspection_status: InsInspectionStatusEnum;
    supplier_code: string;
    pack_list_code: string;
    pack_list_date: Date;
    delivery_date: Date;
    po_numbers: string; // added by Rajesh for perf fix of packing list vehicle info
}