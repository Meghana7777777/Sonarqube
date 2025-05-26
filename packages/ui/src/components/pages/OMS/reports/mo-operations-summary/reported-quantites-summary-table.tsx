import { Table } from "antd"

const tblRowKeyValues = {
    total_completed_qty: 'total_completed_qty', // Total Completed Quantity
    total_rejected_qty: 'total_rejected_qty', //Total Rejected Quantity
}

export const MoOperationSummaryTable = () => {

    const ProcessTypeColumns = [
        {
            title: 'Total Quantites',
            dataIndex: 'totalQtys',
            key: 'totalQtys',
            width: '200px'
        },
        {
            title: 'Knit',
            dataIndex: 'knit',
            key: 'knit',
            width: '80px'
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            width: '80px'
        },
        {
            title: 'Sew',
            dataIndex: 'sew',
            key: 'sew',
            width: '80px'
        },
        {
            title: 'Pack',
            dataIndex: 'pack',
            key: 'pack',
            width: '80px'
        },
    ]
    return (
        <>
            <div>
                <Table size="small" columns={ProcessTypeColumns} bordered />
            </div>
        </>
    )
}