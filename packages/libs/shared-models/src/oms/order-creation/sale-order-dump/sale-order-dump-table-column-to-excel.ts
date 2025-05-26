


export const saleOrderDumpTableColumnToExcelColumnMap = new Map([

    ['Company Code', 'companyCode'],
    ['Business Head', 'businessHead'],
    ['Customer Code', 'customerCode'],
    ['Plant Style Ref', 'plantStyleRef'],
    ['Buyer Po', 'buyerPo'],
    ['Co Number', 'coNumber'],
    ['So Number', 'soNumber'],
    ['SO Ref Number', 'soRefNumber'],
    ['SO Item', 'soItem'],
    ['Customer Styles Design No', 'customerStylesDesignNo'],
    ['SO Creation Date', 'soCreationDate'],
    ['SO Closed Date', 'soClosedDate'],
    ['Ex-factory Date', 'exFactoryDate'],
    ['Delivery Date', 'deliveryDate'],
    ['SO Qty', 'soQty'],
    ['Style Code', 'styleCode'],
    ['Profit Center Code', 'profitCenterCode'],
    ['Profit Center Name', 'profitCenterName'],
    ['Pack Method', 'packMethod'],
    ['So Line Number', 'soLineNumber'],
    ['Product Type', 'productType'],
    ['Product Code', 'productCode'],
    ['FG Color', 'fgColor'],
    ['Destination', 'destination'],
    ['zFeature', 'zFeature'],
    ['Size', 'size'],
    ['Quantity', 'quantity'],
]);

class ExcelUploadValidator {
    type: string;
    maxLength: number;
    strictTypeCheck: boolean;
    required: boolean;
    isTrimPrefix: boolean;
    label: string
}

export const saleOrderDumpExcelUploadValidatorMap: Map<string, ExcelUploadValidator> = new Map([
    ['companyCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Company Code', isTrimPrefix: true }],
    ['businessHead', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Business Head', isTrimPrefix: false }],
    ['customerCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Code', isTrimPrefix: true }],
    ['plantStyleRef', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Plant Style Ref', isTrimPrefix: true }],
    ['buyerPo', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Buyer Po', isTrimPrefix: true }],
    ['coNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Co Number', isTrimPrefix: false }],
    ['soNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'So Number', isTrimPrefix: false }],
    ['soRefNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Ref Number', isTrimPrefix: false }],
    ['soItem', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Item', isTrimPrefix: false }],
    ['customerStylesDesignNo', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Customer Styles Design No', isTrimPrefix: false }],
    ['soCreationDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Creation Date', isTrimPrefix: false }],
    ['soClosedDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Closed Date', isTrimPrefix: false }],
    ['exFactoryDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Ex-factory Date', isTrimPrefix: false }],
    ['deliveryDate', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Delivery Date', isTrimPrefix: false }],
    ['soQty', { type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'SO Qty', isTrimPrefix: false }],
    ['styleCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Style Code', isTrimPrefix: false }],
    ['profitCenterCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center Code', isTrimPrefix: true }],
    ['profitCenterName', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Profit Center Name', isTrimPrefix: false }],
    ['packMethod', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Pack Method', isTrimPrefix: false }],
    ['soLineNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'So Line Number', isTrimPrefix: false }],
    ['productType', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Product Type', isTrimPrefix: false }],
    ['productCode', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Product Code', isTrimPrefix: false }],
    ['fgColor', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'FG Color', isTrimPrefix: false }],
    ['destination', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Destination', isTrimPrefix: false }],
    ['zFeature', { type: 'string', strictTypeCheck: true, maxLength: 15, required: false, label: 'zFeature', isTrimPrefix: false }],
    ['size', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Size', isTrimPrefix: false }],
    ['quantity', { type: 'number', strictTypeCheck: true, maxLength: 15, required: true, label: 'Quantity', isTrimPrefix: false }],
]);

export const saleOrderDumpDuplicateValidationKeys = new Set([
    'soNumber',
    'soItem',
    'soLineNumber',
    'productCode',
    'size',
]);

