export class FgWhReqLocationReportRawQueryDto {
    scan_start_time: string; // whH.scan_start_time
    floor: string; // whL.floor
    fg_color: string; // intS.fg_color
    style: string; // intS.style
    customer_name: string; // intS.customer_name
    product_name: string; // intS.product_name
    po_number: string; // intS.po_number
    fg_wh_req_sub_lines: string[]; // fg_wh_req_sub_lines
    location: string; // whSl.location
    crtn_ids: string; // GROUP_CONCAT(DISTINCT crt.id)
    crtn_count: number; // COUNT(DISTINCT crt.id)
    total_required_qty: number; // SUM(crt.required_qty)
}