export enum PackOrderCreationOptionsEnum {
    // MOLINE = "order_line_ref_no",
    DESTINATION = "destination",
    DELIVERYDATE = "planned_delivery_date",
    CUTDATE = "planned_cut_date",
    PRODUCTIONDATE = "planned_production_date",
    COLINE = "co_line",
    BUYERPO = "buyer_po",
    PRODUCTTYPE = "product_type",
    PRODUCTNAME = "product_name",
    PRODUCTCATEGORY = "product_category",
    GARMENTVENDORPO = "garment_vendor_po"

}

export const PackOrderCreationOptionDisplayValues = {
    [PackOrderCreationOptionsEnum.DESTINATION]: "Destination",
    [PackOrderCreationOptionsEnum.DELIVERYDATE]: "Delivery Date",
    [PackOrderCreationOptionsEnum.CUTDATE]: "Plan Cut Date",
    [PackOrderCreationOptionsEnum.PRODUCTIONDATE]: "Plan Production Date",
    [PackOrderCreationOptionsEnum.COLINE]: "co_line",
    [PackOrderCreationOptionsEnum.BUYERPO]: "Buyer Po",
    [PackOrderCreationOptionsEnum.PRODUCTTYPE]: "Product Type",
    [PackOrderCreationOptionsEnum.PRODUCTNAME]: "Product Name",
    [PackOrderCreationOptionsEnum.PRODUCTCATEGORY]: "Product Category",
    [PackOrderCreationOptionsEnum.GARMENTVENDORPO]: "Garment Vendor po"
}
