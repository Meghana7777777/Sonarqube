import Table, { ColumnsType } from "antd/es/table";
import { IPlLineInfoColumns } from "./pack-list-creation";

interface IPlGenQtySummary {
  tblData: IPlLineInfoColumns[]
  tblColumns: ColumnsType<IPlLineInfoColumns>
}

export const PLGenQtySummaryGrid = (props: IPlGenQtySummary) => {
  const { tblData, tblColumns } = props;
  
  return <Table
    dataSource={tblData}
    columns={tblColumns}
    size='small'
    bordered
    scroll={{ x: 'auto' }}
    // rowKey={record => record.lineDesc + record.lineId}
    pagination={false}
    rowClassName={record => record['isHavingPendingQty'] ? 'i-red' : 'i-green'}
  />;
};

export default PLGenQtySummaryGrid;
