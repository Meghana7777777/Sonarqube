import { RawOrderInfoModel, RawOrderLineInfoModel, SI_ManufacturingOrderInfoModel, SI_MoLineInfoModel } from "@xpparel/shared-models";
import { CustomColumn } from "../../../../schemax-component-lib";
import { convertBackendDateToLocalTimeZone } from "packages/ui/src/common";
import { ColumnType } from "antd/es/table";

// export const orderSummaryColumns: CustomColumn<RawOrderInfoModel>[] = [
//     { title: 'Mo Number', dataIndex: 'orderNo', key: 'orderNo', isDefaultSelect: true, align: 'center' },
//     { title: 'Customer Style', dataIndex: 'customerStyle', key: 'customerStyle', isDefaultSelect: true, align: 'center' },
//     { title: 'Customer Style Ref', dataIndex: 'customerStyleRef', key: 'customerStyleRef', isDefaultSelect: true, align: 'center' },
//     {
//         title: 'Customer Code', dataIndex: 'customerOrderNo', key: 'customerOrderNo', isDefaultSelect: true, align: 'center', render: (text, record) => {
//             return text ? text : '-'
//         }
//     },
//     { title: 'Customer Name', dataIndex: 'buyerName', key: 'buyerName', isDefaultSelect: true, align: 'center' },
//     { title: 'Pack Method', dataIndex: 'packMethod', key: 'packMethod', isDefaultSelect: true, align: 'center' },
//     { title: 'Total Manufacturing Order Qty', dataIndex: 'quantity', key: 'quantity', isDefaultSelect: true, align: 'center' },
//     { title: 'Plant Style Ref', dataIndex: 'plantStyle', key: 'plantStyle', isDefaultSelect: true, align: 'center' },
//     { title: 'Planned Cut Date', dataIndex: 'plannedCutDate', key: 'quantity', isDefaultSelect: true, align: 'center' },
//     { title: 'Garment Vendor', dataIndex: 'garmentVendor', key: 'garmentVendor', isDefaultSelect: false, align: 'center' },
//     { title: 'True Manufacturer ', dataIndex: 'manufacturer', key: 'manufacturer', isDefaultSelect: false, align: 'center' },
// ]
const getProductsOfMo = (manufacturingOrderData: SI_ManufacturingOrderInfoModel) => {
    const prods = [];
    manufacturingOrderData.moLineModel.map(line => line.moLineProducts.map(product => prods.push(product.productName)));
    return [...new Set(prods)];
};
export const orderSummaryColumns: ColumnType<SI_ManufacturingOrderInfoModel>[] = [
    {
        title: 'S No',
        dataIndex: 'SNo',
        key: 'serialNo',
        align: 'center',
        render: (_, record, index) => index + 1,
    },
    {
        title: 'MO Number',
        dataIndex: 'moNumber',
        key: 'moNumber',
        align: 'center',
    },
    {
        title: 'MO Upload Date',
        dataIndex: 'uploadedDate',
        key: 'uploadedDate',
        align: 'center',
        render: (text) => {
            const date = new Date(text);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    },
    {
        title: 'Style',
        dataIndex: 'style',
        key: 'style',
        align: 'center',
    },
    {
        title: 'Products',
        dataIndex: 'products',
        key: 'products',
        align: 'center',
        render: (_, record) => {
            const products = getProductsOfMo(record);
            return products.join(', ');
        },
    },


];


export const moLineColumns: ColumnType<SI_MoLineInfoModel>[] = [
    {
        title: 'S No',
        dataIndex: 'serialNo',
        key: 'serialNo',
        align: 'center',
        render: (_, record, index) => index + 1,
    },
    {
        title: 'MO Line',
        dataIndex: 'moLineNo',
        key: 'moLineNo',
        align: 'center',
    },
    {
        title: 'Product',
        dataIndex: 'productName',
        key: 'productName',
        align: 'center',
        render: (_, record) => {
            return record.moLineProducts.map((product) => product.productName).join(', ');
        },
    },
    {
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination',
        align: 'center',
        render: (_, record) => {
            return record.moLineAttrs.destinations.join(', ');
        },
    },
    {
        title: 'Delivery Date',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
        align: 'center',
        render: (_, record) => {
            return record.moLineAttrs.delDates
                .map(dateStr => {
                    const date = new Date(dateStr);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                })
                .join(', ');
        },
    },    
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
        render: (_, record) => {
            let quant = 0;
            record.moLineProducts.map(prod =>
                prod.subLines.map(subLine => {
                    quant += subLine.qty;
                })
            );
            return quant;
        },
    },
];

export const OrderLineColumns: CustomColumn<RawOrderLineInfoModel>[] = [
    { title: 'Mo Line No', dataIndex: 'salOrdLineNo', key: 'salOrdLineNo', isDefaultSelect: true, align: 'center' },
    { title: 'Buyer Po', dataIndex: 'buyerPo', key: 'buyerPo', isDefaultSelect: true, align: 'center' },
    { title: 'Destination', dataIndex: 'dest', key: 'dest', isDefaultSelect: true, align: 'center' },
    { title: 'Prod Type', dataIndex: 'prodType', key: 'prodType', isDefaultSelect: true, align: 'center' },
    // { title: 'Ex-Factory', dataIndex: 'exFactory', key: 'packMethod', isDefaultSelect: true, align: 'center' },
    // { title: 'Planned Cut Date', dataIndex: 'plannedCutDate', key: 'plannedCutDate', isDefaultSelect: true, align: 'center', render: (plannedCutDate) =>plannedCutDate ? convertBackendDateToLocalTimeZone(plannedCutDate,true):'0000-00-00'},
    { title: 'Ex-factory Date', dataIndex: 'plannedProductionDate', key: 'plannedProductionDate', isDefaultSelect: true, align: 'center', render: (plannedProductionDate) => plannedProductionDate ? convertBackendDateToLocalTimeZone(plannedProductionDate, true) : '0000-00-00' },
    {
        title: 'BPO Delivery Date', dataIndex: 'plannedDeliveryDate', key: 'plannedDeliveryDate', isDefaultSelect: true, align: 'center', render: (plannedDeliveryDate) => plannedDeliveryDate ? convertBackendDateToLocalTimeZone(plannedDeliveryDate, true) : '0000-00-00'
    },
    { title: 'Total Order Qty', dataIndex: 'quantity', key: 'quantity', isDefaultSelect: true, align: 'center' },
]



export const StylePlannedColumns: CustomColumn<RawOrderInfoModel>[] = [
    { title: 'Planned Cut Date', dataIndex: 'plannedCutDate', key: 'quantity', isDefaultSelect: true, align: 'center' },
    { title: 'Plant Style Ref', dataIndex: 'plantStyle', key: 'plantStyle', isDefaultSelect: true, align: 'center' },
    { title: 'Mo Number', dataIndex: 'orderNo', key: 'orderNo', isDefaultSelect: true, align: 'center' },
    { title: 'Customer Name', dataIndex: 'buyerName', key: 'buyerName', isDefaultSelect: true, align: 'center' },
    { title: 'Customer Style', dataIndex: 'customerStyle', key: 'customerStyle', isDefaultSelect: true, align: 'center' },
]