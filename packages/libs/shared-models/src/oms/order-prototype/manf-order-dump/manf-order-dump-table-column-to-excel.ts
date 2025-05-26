


export const ManufacturingOrderDumpTableColumnToExcelColumnMap = new Map([

    ['Company Code', 'companyCode'],
    ['Business Head', 'businessHead'],
    ['Customer Code', 'customerCode'],
    ['Co Number', 'coNumber'],
    ['Mo Number', 'moNumber'],
    ['MO Ref Number', 'moRefNumber'],
    ['MO Item', 'moItem'],
    ['Customer Styles Design No', 'customerStylesDesignNo'],
    ['MO Creation Date', 'moCreationDate'],
    ['MO Closed Date', 'moClosedDate'],
    ['Ex-factory Date', 'exFactoryDate'],
    ['Delivery Date', 'deliveryDate'],
    ['MO Qty', 'moQty'],
    ['Style Code', 'styleCode'],
    ['Profit Center Code', 'profitCenterCode'],
    ['Profit Center Name', 'profitCenterName'],
    ['Pack Method', 'packMethod'],
    ['Mo Line Number', 'moLineNumber'],
    ['Product Type', 'productType'],
    ['FG Color', 'fgColor'],
    ['Destination', 'destination'],
    ['Schedule', 'schedule'],
    ['Planned Cut Date', 'plannedCutDate'],
    ['Planned Prod Date', 'plannedProdDate'],
    ['zFeature', 'zFeature'],
    ['Size', 'size'],
    ['Quantity', 'quantity'],
    ['Internal  Operation Code', 'internalOperationCode'],
    ['External Operation Code', 'externalOperationCode'],
    ['Operation Sequence', 'operationSequnce'],
    ['Process Type', 'processType'],
    ['SMV', 'smv'],
    ['Item Type', 'itemType'],
    ['Item Code', 'itemCode'],
    ['Item Color', 'itemColor'],
    ['Item UOM', 'itemUOM'],
    ['Item Desc', 'itemDesc'],
    ['Consumption', 'consumption'],
    ['Wastage', 'wastage'],
]);

class ExcelUploadValidator {
    type: string;
    maxLength: number;
    strictTypeCheck: boolean;
    required: boolean;
    isTrimPrefix: boolean;
    label: string
}

export const ManufacturingOrderDumpExcelUploadValidatorMap: Map<string, ExcelUploadValidator> = new Map([
    ['companyCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Company Code', isTrimPrefix: true }],
    ['businessHead', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Business Head', isTrimPrefix: false }],
    ['customerCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Code', isTrimPrefix: true }],
    ['coNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Co Number', isTrimPrefix: false }],
    ['moNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Mo Number', isTrimPrefix: false }],
    ['moRefNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'MO Ref Number', isTrimPrefix: false }],
    ['moItem', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'MO Item', isTrimPrefix: false }],
    ['customerStylesDesignNo', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Styles Design No', isTrimPrefix: false }],
    ['moCreationDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'MO Creation Date', isTrimPrefix: false }],
    ['moClosedDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'MO Closed Date', isTrimPrefix: false }],
    ['exFactoryDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Ex-factory Date', isTrimPrefix: false }],
    ['deliveryDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Delivery Date', isTrimPrefix: false }],
    ['moQty', { type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'MO Qty', isTrimPrefix: false }],
    ['styleCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Style Code', isTrimPrefix: false }],
    ['profitCenterCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center Code', isTrimPrefix: true }],
    ['profitCenterName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center Name', isTrimPrefix: false }],
    ['packMethod', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Pack Method', isTrimPrefix: false }],
    ['moLineNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Mo Line Number', isTrimPrefix: false }],
    ['productType', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Product Type', isTrimPrefix: false }],
    ['fgColor', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'FG Color', isTrimPrefix: false }],
    ['destination', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Destination', isTrimPrefix: false }],
    ['schedule', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Schedule', isTrimPrefix: false }],
    ['plannedCutDate', { type: 'string', strictTypeCheck: true, maxLength: 25, required: false, label: 'Planned Cut Date', isTrimPrefix: false }],
    ['plannedProdDate', { type: 'string', strictTypeCheck: true, maxLength: 25, required: false, label: 'Planned Prod Date', isTrimPrefix: false }],
    ['zFeature', { type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'zFeature', isTrimPrefix: false }],
    ['size', { type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'Size', isTrimPrefix: false }],
    ['quantity', { type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'Quantity', isTrimPrefix: false }],
    ['internalOperationCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Internal Operation Code', isTrimPrefix: false }],
    ['externalOperationCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'External Operation Code', isTrimPrefix: false }],
    ['operationSequnce', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Operation Sequence', isTrimPrefix: false }],
    ['processType', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Process Type', isTrimPrefix: false }],
    ['smv', { type: 'number', strictTypeCheck: true, maxLength: 15, required: false, label: 'SMV', isTrimPrefix: false }],
    ['itemType', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Item Type', isTrimPrefix: false }],
    ['itemCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Item Code', isTrimPrefix: false }],
    ['itemColor', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Item Color', isTrimPrefix: false }],
    ['itemUOM', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Item UOM', isTrimPrefix: false }],
    ['itemDesc', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Item Desc', isTrimPrefix: false }],
    ['consumption', { type: 'number', strictTypeCheck: true, maxLength: 15, required: false, label: 'Consumption', isTrimPrefix: false }],
    ['wastage', { type: 'number', strictTypeCheck: true, maxLength: 15, required: false, label: 'Wastage', isTrimPrefix: false }],
]);

export const ManufacturingOrderDumpDuplicateValidationKeys = new Set([
    'moNumber',
    'moItem',
    'moLineNumber',
    'productCode',
    'size',
    'internalOperationCode',
    'itemCode',
]);

