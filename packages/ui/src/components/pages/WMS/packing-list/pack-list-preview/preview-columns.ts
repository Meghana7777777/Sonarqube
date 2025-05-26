import { CustomColumn, summeryCriteriaEnum } from "../../../../../schemax-component-lib";
import { RollInfoModelExtends } from "./packing-list-preview";


export const packListPreviewColumns: CustomColumn<RollInfoModelExtends>[] = [
    {
        title: 'Sno',
        dataIndex: 'objectSeqNumber',
        key: 'objectSeqNumber',
        align: 'center',
        isDefaultSelect: true,
        isSummaryColumn: false,
    },
    {
        title: 'PO Number',
        dataIndex: 'poNumber',
        align: 'center',
        key: 'poNumber',
        isDefaultSelect: true,
        isSummaryColumn: false,
    },
    {
        title: 'PO Line Item Number',
        dataIndex: 'poLineItemNo',
        align: 'center',
        key: 'poLineItemNo',
        isDefaultSelect: false,
        isSummaryColumn: false,
    },
    {
        title: 'Item Code',
        dataIndex: 'materialItemCode',
        align: 'center',
        key: 'materialItemCode',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    {
        title: 'Object Type',
        dataIndex: 'objectType',
        align: 'center',
        key: 'objectType',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    {
        title: 'Lot Number',
        dataIndex: 'lotNumber',
        align: 'center',
        key: 'lotNumber',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    {
        title: 'Object Number',
        dataIndex: 'externalRollNumber',
        align: 'center',
        key: 'externalRollNumber',
        isDefaultSelect: true,
        isSummaryColumn: true,
        summaryLabel: 'Total Count',
        criteria: summeryCriteriaEnum.COUNT
    },
    {
        title: 'Item Category',
        dataIndex: 'itemCategory',
        align: 'center',
        key: 'itemCategory',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    {
        title: 'Item Name',
        dataIndex: 'materialItemName',
        align: 'center',
        key: 'materialItemName',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    {
        title: 'Item Description',
        dataIndex: 'materialItemDesc',
        align: 'center',
        key: 'materialItemDesc',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'Mill Shade Reference',
        dataIndex: 'shade',
        align: 'center',
        key: 'shade',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'Object Quantity',
        dataIndex: 'inputLength',
        align: 'center',
        key: 'inputLength',
        isDefaultSelect: true,
        isSummaryColumn: true,
        summaryLabel: 'Total Objects',
        criteria: summeryCriteriaEnum.SUM
    },
    {
        title: 'UOM',
        dataIndex: 'inputLengthUom',
        align: 'center',
        key: 'inputLengthUom',
        isDefaultSelect: true,
        isSummaryColumn: false
    },
    // {
    //     title: 'Object Meterage',
    //     dataIndex: 'supplierQuantity',
    //     align: 'center',
    //     key: 'supplierQuantity',
    //     isDefaultSelect: true,
    //     isSummaryColumn: true,
    //     summaryLabel: 'Total Meterage',
    //     criteria: summeryCriteriaEnum.SUM
    // },
    // {
    //     title: 'Object Width',
    //     dataIndex: 'inputWidth',
    //     align: 'center',
    //     key: 'inputWidth',
    //     isDefaultSelect: true,
    //     isSummaryColumn: false
    // },
    // {
    //     title: 'UOM',
    //     dataIndex: 'inputWidthUom',
    //     align: 'center',
    //     key: 'inputWidthUom',
    //     isDefaultSelect: true,
    //     isSummaryColumn: false
    // },
    // {
    //     title: 'Roll Width CM',
    //     dataIndex: 'supplierWidth',
    //     align: 'center',
    //     key: 'supplierWidth',
    //     isDefaultSelect: true,
    //     isSummaryColumn: false
    // },
    {
        title: 'GSM',
        dataIndex: 'gsm',
        align: 'center',
        key: 'gsm',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'net-weight-Kg',
        dataIndex: 'netWeight',
        align: 'center',
        key: 'netWeight',
        isDefaultSelect: false,
        isSummaryColumn: false,
    },
    {
        title: 'gross-weight-Kg',
        dataIndex: 'grossWeight',
        align: 'center',
        key: 'grossWeight',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'Color',
        dataIndex: 'itemColor',
        align: 'center',
        key: 'itemColor',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'Style Ref Number(PL Upload)',
        dataIndex: 'itemStyle',
        align: 'center',
        key: 'itemStyle',
        isDefaultSelect: false,
        isSummaryColumn: false
    },
    {
        title: 'Lot Level Remarks',
        dataIndex: 'lotLevelRemarks',
        align: 'center',
        key: 'lotLevelRemarks',
        isDefaultSelect: false,
        isSummaryColumn: false
    }
];