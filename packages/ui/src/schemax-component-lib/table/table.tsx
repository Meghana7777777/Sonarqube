import { Table, TableProps } from "antd"
import { ColumnProps } from "antd/es/table";
import { Ref } from "react";
import type { Reference } from 'rc-table';

export const ScxTable = (props: React.PropsWithChildren<TableProps<any>> & {
    ref?: Ref<Reference>;
}) => {
    return (
        <Table {...props} />
    )
}

export default ScxTable;
export enum summeryCriteriaEnum {
    SUM = 'SUM',
    COUNT = 'COUNT'
}
export type CustomColumn<T> = ColumnProps<T> & {
    dataIndex: keyof T;
    isDefaultSelect?: boolean;
    isSummaryColumn?: boolean;
    summaryLabel?: string;
    criteria?: summeryCriteriaEnum;
    key: string,
    // align?: any
};