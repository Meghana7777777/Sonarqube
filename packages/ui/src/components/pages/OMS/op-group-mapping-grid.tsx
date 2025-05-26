import React, { useEffect, useState } from 'react';
import { Table, Select, Button, InputNumber } from 'antd';
import { OperationRow } from './order-summaries/op-routing-interface';


interface Props {
    operations: string[];
    opGroupData: OperationRow[];
    updateOpGroup: (opGroups: OperationRow[]) => void;
    isEditable: boolean;
}

const OperationsTable: React.FC<Props> = ({ operations, opGroupData, updateOpGroup, isEditable }) => {
    const [dataSource, setDataSource] = useState<OperationRow[]>([]);
    useEffect(() => {
        setDataSource(opGroupData);
    }, []);



    // Columns for the table
    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            render: (text: string, record: any, index: number) => index + 1,
            width: '10%',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (text: string, record: any) => (
                <span>{record.operation}</span>
            ),
            width: '40%',
        },
        {
            title: 'OP Group',
            dataIndex: 'opGroup',
            render: (_: any, record: any) => (
                <Select
                    size='small'
                    defaultValue={record.opGroup}
                    disabled={!isEditable}
                    onChange={(value) => handleOpGroupChange(value, record.key)}
                    style={{ width: '100%' }}
                >
                    {opGroupData.map((opGroupOj) => (
                        <Select.Option key={opGroupOj.key} value={opGroupOj.opGroupOrder}>
                            {opGroupOj.opGroupOptions}
                        </Select.Option>
                    ))}
                </Select>
            ),
            width: '40%',
        },
    ];

    // Handle OP Group change for a specific row
    const handleOpGroupChange = (value: string, key: string) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => item.key === key);
        if (index > -1) {
            newData[index].opGroup = value;
            setDataSource(newData);
            updateOpGroup(newData)
        }


    };

    return (
        <div>
            {dataSource.length > 0 &&
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="key"
                    pagination={false}
                    bordered
                    size='small'
                    className='op-child-tbl'
                />
            }
        </div>
    );
};

export default OperationsTable;
