import { ProcessingOrderSerialRequest, ProcessingOrderStatusEnum, ProcessingOrderViewInfoModel, ProcessTypeEnum } from '@xpparel/shared-models';
import { Button, Empty, Popconfirm, Space, Table } from 'antd';
import { useAppSelector } from '../hooks';
import { useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';

interface IRowSpanIndex {
  start: number;
  end: number;
}

export interface IPOViewProps {
  status: ProcessingOrderStatusEnum,
  processType: ProcessTypeEnum,
  processingOrderInfo?: ProcessingOrderViewInfoModel[],
  onProceed?: (rec: ProcessingOrderViewInfoModel) => void
  onDelete?: (rec: ProcessingOrderViewInfoModel) => void
  proceedText?: string
}
export default function ProcessingOrderView(props: IPOViewProps) {

  const { processingOrderInfo, onProceed, onDelete, proceedText, processType } = props;



  const renderColumns = (processingOrderData: ProcessingOrderViewInfoModel[]) => {


    const rowSpanMap: Map<number, IRowSpanIndex> = new Map<number, IRowSpanIndex>();

    processingOrderData.forEach((item, index) => {
      const rName = item.processingSerial;
      rowSpanMap.set(rName, rowSpanMap.has(rName) ? { start: rowSpanMap.get(rName).start, end: rowSpanMap.get(rName).end + 1 } : { start: index, end: 1 });
    });


    const columns: ColumnsType<ProcessingOrderViewInfoModel> = [
      {
        title: "Processing Serial",
        dataIndex: "processingSerial",
        key: "processingSerial",
        onCell: (record, index) => {
          if (index === rowSpanMap.get(record.processingSerial).start) {
            return { rowSpan: rowSpanMap.get(record.processingSerial).end };
          } else {
            return { rowSpan: 0 };
          }
        }
      },
      {
        title: "PO Name",
        dataIndex: "poName",
        onCell: (record, index) => {
          if (index === rowSpanMap.get(record.processingSerial).start) {
            return { rowSpan: rowSpanMap.get(record.processingSerial).end };
          } else {
            return { rowSpan: 0 };
          }
        }
      },
      {
        title: "MO Number",
        dataIndex: "moNumber",
        key: "moNumber",
      },
      {
        title: "MO Line Number",
        dataIndex: "moLineNumber",
        key: "moLineNumber",
      },
      {
        title: "Style Code",
        dataIndex: "styleCode",
        key: "styleCode",
      },
      {
        title: "Customer Name",
        dataIndex: "customerName",
        key: "customerName",
      },
      {
        title: "PO Quantity",
        dataIndex: "poQty",
        key: "poQty",
      },
      {
        title: "FG Color",
        dataIndex: "fgColor",
        key: "fgColor",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Button type="primary" size="small" onClick={() => onProceed(record)}>
              Proceed
            </Button>
            <Popconfirm
              title="Are you sure to delete?"
              okText="Delete"
              onConfirm={() => onDelete(record)}
              onCancel={() => { }}
            >
              <Button danger size="small" type='primary'>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
        onCell: (record, index) => {
          if (index === rowSpanMap.get(record.processingSerial).start) {
            return { rowSpan: rowSpanMap.get(record.processingSerial).end };
          } else {
            return { rowSpan: 0 };
          }
        }
      },
    ];
    return columns
  }



  return (
    <>
      {
        processingOrderInfo && processingOrderInfo.length ?
          <Table
            bordered
            dataSource={processingOrderInfo}
            size='small'
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'small-row'}
            columns={renderColumns(processingOrderInfo)}
          />
          : <Empty/>
      }
    </>
  )
}
