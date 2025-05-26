import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Tooltip } from 'antd';
import { PoFabricRatioModel } from '@xpparel/shared-models';
import './summary.css';
import { ColumnsType } from 'antd/es/table';
interface IRatioSummaryProps {
    ratioData: PoFabricRatioModel[]
}
interface IColumns extends PoFabricRatioModel {
    total: number;
    isHavingPendingQty: boolean;
    [key: string]: any;
}
interface IRowSpanIndex {
    start: number;
    end: number;
}
const RatioSummaryTable: React.FC<IRatioSummaryProps> = ({ ratioData }) => {
    // Extract unique sizes from the data
    const sizes = Array.from(new Set(ratioData.flatMap(item => item.poQtys.map(qty => qty.size))));
    const [tblData, setTblData] = useState<IColumns[]>([]);
    const [tblColumns, setTblColumns] = useState<ColumnsType<IColumns>>([]);
    useEffect(() => {
        if (ratioData) {
            constructTblData(ratioData);
        }
    }, [])
    const constructTblData = (ratioDataPar: PoFabricRatioModel[]) => {
        const ratiosData: PoFabricRatioModel[] = JSON.parse(JSON.stringify(ratioDataPar));
        ratiosData.sort((a, b) => (a.iCode > b.iCode) ? 1 : ((b.iCode > a.iCode) ? -1 : 0));
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
        // Transform data to include columns for each size
        const dataSource = ratiosData.map((item, index) => {
            const { iCode } = item;
            colspanTypeMap.set(iCode, colspanTypeMap.has(iCode) ? { start: colspanTypeMap.get(iCode).start, end: colspanTypeMap.get(iCode).end + 1 } : { start: index, end: 1 });
            let isHavingPendingQty = false;
            const sizesData = {};
            item.poQtys.forEach(qty => {
                const orderQty = qty.originalQuantity + qty.addQuantity;
                sizesData[qty.size] = orderQty
                if (orderQty - qty.ratioQuantity > 0) {
                    isHavingPendingQty = true;
                }
            });
            const total = item.poQtys.reduce((acc, qty) => acc + qty.originalQuantity + qty.addQuantity, 0);
            // const ratioQty = item.poQtys.reduce((acc, qty) => acc + qty.ratioQuantity, 0);
            // const pendingQty = total - ratioQty;
            return {
                ...item,
                ...sizesData,
                total,
                isHavingPendingQty
            };
        });
        setTblData(dataSource);
        constructColumns(colspanTypeMap)
    }
    const constructColumns = (rowSpanMap: Map<string, IRowSpanIndex>) => {
        // Define dynamic columns for each size
        const columns: ColumnsType<IColumns> = [
            {
                title: 'RM SKU',
                dataIndex: 'iCode',
                key: 'iCode',
                width: 100,
                align: 'center',
                fixed: 'left',
                render: (iCode) => {
                    return <Space>{iCode}<span className='color-circle'></span></Space>
                },
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.iCode).start) {
                        return { rowSpan: rowSpanMap.get(record.iCode).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Product Type',
                dataIndex: 'prodcutTypes',
                key: 'prodcutTypes',
                width: 150,
                align: 'center',
                fixed: 'left',
                // render: (productTypes) => productTypes,
            },
            {
                title: 'Component',
                dataIndex: 'component',
                key: 'component',
                width: 150,
                align: 'center',
                fixed: 'left',
                // render: (productNames) => productNames,
            },
            {
                title: 'Product Name',
                dataIndex: 'productNames',
                key: 'productNames',
                width: 150,
                align: 'center',
                fixed: 'left',
                render: (productNames) => productNames,
            },
            {
                title: 'FG Color',
                dataIndex: 'fgColor',
                key: 'fgColor',
                width: 150,
                align: 'center',
                fixed: 'left',
                render: (fgColor) => fgColor,
            },


        ];
        sizes.forEach(size => (columns.push({
            title: size,
            dataIndex: size,
            key: size,
            align: 'center',
            render: (orderQty, record: PoFabricRatioModel) => {
                const sizeObj = record.poQtys.find(qty => qty.size === size);
                const ratioQty = sizeObj ? sizeObj.ratioQuantity : 0;
                const pendingQty = (orderQty ? orderQty : 0) - ratioQty;
                const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                return <>
                    <Space  size={2}>
                        <Space size={2} direction='vertical'>
                            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty ? orderQty : 0}</Tag></Tooltip>
                            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Ratio Qty'><Tag className='s-tag' color="#da8d00">{ratioQty}</Tag></Tooltip>
                        </Space>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={pendingQty > 0 ? 'Pending Qty' : "Excess Qty"}><Tag style={{ height: '48px',paddingTop:'11px' }} color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
                    </Space>
                </>
            },
        })))
        const totalColumn: ColumnsType<IColumns> = [{
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'center',
            render: (_: any, record: PoFabricRatioModel) => {
                let orderQty = 0;
                let ratioQty = 0;
                let pendingQty = 0;
                let excessQty = 0;

                record.poQtys.forEach(poQty => {
                    const oQty = poQty.originalQuantity + poQty.addQuantity;
                    const rQty = poQty.ratioQuantity;
                    const pQty = oQty - rQty;
                    pQty > 0 ? pendingQty += pQty : excessQty += pQty;
                    orderQty += oQty
                    ratioQty += rQty;
                })
                const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                return <Space direction='vertical' size={2}>
                    <Space size={2}>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty ? orderQty : 0}</Tag></Tooltip>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Ratio Qty'><Tag className='s-tag' color="#da8d00">{ratioQty}</Tag></Tooltip>
                    </Space>
                    <Space size={2}>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Pending Qty'}><Tag className='s-tag' color={pQtyColor}>{pendingQty}</Tag></Tooltip>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Excess Qty'}><Tag className='s-tag' color="#001d24">{Math.abs(excessQty)}</Tag></Tooltip>
                    </Space>
                </Space>
            },
        }];
        columns.push(...totalColumn);
        setTblColumns(columns);
    }




    return (
        <Table
            dataSource={tblData}
            columns={tblColumns}
            size='small'
            bordered
            scroll={{ x: 'max-content' }}
            rowKey={record => record.iCode + record.component}
            pagination={false}
            rowClassName={record => record['isHavingPendingQty'] ? 'i-red' : 'i-green'}
        />
    );
};

export default RatioSummaryTable;
