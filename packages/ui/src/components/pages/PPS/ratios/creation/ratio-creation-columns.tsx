import { CustomColumn } from "../../../../../schemax-component-lib";

export interface IRatioCreationSizeQtyColumns {
    title: string;
    [key: string]: any;
}
export const poRatioCreateColumns: CustomColumn<IRatioCreationSizeQtyColumns>[] = [
    { title: 'Sizes', dataIndex: 'title', key: 'title', isDefaultSelect: true, width: '30px', align: 'center'}
]

export interface IRatioSummaryColumns {
    ratioCode: string;
    fabric: string;
    plies: number;
    productName: string;
    fgColor: string;
    rowSpan: number;
    remarks: string;
    [key: string]: any;
}
export const poRatioSummaryColumns: CustomColumn<IRatioSummaryColumns>[] = [
    {
        title: 'Ratio Code', dataIndex: 'ratioCode', key: 'ratioCode', isDefaultSelect: true, align:'center',
        onCell: (record, index,) => {
            return { rowSpan: record.rowSpan }
        },
        render: (text) => text ? `R-${text}` : ''
    },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName', isDefaultSelect: true,align:'center', },
    { title: 'FG Color', dataIndex: 'fgColor', key: 'fgColor', isDefaultSelect: true,align:'center', },
    { title: 'Fabric', dataIndex: 'fabricName', key: 'fabricName', isDefaultSelect: true,align:'center', },
    { title: 'Plies', dataIndex: 'plies', key: 'plies', isDefaultSelect: true,align:'center', },
    {
        title: 'Remarks', dataIndex: 'remarks', key: 'remarks', isDefaultSelect: true,align:'center',
        onCell: (record, index,) => {
            return { rowSpan: record.rowSpan }
        },
    }
]

export enum ratiosCreateRemarksEnum {
    CLONE = 'clone',
    SANDWICH_CUT_WITH_CLONE = 'sandwich cut with clone',
    SHARING = 'sharing',
    NORMAL = 'normal',
}




