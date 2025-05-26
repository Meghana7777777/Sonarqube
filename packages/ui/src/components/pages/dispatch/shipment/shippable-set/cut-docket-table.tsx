import React from 'react';
import Table, { ColumnsType } from "antd/es/table";
import { CutStatusEnum, cutStatusEnumDisplayValues } from '@xpparel/shared-models';
import { CombinedDocketData } from './create-shippable-interfaces';
import { Tag } from 'antd';




interface CutviewChildProps {
  childData: CombinedDocketData[]; // Accepting childData as a prop
}

const columns: ColumnsType<CombinedDocketData> = [
  {
    title: 'Docket',
    dataIndex: 'docket',
    align: 'center',
  },
  {
    title: 'Main Docket',
    dataIndex: 'mainDocket',
    align: 'center',
    render: (mainDocket) => (mainDocket ? "Yes" : "No"),
  },
  {
    title: 'Item',
    dataIndex: 'item',
    align: 'center',
  },
  {
    title: 'Item Desc',
    dataIndex: 'itemDesc',
    align: 'center',
  },
  {
    title: 'Piles',
    dataIndex: 'plies',
    align: 'center',
  },
  {
    title: 'Lay Number',
    dataIndex: 'layNumber',
    align: 'center',
  },
  {
    title: 'Layed Piles',
    dataIndex: 'layedPlies',
    align: 'center',
  },

  // Column configuration
  {
    title: 'Cut Status',
    dataIndex: 'cutStatus',
    align: 'center',
    render: (val) => {      
      const label = cutStatusEnumDisplayValues[val];
      const colorMap = {
        0: '#f50',
        1: 'orange',
        2: 'blue',
        3: '#87d068', // completed
        99: 'red',
      };
      
      const color = colorMap[val] || 'default';

      // Return the Tag component with assigned color and label
      return <Tag color={color}>{label}</Tag>;
    },
  },

];

const CutDocketTable: React.FC<CutviewChildProps> = ({ childData }) => {

  return (
    <>
      <Table
        size="small"
        // rowKey={r => r.cutNumber}
        bordered
        pagination={false}
        columns={columns}
        dataSource={childData} // Use the childData prop
      />
    </>
  );
};

export default CutDocketTable;
