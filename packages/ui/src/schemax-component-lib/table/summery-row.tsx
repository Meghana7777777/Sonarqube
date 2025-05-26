import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { CustomColumn, summeryCriteriaEnum } from 'packages/ui/src/schemax-component-lib';

const { Text } = Typography;
interface ISummaryRowProps {
    columns: CustomColumn<any>[]
    pageData: readonly any[]
}
export const SummaryRow = (props: ISummaryRowProps) => {
    const { columns, pageData } = props;
    const [summaryMap, setSummaryMap] = useState<Map<any, number>>(new Map())

    useEffect(() => {
        const localMap: Map<any, number> = new Map()
        pageData.forEach(recData => {
            columns.filter(rec => rec?.isSummaryColumn).forEach(column => {
                if (!localMap.has(column.dataIndex)) {
                    if (column.criteria == summeryCriteriaEnum.SUM) {
                        localMap.set(column.dataIndex, Number(recData[column.dataIndex]));
                    } else {
                        localMap.set(column.dataIndex, 1);
                    }
                } else {
                    if (column.criteria == summeryCriteriaEnum.SUM) {
                        localMap.set(column.dataIndex, Number(recData[column.dataIndex]) + Number(localMap.get(column.dataIndex)));
                    } else {
                        localMap.set(column.dataIndex, localMap.get(column.dataIndex) + 1);
                    }
                }
            })
        })
        setSummaryMap(localMap)
    }, [columns, pageData])

    const summaryCells = columns.map((column, index) => {
        if (column?.isSummaryColumn) {
            return (
                <Table.Summary.Cell key={index} index={index}>
                    {column.summaryLabel}&nbsp;:&nbsp;<Text type='success' strong>{column.criteria == summeryCriteriaEnum.SUM ? summaryMap.get(column.dataIndex)?.toFixed(2) : summaryMap.get(column.dataIndex)}</Text>
                </Table.Summary.Cell>
            );
        }
        return <Table.Summary.Cell key={index} index={index} />;
    });

    return <Table.Summary.Row>{summaryCells}</Table.Summary.Row>;
};

export default SummaryRow;