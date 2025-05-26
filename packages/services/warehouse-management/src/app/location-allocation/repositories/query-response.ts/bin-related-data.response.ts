export class BinRelatedDataQryResp {
    id: number;
    empty_pallets: number;
    total_pallets: number;
    no_of_rolls_in_bin: number;
    no_of_bails_in_bin: number;
    count_open: number;
    count_inprogress: number;
    count_completed: number;
    total_sQuantity_open: number;
    total_sQuantity_inprogress: number;
    total_sQuantity_completed: number;
    total_allocatedQty_open: number;
    total_allocatedQty_inprogress: number;
    total_allocatedQty_completed: number;
    itemCodes: string;
    inspectionStatuses: string;
    roll_ids: string;
    grn_completed_rolls_count: number;
    grn_pending_rolls_count: number;
    grn_completed_length: number;
    grn_pending_length: number;
    allocated_qty: number;
    issued_qty:number;
    allocated_rolls: number;
    issued_rolls: number;
    style: string;
}