import React, { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Affix, Button, Col, Flex, Row, Space, Table, Tag, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';

class SewingJobPendingDataModel {
  sewingOrderLineNo: string;
  productName: string;
  productType: string;
  plantStyle: string;
  jobNo: string;
  jobType: string;
  planProductionDate: string;
  deliveryDate: string;
  currentPriority: number;
  changedPriority: number;
}
interface IProps {
  sewJobData: SewingJobPendingDataModel[];
}
interface DataType {
  sewingOrderLineNo: string;
  productName: string;
  productType: string;
  plantStyle: string;
  jobNo: string;
  jobType: string;
  planProductionDate: string;
  deliveryDate: string;
  currentPriority: number;
  changedPriority: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Existing Priority',
    dataIndex: 'currentPriority',
  },
  {
    title: 'Sew Job number',
    dataIndex: 'jobNo',
    render: (v, r) => {
      return <span style={{ width: "100%", display: 'block' }}><Tag color='#f50' style={{fontWeight:600, fontSize:'1.1rem'}}>{v}</Tag></span>
      return <Tooltip trigger="hover" placement='right' title={r.deliveryDate}><span style={{ width: "100%", display: 'block' }}><Tag color='#f50' style={{fontWeight:600, fontSize:'1.1rem'}}>{v}</Tag></span></Tooltip>
    }
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    render: (v) => <Tag color='green'>{v}</Tag>
  },
  {
    title: 'Product Type',
    dataIndex: 'productType',
  },
  {
    title: 'Delivery Date',
    dataIndex: 'deliveryDate',
  },
];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const TableRow: React.FC<Readonly<RowProps>> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const SewingJobPriorityGrid: React.FC<IProps> = (props) => {
  const [dataSource, setDataSource] = useState<DataType[]>(props.sewJobData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.jobNo === active.id);
        const overIndex = prev.findIndex((i) => i.jobNo === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };
  const changePriority = () => {
    const priorityData = dataSource.map((e, i) => e.changedPriority = i + 1);
  }
  const reset = () => {
    const priorityData = [...dataSource].sort((a, b) => a.currentPriority - b.currentPriority); // Create a new array and sort it
    setDataSource(priorityData); // Set the sorted data to trigger re-render
    
  }
  return (
    <>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={dataSource.map((i) => i.jobNo)}
          strategy={verticalListSortingStrategy}
        >
          <Table<DataType>
            // style={{ width: '200px' }}
            components={{
              body: { row: TableRow },
            }}
            size='small'
            rowKey="jobNo"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            sticky={{ offsetHeader: 56 }}
          />
        </SortableContext>
      </DndContext>


      <Flex justify="flex-end" style={{ marginTop: '10px' }}>
        <Affix offsetBottom={0}>
          <Space>
          <Button type='primary' danger onClick={reset} > Reset</Button>
          <Button type='primary' onClick={changePriority} className='btn-green'> Change Priority</Button>
          </Space>
        </Affix>
      </Flex>

    </>
  );
};


export default SewingJobPriorityGrid;