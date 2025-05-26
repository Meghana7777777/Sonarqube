export const tableColumnToExcelColumnMap = new Map([
    ['Lot Number', 'lotNumber'],
    ['Object Number', 'externalRollNumber'],
    ['Object Category','itemCategory'],
    ['Material Item Code', 'materialItemCode'],
    ['Object Length', 'inputQuantity'],
    ['Uom', 'inputQuantityUom'],
    ['Object Width', 'inputWidth'],
    ['Width UOM', 'inputWidthUom'],
    ['Color', 'itemColor'],
    ['PO Number', 'poNumber'],
    ['PO Line Item Number', 'poLineItemNo'],
    ['gsm', 'gsm'],
    ['Mill Shade Reference', 'shade'],
    ['Style-ref-number', 'itemStyle'],
    ['Object Type', 'objectType'],
    ['net-weight-Kg', 'netWeight'],
    ['gross-weight-Kg', 'grossWeight'],
    ['Lot remarks', 'lotRemarks']
]);

class ExcelUploadValidator {
    type: string;
    maxLength: number;
    strictTypeCheck: boolean;
    required: boolean;
    label: string
}

export const excelUploadValidatorMap: Map<string, ExcelUploadValidator> = new Map([
    ['lotNumber', { type: 'string', strictTypeCheck: true, maxLength: 15, required: true, label: 'Lot Number' }],
    ['externalRollNumber', { type: 'string', strictTypeCheck: false, maxLength: 15, required: true, label: 'Object Number' }],
    ['materialItemCode', { type: 'number', strictTypeCheck: true, maxLength: 2, required: true, label: 'Material Item Code' }],
    ['inputQuantity', { type: 'string', strictTypeCheck: false, maxLength: 8, required: true, label: 'Object Length' }],
    ['inputQuantityUom', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Uom' }],
    ['inputWidth', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Object Width' }],
    ['inputWidthUom', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Width UOM' }],
    ['poNumber', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'PO Number' }],
    ['gsm', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'gsm' }],
    ['shade', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Mill Shade Reference' }],
    ['objectType', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Object Type' }],
    ['itemCategory', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'Object Category' }],
    ['netWeight', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'net-weight-Kg' }],
    ['grossWeight', { type: 'string', strictTypeCheck: true, maxLength: 30, required: true, label: 'gross-weight-Kg' }],
    ['lotRemarks', { type: 'string', strictTypeCheck: true, maxLength: 30, required: false, label: 'Lot remarks' }],
    ['itemColor', { type: 'string', strictTypeCheck: true, maxLength: 30, required: false, label: 'Color' }],
    ['poLineItemNo', { type: 'string', strictTypeCheck: true, maxLength: 30, required: false, label: 'PO Line Item Number' }],
    ['itemStyle', { type: 'string', strictTypeCheck: true, maxLength: 30, required: false, label: 'Style-ref-number' }]
]);