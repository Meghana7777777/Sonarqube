import React, { useState } from 'react';
import { Table, Button, Modal, Row, Col, Tag, Card, List, Divider } from 'antd';
import { useEffect } from 'react';
import { IMOP_OpRoutingBomList, ISelectedSubProcess } from './bom-op-interface';
import { ColumnProps, TableProps } from 'antd/es/table';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ProcessTypeEnum } from '@xpparel/shared-models';




interface IProps {
    selectedSubProcessData: ISelectedSubProcess;
    saveBom: (bomData: IMOP_OpRoutingBomList[]) => void;
}
const columnsBom: TableProps<IMOP_OpRoutingBomList>['columns'] = [
    {
        title: 'BOM Item Code',
        dataIndex: 'bomItemCode',
        key: 'bomItemCode',
    },
    {
        title: 'BOM Item Description',
        dataIndex: 'bomItemDesc',
        key: 'bomItemDesc',
    },
    {
        title: 'Average Consumption',
        dataIndex: 'avgCons',
    },
    {
        title: 'Sequence',
        dataIndex: 'seq',
    },
    {
        title: 'Item Type',
        dataIndex: 'bomItemType',
        key: 'bomItemType',
        render: (text) => <Tag>{text}</Tag>,
    },
    {
        title: 'Is Pre-Op Output',
        dataIndex: 'isThisAPreOpOutput',
        key: 'isThisAPreOpOutput',
        render: (text) => (text ? 'Yes' : 'No'),
    },
];
const BomSelectionModal = (props: IProps) => {
    const { selectedSubProcessData, saveBom } = props;
    const [selectedRows, setSelectedRows] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setSelectedRows(selectedSubProcessData?.subProcessList.selectedBom.map(e => e.bomItemCode));
    }, [selectedSubProcessData?.subProcessList?.selectedBom]);

    const handleSelectChange = (selectedRowKeys: string[]) => {

        if (selectedSubProcessData.processType === ProcessTypeEnum.CUT && selectedRowKeys.length > 1) {
            AlertMessages.getErrorMessage('Cutting should have only one item')
            return
        }
        setSelectedRows(selectedRowKeys);
    };

    const handleSave = () => {
        const selectedBomData = selectedSubProcessData.bomList.filter(e => selectedRows.includes(e.bomItemCode));
        setVisible(false);
        saveBom(selectedBomData);
    };



    const rowSelection: TableProps<IMOP_OpRoutingBomList>['rowSelection'] = {
        selectedRowKeys: selectedRows,
        onChange: handleSelectChange,
        getCheckboxProps: (record: IMOP_OpRoutingBomList) => ({
            disabled: record.isThisAPreOpOutput, // Column configuration not to be checked
        }),
    };

    const renderSubProcessTable = () => {
        return <>
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="Process Type" size='small'>
                        {selectedSubProcessData.processTypeName}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Sub Process" size='small'>
                        {selectedSubProcessData.subProcessList.subProcessName}
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Dependent Sub Processes" size='small'>
                        <List
                            size="small"
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={selectedSubProcessData?.subProcessList?.dependentSubProcesses?.length > 0 ? selectedSubProcessData?.subProcessList?.dependentSubProcesses : ['N/A']}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                            locale={{
                                emptyText: selectedSubProcessData?.subProcessList?.dependentSubProcesses?.length === 0 ? null : 'No Data',  // Prevent "No Data" text or icon when empty
                            }}
                        />

                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Components" size='small'>
                        <List
                            size="small"
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={selectedSubProcessData?.subProcessList?.components?.length > 0 ? selectedSubProcessData?.subProcessList.components : []}
                            renderItem={(item) => <List.Item>{item.compName}</List.Item>}
                            locale={{
                                emptyText: selectedSubProcessData?.subProcessList?.components?.length === 0 ? null : 'No Data',  // Prevent "No Data" text or icon when empty
                            }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Operations" size='small'>
                        <List
                            size="small"
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={selectedSubProcessData?.subProcessList?.operations?.length > 0 ? selectedSubProcessData?.subProcessList?.operations : []}
                            renderItem={(item) => <List.Item>{item.opCode}-{item.opName}</List.Item>}
                        />
                    </Card>
                </Col>
            </Row>


            <Row style={{ marginBottom: '20px' }}>
                <Col span={24}>

                    <Divider> <h4>BOM List:</h4></Divider>
                    <Table size='small'
                        bordered
                        rowSelection={rowSelection}
                        columns={columnsBom}
                        dataSource={selectedSubProcessData?.bomList}
                        rowKey="bomItemCode"
                        pagination={false}
                    />
                </Col>
            </Row>

        </>
    }

    const confirmSelectedBom = () => {
        if (selectedRows.length < 1) {
            AlertMessages.getWarningMessage("NO BOM Selected")
        } else {
            setVisible(true);
        }
    }
    return (
        <div style={{ paddingBottom: "30px" }}>
            {selectedSubProcessData && renderSubProcessTable()}

            <Button className='btn-orange' style={{ float: 'right' }} type="primary" onClick={confirmSelectedBom}>
                Update Selected BOM Items
            </Button>
            <Modal
                title="Save BOM Items"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={handleSave}
            >
                <p>Are you sure you want to save the selected BOM items?</p>
            </Modal>
        </div>
    );
};

export default BomSelectionModal;
