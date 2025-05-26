export class LocationRelatedDataQryResp {
    id: number;
    empty_containers: number;
    total_containers: number;
    no_of_cartons_in_location: number;
    no_of_bails_in_location: number;
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
    carton_ids: string;
    grn_completed_cartons_count: number;
    grn_pending_cartons_count: number;
    grn_completed_length: number;
    grn_pending_length: number;
    allocated_qty: number;
    issued_qty:number;
    allocated_cartons: number;
    issued_cartons: number;
    style: string;
}