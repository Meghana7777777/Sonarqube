
export class SoProdTypeCombinationQResponse {
    id: number;
    order_id: number; 
    product_sub_type: string;
    color_desc: string;
    line_ids: string; // CSV of the order line ids. Helpful in retrieving the RM for the line ids
    style_description: string;
    style_code: string;
    style_name: string;
    sub_product_name: string;

}