import { SearchOutlined } from "@ant-design/icons";
import { EmbBundleScanModel, ReportedEmbBundleScanModel } from "@xpparel/shared-models";
import { Button, Input, Table, Tag, Tooltip } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useRef, useState } from "react";

interface Iprops {
  bundleResponse: ReportedEmbBundleScanModel[];
  scanType: string
}

const ReportedEmbBundleInfoGrid = (props: Iprops) => {
  useEffect(() => {
    if (props) {
      console.log(props.bundleResponse)
      console.log(props.scanType)
    }
  }, [])
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  //search feature 
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
          size="small"
          style={{ width: 90 }}
          onClick={() => {
            handleReset(clearFilters);
            setSearchedColumn(dataIndex);
            confirm({ closeDropdown: true });
          }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        type="search"
        style={{ color: filtered ? '#1890ff' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    // render: (text) =>
    //   text ? (
    //     searchedColumn === dataIndex ? (
    //       <Highlighter
    //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={text.toString()}
    //       />
    //     ) : (
    //       text
    //     )
    //   ) : null,
  });
  const bundleInfoColumns: any[] = [
    // {
    //     key: 'sno',
    //     title:'S.No.',
    //     width: '20px',
    //     responsive: ['sm'],
    //     render: (text, object, index) => (index+1)
    // },
    ...(props.scanType == 'Barcode' ?

      [
        {
          key: 'soNo',
          title: 'So No',
          render: (value,record)=>{
            return<>{record.status ? record?.otherProps?.soNo:'-'}</>
          }
          
        },
        {
          key: 'soLines',
          title: 'SO Lines',
          render:(value,record)=>(
            <>{record.status ? record?.otherProps?.soLines:'-'}</>
          )
        },
        // {
        //   key: 'cutNumber',
        //   title: 'Cut Number',
        //   dataIndex: 'cutNumber',
        //   reneder:(value,record)=>{
        //     <>{record.status?record.otherProps.cutNumber:'-'}</>
        //   }
        // },
        {
          key: 'color',
          title: 'Color',
          render:(value,record)=>(
            <>{record.status ? record?.otherProps?.color:'-'}</>
          )
        },
        {
          key: 'size',
          title: 'Size',
          dataIndex: 'size',
          render:(value,record)=>(
            <>{record.status ? record?.otherProps?.size:'-'}</>
          )
        },

        {
          key: 'docketNumber',
          title: 'Docket',
          dataIndex: "dockeNumber",
          render:(value,record)=>(
            <>{ record.status ? record?.otherProps?.docketGroup:'-'}</>
          )
        },
        // {
        //   key: 'shade',
        //   title: 'Shade',
        //   dataIndex: "shade",
        //   render:(value,record)=>(
        //     <>{record.status?record.otherProps.shade:'-'}</>
        //   )
        // },
        {
          key: 'bundleQty',
          title: 'Quantity',
          dataIndex: "bundleQty",
        },
      ]
      : []
    ),
    {
      key: 'barcode',
      title: 'Barcode',
      dataIndex: "barcode",
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: "status",
      render: (value) => {
        return <Tag color={value == true ? 'green' : 'red'}>{value == true ? 'SUCCESS' : 'FAILED'}</Tag>
      }
      // render:(text)=>{
      //     console.log(text)
      //     return<span style={{bac}}>{text == true ? 'Success' : 'Failed'}</span>
      // }
    },
    {
      key: 'reason',
      title: 'Reason',
      dataIndex: "reason",
      render: (value) => {
        return <>
          {value.length > 9 ? <Tooltip title={`${value}`}>{value.substring(0, 9) + '...'}</Tooltip> : <>{value}</>}
        </>
      }
    },

  ]
  return (
    <>
      <Table
        columns={bundleInfoColumns}
        dataSource={props.bundleResponse}
        bordered
        pagination={false}
        size='small'
        style={{ fontSize: '12px' }}
      />
    </>
  )
}
export default ReportedEmbBundleInfoGrid