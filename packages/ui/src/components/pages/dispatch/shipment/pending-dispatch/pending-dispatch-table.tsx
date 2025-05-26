import React from "react";
import { Table } from "antd";

// Define the Pending_D_Inline interface
interface Pending_D_Inline {
  MO: string;           // manufacturing order number
  cutOrder: string;     // Cut order
  productName: string;  // Product name
  cutNumbers: string;    // Cut numbers as a string
  quantity: number;      // Total quantity
  bags: number;          // Number of bags
} 

interface PendingDispatchPageInlineProps {
  childData: Pending_D_Inline[]; // Prop to receive childData as an array of Pending_D_Inline
}

const PendingDispatchTable=(props:PendingDispatchPageInlineProps) => {

  const{childData}=props;

  // Define table columns based on the Pending_D_Inline data
  const columns = [
    { title: "MO", dataIndex: "MO", key: "MO", align: "center" as const },
    { title: "Cut Order", dataIndex: "cutOrder", key: "cutOrder", align: "center" as const },
    { title: "Product Name", dataIndex: "productName", key: "productName", align: "center" as const },
    { title: "Cut Numbers", dataIndex: "cutNumbers", key: "cutNumbers", align: "center" as const },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "center" as const },
    { title: "Bags", dataIndex: "bags", key: "bags", align: "center" as const },
  ];

  return (
    <Table<Pending_D_Inline>
      columns={columns}
      dataSource={childData}
      pagination={false}
      size="small"
      rowKey="MO" // assuming 'MO' is unique for each row
    />
  );
};

export default PendingDispatchTable;
