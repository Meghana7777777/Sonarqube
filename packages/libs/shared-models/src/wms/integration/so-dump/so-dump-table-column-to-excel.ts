export const soDumpTableColumnToExcelColumnMap = new Map([
    ['SO', 'saleOrderCode'],
    ['SO Item', 'saleOrderItemCode'],
    ['Customer Code', 'customerCode'],
    ['Customer Name', 'customerName'],
    ['Comp Code', 'companyCode'],
    ['Company Code', 'companyName'],
    ['Business Head', 'userUnitCode'],
    ['Profit Center', 'profitCenterCode'],
    ['Profit Center Name', 'profitCenterName'],
    ['Style', 'style'],
    ['Customer Styles Design No', 'styleCode'],
    ['Product Division', 'productName'],
    ['Buyer Dept.', 'buyerName'],
    ['Style Desc', 'styleDesc'],
    ['BPO .', 'buyerPo'],
    ['GMT PO', 'gmtPo'],
    ['GMT PO Item', 'gmtPoItem'],
    ['GMT Vendor', 'gmtVenderCode'],
    ['GMT Vendor Desc', 'gmtVenderCompany'],
    ['True Manufacturer', 'gmtVenderUnit'],
    ['BOM Component', 'itemCode'],
    ['Desc of BOM Comp.', 'itemName'],
    ['BOM Comp Long Text', 'itemDesc'],
    ['PO No', 'spoNumber'],
    ['PO Item', 'poItemLine'],
    ['Supplier/ Work Center', 'supplierCode'],
    ['Supplier/ Work Center Desc', 'supplierName'],
    ['GMT PO Qty', 'saleOrderItemQty'],
    ['PO Qty', 'quantity'],
    ['Unit Of Measure', 'uom'],
    ['SO Creation Date', 'spoCreatedDate'],
    ['SO Closed Date', 'spoDeliveryDate'],
    ['Planned Cut Date','plannedCutDate'],
    ['Ex-factory Date','plannedProductionDate'],
    ['BPO Delivery Date','plannedDeliveryDate'],
    ['Fabric Meters','fabricMeters'],
]);

class ExcelUploadValidator {
    type: string;
    maxLength: number;
    strictTypeCheck: boolean;
    required: boolean;
    isTrimPrefix: boolean;
    label: string
}

export const soDumpExcelUploadValidatorMap: Map<string, ExcelUploadValidator> = new Map([
    ['saleOrderCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO', isTrimPrefix: true }],
    ['saleOrderItemCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Item', isTrimPrefix: true }],
    ['customerCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Code', isTrimPrefix: true }],
    ['customerName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Name', isTrimPrefix: false }],
    ['companyCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Comp Code', isTrimPrefix: true }],
    ['companyName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Company Code', isTrimPrefix: false }],
    ['userUnitCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Business Head', isTrimPrefix: false }],
    ['profitCenterCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center', isTrimPrefix: true }],
    ['profitCenterName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center Name', isTrimPrefix: false }],
    ['style', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Style', isTrimPrefix: false }],
    ['styleCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Styles Design No', isTrimPrefix: false }],
    ['productName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Product Division', isTrimPrefix: false }],
    ['buyerName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Buyer Dept.', isTrimPrefix: false }],
    ['styleDesc', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Style Desc', isTrimPrefix: false }],
    ['buyerPo', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'BPO .', isTrimPrefix: false }],
    ['gmtPo', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'GMT PO', isTrimPrefix: true }],
    ['gmtPoItem', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'GMT PO Item', isTrimPrefix: true }],
    ['gmtVenderCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'GMT Vendor', isTrimPrefix: true }],
    ['gmtVenderCompany', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'GMT Vendor Desc', isTrimPrefix: false }],
    ['gmtVenderUnit', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'True Manufacturer', isTrimPrefix: false }],
    ['itemCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'BOM Component', isTrimPrefix: false }],
    ['itemName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Desc of BOM Comp.', isTrimPrefix: false }],
    ['itemDesc', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'BOM Comp Long Text', isTrimPrefix: false }],
    ['spoNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'PO No', isTrimPrefix: true }],
    ['poItemLine', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'PO Item', isTrimPrefix: true }],
    ['supplierCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Supplier/ Work Center', isTrimPrefix: true }],
    ['supplierName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Supplier/ Work Center Desc', isTrimPrefix: false }],
    ['saleOrderItemQty', { type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'GMT PO Qty', isTrimPrefix: false }],
    ['quantity', {
        type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'PO Qty', isTrimPrefix: false
    }],
    ['uom', {
        type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Unit Of Measure', isTrimPrefix: false
    }],
    ['spoCreatedDate', {
        type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'Unit Of Measure', isTrimPrefix: false
    }],
    ['spoDeliveryDate', {
        type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'Unit Of Measure', isTrimPrefix: false
    }],
    ['plannedCutDate', {
        type: 'string', strictTypeCheck: true, maxLength: 25, required: false, label: 'Planned Cut Date', isTrimPrefix: false
    }],
    ['plannedProductionDate', {
        type: 'string', strictTypeCheck: true, maxLength: 25, required: false, label: 'Ex-factory Date', isTrimPrefix: false
    }],
    ['plannedDeliveryDate', {
        type: 'string', strictTypeCheck: true, maxLength: 25, required: false, label: 'BPO Delivery Date', isTrimPrefix: false
    }],
    ['fabricMeters', {
        type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'Fabric Meters', isTrimPrefix: false
    }],
]);
