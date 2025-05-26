import { Button, Table } from "antd";
import { IKnitJobSummary, knitMaterialJobsSheetColumns } from "./knit-material-interface";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";


export interface TableDataProps {
    knitTableData: IKnitJobSummary[];
    handleView: (jobNumber: string) => void;
    rowSelection: TableRowSelection<IKnitJobSummary>;
    handleRequest: () => void;
    selectedProcessingSerial: number,
    searchTrigger: number;
    handleKeyChange: (key: string) => void;
    resetTrigger:number;
}





const MaterialReqCreation = (props: TableDataProps) => {
    const { knitTableData, handleView, rowSelection, handleRequest } = props;
    const [pageSize, setPageSize] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    return (
        <>
            <Table
                size="small"
                columns={knitMaterialJobsSheetColumns(handleView)}
                dataSource={knitTableData}
                bordered
                rowKey={record => record.knitJobNumber}
                pagination={{
                    pageSize: pageSize,
                    onChange(current, pageSize) {
                        setPage(current);
                        setPageSize(pageSize);
                    },
                }} scroll={{ x: 'max-content' }}
                style={{ minWidth: '100%' }}
                rowSelection={rowSelection}
            />

            <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", }} >
                <Button type='primary' className='btn-orange' onClick={handleRequest} > Request </Button>
            </div>
        </>
    )
}


export default MaterialReqCreation;