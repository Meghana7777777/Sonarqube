
export class orderAndOrderlineQueryResponse {
    order_no: string;
    order_line_no: string;
    plant_style: string;
    style_description: string;
    style_code: string;
    style_name: string;
    garment_vendor_code: string;
    garment_vendor_name: string;
    garment_vendor_po_item: string;
    garment_vendor_po: string;
    buyer_loc: string;
    customer_name: string;
    customer_code: string;
    profit_center_code: string;
    profit_center_name: string;
    product_name: string;
    product_category: string;
}

export class OrderWithSelectedFieldsResponse {
    orderNo: number;
    plantStyleReference: string;
    pcdDate: string;
    plannedOrderLineCutDate: Date;
    plannedProductionDate: Date;
    plannedDeliveryDate: Date;
}

