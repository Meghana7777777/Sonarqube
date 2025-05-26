import React, { useState, useRef } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const ManufacturingOrderForm = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters?) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters } : any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
       title: "MO",
        dataIndex: "mo", 
        key: "mo",
         ...getColumnSearchProps('mo')
        },
    {
      title: "Mo Line",
       dataIndex: "moLine",
        key: "moLine",
         ...getColumnSearchProps('moLine')
        },
    { 
      title: "Plan Production Date",
       dataIndex: "planProductionDate",
        key: "planProductionDate",
         ...getColumnSearchProps('planProductionDate')
        },
    { 
      title: "Delivery Date",
       dataIndex: "deliveryDate",
        key: "deliveryDate",
         ...getColumnSearchProps('deliveryDate')
         },
    { 
      title: "Destination",
       dataIndex: "destination",
        key: "destination", 
        ...getColumnSearchProps('destination')
       },
    { 
      title: "Product",
       dataIndex: "product",
        key: "product",
         ...getColumnSearchProps('product')
         },
    {
       title: "Color",
        dataIndex: "color",
         key: "color", 
         ...getColumnSearchProps('color')
         },
    { 
      title: "Quantity",
       dataIndex: "quantity", 
       key: "quantity", 
       ...getColumnSearchProps('quantity')
       },
    {
       title: "Status",
        dataIndex: "status", 
        key: "status", 
        ...getColumnSearchProps('status') 
      },
  ];

  const dataSource = [
    {
      key: "1",
      mo: "MO123",
      moLine: "1",
      planProductionDate: "2024-02-04",
      deliveryDate: "2024-02-10",
      destination: "New York",
      product: "Shirt",
      color: "Red",
      quantity: 100,
      status: "Pending",
      additional: {
        routingGenerated: 50,
        routingPending: 50,
        linkingGenerated: 40,
        linkingPending: 60,
        sewingGenerated: 30,
        sewingPending: 70,
        ironingGenerated: 20,
        ironingPending: 80,
        finishingGenerated: 10,
        finishingPending: 90,
      },
    },
    {
      key: "2",
      mo: "MO132",
      moLine: "2",
      planProductionDate: "2024-02-04",
      deliveryDate: "2024-02-11",
      destination: "America",
      product: "Shirt-pant",
      color: "Black",
      quantity: 100,
      status: "Completed",
      additional: {
        routingGenerated: 40,
        routingPending: 60,
        linkingGenerated: 40,
        linkingPending: 60,
        sewingGenerated: 50,
        sewingPending: 50,
        ironingGenerated: 40,
        ironingPending: 60,
        finishingGenerated: 30,
        finishingPending: 70,
      },
    },
    {
      key: "3",
      mo: "MO101",
      moLine: "3",
      planProductionDate: "2024-02-05",
      deliveryDate: "2024-02-19",
      destination: "Russia",
      product: "Shorts",
      color: "Black",
      quantity: 100,
      status: "Completed",
      additional: {
        routingGenerated: 50,
        routingPending: 50,
        linkingGenerated: 65,
        linkingPending: 35,
        sewingGenerated: 80,
        sewingPending: 20,
        ironingGenerated: 70,
        ironingPending: 30,
        finishingGenerated: 40,
        finishingPending: 60,
      },
    },
  ];

  const expandedRowRender = (record) => (
    <Table
      columns={[
        {
          title: <b>Routing Order Qty</b>,
          children: [
            {
              title: "Generated Qty",
              dataIndex: "routingGenerated",
              key: "routingGenerated",
              render: (text) => <span className="generated-qty">{text}</span>,
            },
            {
              title: "Pending Qty",
              dataIndex: "routingPending",
              key: "routingPending",
              render: (text) => <span className="pending-qty">{text}</span>,
            },
          ],
        },
        {
          title: <b>Linking</b>,
          children: [
            {
              title: "Generated Qty",
              dataIndex: "linkingGenerated",
              key: "linkingGenerated",
              render: (text) => <span className="generated-qty">{text}</span>,
            },
            {
              title: "Pending Qty",
              dataIndex: "linkingPending",
              key: "linkingPending",
              render: (text) => <span className="pending-qty">{text}</span>,
            },
          ],
        },
        {
          title: <b>Sewing</b>,
          children: [
            {
              title: "Generated Qty",
              dataIndex: "sewingGenerated",
              key: "sewingGenerated",
              render: (text) => <span className="generated-qty">{text}</span>,
            },
            {
              title: "Pending Qty",
              dataIndex: "sewingPending",
              key: "sewingPending", 
              render: (text) => <span className="pending-qty">{text}</span>,
            },
          ],
        },
        {
          title: <b>Ironing</b>,
          children: [
            {
              title: "Generated Qty",
              dataIndex: "ironingGenerated",
              key: "ironingGenerated",
              render: (text) => <span className="generated-qty">{text}</span>,
            },
            {
              title: "Pending Qty",
              dataIndex: "ironingPending",
              key: "ironingPending",
              render: (text) => <span className="pending-qty">{text}</span>,
            },
          ],
        },
        {
          title: <b>Finishing</b>,
          children: [
            {
              title: "Generated Qty",
              dataIndex: "finishingGenerated",
              key: "finishingGenerated",
              render: (text) => <span className="generated-qty">{text}</span>,
            },
            {
              title: "Pending Qty",
              dataIndex: "finishingPending",
              key: "finishingPending",
              render: (text) => <span className="pending-qty">{text}</span>,
            },
          ],
        },
      ]}
      dataSource={[record.additional]}
      pagination={false}
      bordered
    />
  );

  return (
    <>
      <style>
        {`
          .generated-qty {
            background-color: #d4edda; /* Light Green */
            color: #155724; /* Darker Green Text */
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
          }
          .pending-qty {
            background-color: #f8d7da; /* Light Red */
            color: #721c24; /* Dark Red Text */
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
          }
        `}
      </style>
 
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        expandable={{ expandedRowRender }}
      />
    </>
  );
};

export default ManufacturingOrderForm;