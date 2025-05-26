import { OrderTypeDisplayValues, OrderTypeEnum, PoLinesModel } from "@xpparel/shared-models";
import { CustomColumn } from "../../../../schemax-component-lib";


export type ExtendedOrderTypeEnum = OrderTypeEnum | 'Total';
export interface IOQUpdatePoLineColumns {
    poLineId: number;
    soLineId: number;
    orderLineNo: string;
    productType: string;
    productName: string;
    orderQtyType: ExtendedOrderTypeEnum;
    rowSpan: number;
    [key: string]: any;
}


export const OQUpdatePoLineColumns: CustomColumn<IOQUpdatePoLineColumns>[] = [
    {
        title: 'Order Line', dataIndex: 'orderLineNo', key: 'orderLineNo', align:'center', isDefaultSelect: true,fixed:'left',
        onCell: (record, index,) => {
            return { rowSpan: record.orderQtyType === OrderTypeEnum.ORIGINAL ? record.rowSpan : 0 }
        }
    },
    {
        title: 'Product Type', dataIndex: 'productType', key: 'productType', align:'center', isDefaultSelect: true,fixed:'left',
        onCell: (record, index,) => {
            return { rowSpan: record.orderQtyType === OrderTypeEnum.ORIGINAL ? record.rowSpan : 0 }
        }
    },
    {
        title: 'Product Name', dataIndex: 'productName', key: 'productName', align:'center', isDefaultSelect: true,fixed:'left',
        onCell: (record, index,) => {
            return { rowSpan: record.orderQtyType === OrderTypeEnum.ORIGINAL ? record.rowSpan : 0 }
        }
    },
    {
        title: 'Order Qty Type', dataIndex: 'orderQtyType', key: 'orderQtyType', align:'center', isDefaultSelect: true,fixed:'left', render: (text: ExtendedOrderTypeEnum, record) => {
            return text === 'Total' ? <b>Total</b> : OrderTypeDisplayValues[text]
        }
    }
]





