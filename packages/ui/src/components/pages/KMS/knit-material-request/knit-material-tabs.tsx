import { CheckCircleOutlined, FormOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import CompletedRequests from './knit-material-completion';
import MaterialReqCreation, { TableDataProps } from './knit-material.request';
import { useState } from 'react';




const KnitTabsMain = (props: TableDataProps) => {
  const { knitTableData, handleView,rowSelection,handleRequest,selectedProcessingSerial,searchTrigger,handleKeyChange,resetTrigger} = props;
  const [activekey,setActiveKey] = useState<string>('1');
  

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <FormOutlined  style={{ marginRight: 8 }} />
          Create RM Request
        </span>
      ),
      children:<MaterialReqCreation  knitTableData={knitTableData} handleView={handleView} rowSelection={rowSelection} handleRequest={handleRequest} selectedProcessingSerial={0} searchTrigger={0} handleKeyChange={() => { } } resetTrigger={0}/>,
    },
    {
      key: '2',
      label: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          RM Requests
        </span>
      ),
      children: <CompletedRequests selectedProcessingSerial={selectedProcessingSerial} searchTrigger={searchTrigger} activeKey={activekey} resetTrigger={resetTrigger} />,
    },

  ];

  const onChange = (key: string) => {
    console.log('Selected tab key:', key);
    setActiveKey(key);
    handleKeyChange(key);
  };

  return (
    <Tabs defaultActiveKey="1" centered items={items} onChange={onChange} />
  );
};

export default KnitTabsMain;

