
export class FabLevelProdNameQueryResponse {
    product_name: string; // csv string
    product_type: string; // csv string
    item_code: string; // 1 value   
}


export class FabricColorAndItemInfo {
    po_serial: string;
    fg_color: string;
    product_type: string;
    product_name: string;
    avg_cons: string;
    item_code: string;
    ratio_name: string;
    ratio_code: string;
    ratio_desc: string;
    plies: number;
    max_plies: number;
    totratio: number;
    marker_length: number;
    wastage: number;
    binding_cons: number;
    is_main_fabric: boolean;
    is_binding: boolean;
    createdDate: Date;
}