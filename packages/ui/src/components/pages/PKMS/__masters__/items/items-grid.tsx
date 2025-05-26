import { Divider, Input, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditFilled } from "@ant-design/icons";
import { ItemsModelDto, MaterialTypeEnum } from "@xpparel/shared-models";
import { useState } from "react";
import { SequenceUtils } from "packages/ui/src/common";




interface ItemsGridProps {
  category: MaterialTypeEnum;
  itemsGridData: ItemsModelDto[];
  editItemsData: (record: any) => void;
  toggleItemsData: (record: any) => void
}



export const ItemsGrid = (props: ItemsGridProps) => {
  const { category, itemsGridData, editItemsData, toggleItemsData } = props;
  const [searchedText, setSearchedText] = useState("");


  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: 'code',
      sorter: (a, b) => { return a.code.localeCompare(b.code) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: "Description",
      dataIndex: 'desc'
    },
    {
      title: "Material Type",
      dataIndex: 'materialTypeDesc'
     
    },
    ...([MaterialTypeEnum.CARTON, MaterialTypeEnum.POLY_BAG].includes(category) ? [
      {
        title: "Length",
        dataIndex: 'length',
        
      },
      {
        title: "Width",
        dataIndex: 'width',
      },
    ] : []),
    ...(MaterialTypeEnum.CARTON === category ? [
      {
        title: "Height",
        dataIndex: 'height',
      },
    ] : []),
    {
      title: "Category",
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <EditFilled onClick={() => editItemsData(record)} style={{ fontSize: '20px', color: '#08c' }} />
          <Divider type='vertical' />
          <Switch className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
            checked={record.isActive} onChange={() => toggleItemsData(record)} style={{ fontSize: '20px', color: '#08c' }} />
        </>
      )
    }
  ];

  return <>
    <Input.Search
      placeholder="Search"
      allowClear
      onChange={(e) => { setSearchedText(e.target.value) }}
      onSearch={(value) => { setSearchedText(value) }}
      style={{ width: 200, float: "right" }}
    />
    <br></br>
    <Table
      columns={columns}
      bordered
      dataSource={itemsGridData}
      size="small"
    />
  </>
};

export default ItemsGrid;