export class SupplierAndPLQryResp {
    id: number;
    supplier_name: string;
    supplier_code: string;
    pack_list_code: string;
    supplier_given_weight: string;
    delivery_date: Date;
    no_of_rolls: number;
    item_code: string;
}

export class ManufacturingOrderItemResponse {
    itemCode: string;
    itemName: string;
    itemDesc: string;
    rolls: string;
    packRollQty: string;
    grnQty: string;
    grnRolls: string;
    allocQty: string;
    issueQty: string;
}

export class TotalRollInformation {
    rollQuantity: number;
    bales: number;
    rolls: number;
}