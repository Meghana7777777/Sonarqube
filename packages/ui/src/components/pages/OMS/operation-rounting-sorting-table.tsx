import React, { useState, useEffect } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, Button, Tag } from 'antd';
import { processTypeEnumDisplayValues } from '@xpparel/shared-models';

interface OperationRoutingSortTableProps {
    selectedProcesses: string[];
    onConfirmSequence: (confirmedSequence: string[]) => void;    
    isModified: boolean;
}

const columns = [
    {
        title: 'Process Type',
        dataIndex: 'processType',
        key: 'processType',
        render:(v)=> processTypeEnumDisplayValues[v]
        },
];

interface DataItem {
    key: string;
    processType: string;
}

const Row: React.FC<{ 'data-row-key': string; style?: React.CSSProperties }> = (props) => {
    const isFirstRow = props['data-row-key'] === '0';

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
        disabled:isFirstRow
    });

    const style: React.CSSProperties = {
        ...props?.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const OperationRoutingSortTable: React.FC<OperationRoutingSortTableProps> = ({ selectedProcesses, isModified, onConfirmSequence}) => {
    const [dataSource, setDataSource] = useState<DataItem[]>([]);
    const [confirmedSequence, setConfirmedSequence] = useState<string[] | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        setDataSource(selectedProcesses.map((process, index) => ({ key: `${index}`, processType: process })));
        setIsConfirmed(false);
        setConfirmedSequence(null);
        setIsConfirmed(isModified);
    }, [selectedProcesses, isModified]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id && over.id !='0') { // over.id !='0' knitting should not change
            setDataSource((prev) => {               
                const activeIndex = prev.findIndex((i) => i.key === active.id);               
                const overIndex = prev.findIndex((i) => i.key === over?.id);              
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const handleConfirm = () => {
        const sequence = dataSource.map(item => item.processType);
        // setConfirmedSequence(sequence);
        setIsConfirmed(true);
        onConfirmSequence(sequence); 
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '10px', }}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                        <Table
                            components={{ body: { row: isConfirmed ? undefined : Row } }} bordered rowKey="key"
                            columns={columns} dataSource={dataSource} pagination={false}
                            style={{ width: '350px' }} size='small'
                        />
                    </SortableContext>
                </DndContext>

                {/* {!isConfirmed && (
                <Button type="primary" onClick={handleConfirm} style={{ marginTop: '10px' }}>
                    Confirm Sequence
                </Button>
            )} */}

                <div style={{ padding: '10px', background: "#e1e1e1", borderRadius: '10px', width: "500px",flexWrap:'wrap', minHeight: "100px", display: "flex", flexDirection: "column", alignItems: "center",}}>
                    <h4 style={{margin:"5px 10px 15px", background:"white", borderRadius:"7px", padding:"5px 20px" }}>Process Type Order:</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {dataSource?.map((process, index) => (
                            <React.Fragment key={index}>
                                <Tag color="#2c8bb1" style={{ fontSize: '14px', padding: '5px 10px' }}>
                                    {processTypeEnumDisplayValues[process.processType]}
                                </Tag>
                                {index < dataSource.length - 1 && <span style={{ fontSize: '16px', fontWeight: 'bold' }}>→</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>


            </div>
            {!isConfirmed && (
                <Button type="primary" onClick={handleConfirm} style={{ marginTop: '10px', width: '200px' }}>
                    Confirm Sequence
                </Button>
            )}
        </div>
    );
};

export default OperationRoutingSortTable;
