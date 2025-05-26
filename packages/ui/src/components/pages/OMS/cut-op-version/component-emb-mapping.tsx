import React, { useEffect, useState } from 'react';
import { Table, Select, Button, InputNumber, TableProps } from 'antd';
import { IComponentEmb } from './op-routing-interface';



interface Props {
    compEmbData: IComponentEmb[];
    updateOpGroup: (opGroups: IComponentEmb[]) => void;
    isEditable: boolean;
}
const operationCodes = [
    {
        "opCategory": "CUT",
        "eOpCode": "40",
        "opForm": "PANEL_FORM",
        "opCode": "40",
        "opName": "Emb In",
        "opSeq": 0,
        "group": "",
        "smv": 0,
        "machineName": null
    },
    {
        "opCategory": "CUT",
        "eOpCode": "50",
        "opForm": "PANEL_FORM",
        "opCode": "50",
        "opName": "EMD Out",
        "opSeq": 0,
        "group": "",
        "smv": 0,
        "machineName": null
    },
]
const ComponentEmbMapping: React.FC<Props> = ({ compEmbData, updateOpGroup, isEditable }) => {
    const [dataSource, setDataSource] = useState<IComponentEmb[]>([]);
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        setDataSource(compEmbData);
        setSelectedRows([]);
    }, [compEmbData.length]);



    // Columns for the table
    const columns = [
        {
            title: 'Component',
            dataIndex: 'componentName',
            width: '40%',
        },
        {
            title: 'Emb Operations',
            dataIndex: 'operationCodes',
            render: (v: any, record: any) => (
                <Select
                    size='small'
                    defaultValue={v}
                    disabled={!isEditable || !selectedRows.includes(record.key)}
                    mode='multiple'
                    onChange={(value) => handleOpGroupChange(value, record.key)}
                    style={{ width: '100%' }}
                >
                    {operationCodes.map((opObj) => (
                        <Select.Option key={opObj.opCode} value={opObj.opCode}>
                            {`${opObj.opCode}-${opObj.opName}`}
                        </Select.Option>
                    ))}
                </Select>
            ),
            width: '60%',
        },
    ];

    // Handle OP Group change for a specific row
    const handleOpGroupChange = (value: string[], key: string) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => item.key === key);
        if (index > -1) {
            newData[index].operationCodes = value;
            setDataSource(newData);
            updateOpGroup(newData)
        }


    };
    const handleSelectChange = (selectedRowKeys: string[]) => {
        setSelectedRows(selectedRowKeys);

        const selectedKeySet = new Set(selectedRowKeys);
        const newData = dataSource.map(row =>
            selectedKeySet.has(row.key)
                ? row
                : { ...row, operationCodes: [] }
        );

        setDataSource(newData);
        updateOpGroup(newData);
    };

    const rowSelection: TableProps<IComponentEmb>['rowSelection'] = {
        selectedRowKeys: selectedRows,
        onChange: handleSelectChange,
        getCheckboxProps: (record: IComponentEmb) => ({
            disabled: !isEditable, // Column configuration not to be checked
        }),
    };
    return (
        <div>
            {dataSource.length > 0 &&
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
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

export default ComponentEmbMapping;
