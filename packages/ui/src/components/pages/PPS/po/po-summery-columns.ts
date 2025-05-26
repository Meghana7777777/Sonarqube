import { PoLinesModel } from "@xpparel/shared-models";
import { CustomColumn } from "../../../../schemax-component-lib";
export interface ISOLineSizeQtyColumns {
    orderIdPk: number;
    orderNo: string;
    poLineId: number;
    productType: string;
    style: string;
    poSerial: number;
    poName: string;
    salOrdLineNo: string;
    color: string;
    [key: string]: any;
}
export interface IPoCreateLineSizeQtyColumns {
    orderIdPk: number;
    orderNo: string;
    poLineId: number;
    productType: string;
    style: string;
    salOrdLineNo: string;
    poSerial?: number;
    color: string;
    [key: string]: any;
}
export const POSummaryColumns: CustomColumn<ISOLineSizeQtyColumns>[] = [
    { title: 'Cut Order Description', dataIndex: 'poDesc', key: 'poDesc', align:'center', isDefaultSelect: true, },
    { title: 'Cut Order Serial', dataIndex: 'poSerial', key: 'poSerial', align:'center',isDefaultSelect: true, },
    { title: 'Product Type', dataIndex: 'productType', key: 'productType', align:'center', isDefaultSelect: true },
    // { title: 'So Line', dataIndex: 'salOrdLineNo', key: 'salOrdLineNo', isDefaultSelect: true },
    // { title: 'Color', dataIndex: 'color', key: 'color', isDefaultSelect: true }
]

export const POCreateColumns: CustomColumn<IPoCreateLineSizeQtyColumns>[] = [
    { title: 'So Line', dataIndex: 'salOrdLineNo', key: 'salOrdLineNo', align:'center', isDefaultSelect: true },
    { title: 'Product Type', dataIndex: 'productType', key: 'productType', align:'center', isDefaultSelect: true },
    { title: 'Product Name', dataIndex: 'poName', key: 'poName', align:'center', isDefaultSelect: true },
    { title: 'Color', dataIndex: 'color', key: 'color', align:'center', isDefaultSelect: true }
]

export const poChildColumns: CustomColumn<PoLinesModel>[] = [
    { title: 'Order Line', dataIndex: 'orderLineNo', key: 'orderLineNo', align:'center', isDefaultSelect: true },
    { title: 'Style', dataIndex: 'style', key: 'style', align:'center', isDefaultSelect: true },
    { title: 'Color', dataIndex: 'color', key: 'color', align:'center', isDefaultSelect: true },
    { title: 'Product Types', dataIndex: 'productType', key: 'productType', align:'center', isDefaultSelect: true },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName', align:'center', isDefaultSelect: true },   
]





