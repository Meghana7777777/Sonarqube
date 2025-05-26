import { BatchInfoModel, InsInspectionRollSelectionTypeEnum, InsInspReqStatusModel, PackingListInfoModel, RollInfoModel, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Collapse, CollapseProps, Tag } from 'antd';
import { CustomColumn, ScxTable } from 'packages/ui/src/schemax-component-lib';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import { TwitterOutlined } from '@ant-design/icons';
import { SequenceUtils } from 'packages/ui/src/common/utils';

interface IAllocationBatchTableProps {
    packListData: PackingListInfoModel;
    selectableInsRollsCount: Map<string, number>;
    selectedInsRolls: Map<string, number[]>;
    batchRolls: Map<string, AllocationBatchTableModel[]>;
    setSelectedInsRolls: Dispatch<SetStateAction<Map<string, number[]>>>;
    disableSelectedRolls?: boolean;
    insSelectionType: InsInspectionRollSelectionTypeEnum
}

type ExtraProperties = {
    supplierCode: string;
    phId: number;
    inspectionDetails: InsInspReqStatusModel[]
    // Add more extra properties as needed
};
export type AllocationBatchTableModel = RollInfoModel & ExtraProperties
export const AllocationBatchTable = (props: IAllocationBatchTableProps) => {
    const { packListData, selectableInsRollsCount, selectedInsRolls, batchRolls, setSelectedInsRolls, disableSelectedRolls,insSelectionType } = props;
    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    useEffect(() => {
        console.log(packListData);
        setActiveKeys(packListData?.batchInfo.map(rec => rec.batchNumber.toString()));
    }, [packListData])

    const columns: CustomColumn<AllocationBatchTableModel>[] = [
        {
            title: 'Lot No',
            dataIndex: 'lotNumber',
            align: 'center',
            key: 'lotNumber',
        },
        {
            title: 'Material Item Code',
            dataIndex: 'materialItemCode',
            align: 'center',
            key: 'materialItemCode',
        },
        {
            title: 'Object Type',
            dataIndex: 'objectType',
            align: 'center',
            key: 'objectType',
        },
        {
            title: 'Object No',
            dataIndex: 'externalRollNumber',
            align: 'center',
            key: 'externalRollNumber',
        },
        {
            title: 'Object Barcode',
            dataIndex: 'barcode',
            align: 'center',
            key: 'barcode',
        },
        {
            title: 'Object Qty',
            dataIndex: 'supplierQuantity',
            align: 'center',
            key: 'supplierLength',
        },
        // {
        //     title: 'Object Length',
        //     dataIndex: 'inputLength',
        //     align: 'center',
        //     key: 'inputLength',
        //     render: (text, record) => { return text + '(' + record.inputLengthUom + ')' }
        // },
        // {
        //     title: 'Width (CM)',
        //     dataIndex: 'supplierWidth',
        //     align: 'center',
        //     key: 'supplierWidth',
        // },
        {
            title: 'Object Width',
            dataIndex: 'inputWidth',
            align: 'center',
            key: 'inputWidth',
            render: (text, record) => { return text + '(' + record.inputWidthUom + ')' }
        },
        {
            title: 'Object Shade',
            dataIndex: 'shade',
            align: 'center',
            key: 'shade',
        }
    ];
    const getRowSelection = (batchNumber: string) => {
        const obj = {
            columnTitle: <></>,
            selectedRowKeys: selectedInsRolls?.get(batchNumber)
        };
        if (disableSelectedRolls) {
            obj['getCheckboxProps'] = (record: AllocationBatchTableModel) => ({
                disabled: record.inspCompleted ? true : false,
                selected: true,
                style: {
                    color: 'red'
                }
            });
        }
        if (insSelectionType === InsInspectionRollSelectionTypeEnum.SYSTEMATIC) {
            obj['getCheckboxProps'] = (record: AllocationBatchTableModel) => ({
                disabled: true,
            });
        } else {
            obj['onChange'] = (selectedRowKeys: number[], selectedRows: AllocationBatchTableModel[]) => {
                const sum = selectedRows.reduce((acc, roll) => acc + Number(roll.supplierQuantity || 0), 0)
                if (sum == 0 || sum <= selectableInsRollsCount.get(batchNumber)) {
                    if (sum) {
                        const selectedInsRollsLocal = new Map(selectedInsRolls);
                        selectedInsRollsLocal.set(batchNumber, selectedRowKeys);
                        setSelectedInsRolls(selectedInsRollsLocal);
                    } else {
                        const selectedInsRollsLocal = new Map(selectedInsRolls);
                        selectedInsRollsLocal.set(batchNumber, selectedRowKeys);
                        setSelectedInsRolls(selectedInsRollsLocal);
                    }
                } else if (disableSelectedRolls) {

                }
                else {
                    const sumWithoutLastElement = selectedRows.splice(0, selectedRows.length-1).reduce((acc, roll) => acc + Number(roll.supplierQuantity || 0), 0)
                    if (sumWithoutLastElement <= selectableInsRollsCount.get(batchNumber)) {
                        const selectedInsRollsLocal = new Map(selectedInsRolls);
                        selectedInsRollsLocal.set(batchNumber, selectedRowKeys);
                        setSelectedInsRolls(selectedInsRollsLocal);
                    } else {
                        AlertMessages.getErrorMessage(`You can select only up to ${selectableInsRollsCount.get(selectedRows[0].batchNumber)} from this Batch `)
                    }
                }

            };
        };
        return obj;
    }

    function getPendingRolls(totalRolls: number, selectedForInsRolls: number) {
        if (totalRolls && selectedForInsRolls) {
            const diff = Number(totalRolls) - Number(selectedForInsRolls);
            return SequenceUtils.formatNumberToSpecificLength(diff.toString(), 3);
        }
        return '000';
    }

    const getItems = (batches: BatchInfoModel[]) => {
        const items: CollapseProps['items'] = batches.map(batch => {
            return {
                key: batch.batchNumber.toString(),
                label: `Batch No : ${batch.batchNumber}`,
                children: <ScxTable columns={columns} size='small'
                    rowKey={record => record.rollNumber} dataSource={batchRolls.get(batch.batchNumber.toString())} scroll={{ x: 'max-content' }} pagination={false} bordered={true}

                    rowSelection={{
                        type: 'checkbox',
                        ...getRowSelection(batch.batchNumber),
                    }}
                />,
                extra: <>
                    <Tag color="magenta">
                        Total Rolls : <b>{SequenceUtils.formatNumberToSpecificLength(`${batchRolls.get(batch.batchNumber.toString())?.length ? batchRolls.get(batch.batchNumber.toString())?.length : 0}`, 3)}</b>
                    </Tag>
                    <Tag color="#e27525">
                        Ins Rolls : <b>{SequenceUtils.formatNumberToSpecificLength(`${selectedInsRolls.get(batch.batchNumber)?.length ? selectedInsRolls.get(batch.batchNumber)?.length : 0}`, 3)}</b>
                    </Tag>
                    <Tag color="#7cb675">
                        Left Over Rolls : <b>{getPendingRolls(batchRolls.get(batch.batchNumber.toString())?.length, selectedInsRolls.get(batch.batchNumber)?.length)}</b>
                    </Tag>
                </>
            }
        });
        return items;
    };


    return (
        <div>
            {packListData?.batchInfo?.length !== 0 &&
                <Collapse bordered={true} defaultActiveKey={activeKeys} size="small" items={getItems(packListData ? packListData.batchInfo : [])} key={Date.now()}></Collapse>}

        </div>
    );
}
