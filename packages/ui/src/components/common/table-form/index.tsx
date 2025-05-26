import { Table, Button, Form, Space } from 'antd';
import { PlusCircleOutlined, EditOutlined, MinusCircleOutlined } from "@ant-design/icons";
import React from 'react';
import './table-form.css'

export interface ITableFormProps {
    dataSource: any[],
    add: () => void;
    remove: (indexToRemove: number) => void;
    columns: any;
    hideAdd?: boolean;
    hideDelete?: boolean;
    bordered: boolean
}
export const TableForm = (props: ITableFormProps) => {
    const { dataSource, add, remove, columns, hideAdd, bordered, hideDelete } = props;
    if (!hideAdd) {
        columns.push({
            title: "Action",
            dataIndex: 'action',
            align:'center',
            render: (value, row, index) => {
                return (
                    <span>
                        {!hideDelete && <MinusCircleOutlined style={{ color: 'red' }} onClick={() => { remove(row.name) }} />}
                    </span>
                );
            }
        });
    }
    return (
        <Table
            size='small'
            bordered={bordered}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            footer={() => <Space style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                {!hideAdd && <Button  className='btn-orange' onClick={() => add()} type='primary'>
                    <PlusCircleOutlined />
                </Button>}
            </Space>}
        ></Table>
    )
}

export default TableForm;