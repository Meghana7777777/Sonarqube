import React, { useState } from 'react';
import { Table, Descriptions, Typography, Card, Button } from 'antd';
import { ProcessTypeEnum, SewingJobPreviewHeaderInfo, SewingJobWisePreviewModel } from '@xpparel/shared-models';
import moment from 'moment';

const { Text } = Typography;


const data: any[] = [
  {

    processingType: 'SEW' as ProcessTypeEnum,
    totalNoOfJobs: 1,
    totalJobQuantity: 0,
    totalBundlesCount: 0,
    totalJobGroups: 2,
    // logicalBundleQty:5,
    operations: ['106', '103', '107'],
    sewSerial: 1,
    sewOrderDesc: 'Sample Description',
    multiColor: false,
    multiSize: false,
    jobWisePreviewModel: [
      {
        sewingJobNumber: 'J-1',
        noOfBundles: 25,
        totalQuantity: 250,
        bundleProps: {
          moNumber: '371177',
          style: 'BBAW-371177',
          moLineNo: '30',
          destination: 'US',
          plannedDelDate: '2025-01-25 00:00',
          planProdDate: '2024-12-31',
          planCutDate: '2024-12-25',
          coLine: '30',
          buyerPo: 'BPO3',
          moNumbers: 'M01',
          productName: 'Shirt',
          fgColor: 'Blue',
          size: 'L',
        },
      },
    ],
  },
];

const SewingJobGenerationPreview: React.FC = () => {

  const [invData,setInvData] = useState(data);
  const bundlePropsData = invData[0].jobWisePreviewModel[0].bundleProps;
  const [bundleProps,setBundleProps] = useState(bundlePropsData);
  const [jobWiseData,setJobWiseData] = useState(invData[0].jobWisePreviewModel);

  const columns = [
    {
      title: 'Job Number',
      dataIndex: 'sewingJobNumber',
      key: 'sewingJobNumber',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: SewingJobWisePreviewModel) => record.bundleProps.productName,
    },
    {
      title: 'FgColor',
      dataIndex: 'fgColor',
      key: 'fgColor',
      render: (_: any, record: SewingJobWisePreviewModel) => record.bundleProps.fgColor,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (_: any, record: SewingJobWisePreviewModel) => record.bundleProps.size,
    },
    {
      title: 'MO Numbers',
      dataIndex: 'moNumbers',
      key: 'moNumbers',
      render: (_: any, record: SewingJobWisePreviewModel) => record.bundleProps.moNumbers,
    },
    {
      title: 'No of Bundles',
      dataIndex: 'noOfBundles',
      key: 'noOfBundles',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
  ];

  const cellStyle: React.CSSProperties = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  return (
    <div style={{padding:'10px'}}>

      <Card title={<span style={{ display:'flex', justifyContent:'center', color: 'white'}}>Processing Jobs Preview</span>} headStyle={{ backgroundColor:'#01576f' }}>
        <Descriptions
          title='Processing Jobs Header Preview'
          bordered
          column={4}
          style={{ textAlign: 'start', padding: '0px 25px' }}
          labelStyle={{ width: '10%' }}
          contentStyle={{ width: '10%' }}
        >
          <Descriptions.Item label="Order Serial">{invData[0].sewSerial}</Descriptions.Item>
          <Descriptions.Item label="Processing Type">{invData[0].processingType}</Descriptions.Item>
          <Descriptions.Item label="Mo Number">{bundleProps.moNumber}</Descriptions.Item>
          <Descriptions.Item label="Destination">{bundleProps.destination}</Descriptions.Item>
          <Descriptions.Item label="Plan Prod Date">{moment(bundleProps.planProdDate).format('DD-MM-YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Buyer PO">{bundleProps.buyerPo}</Descriptions.Item>
          <Descriptions.Item label="Order Description">{invData[0].sewOrderDesc}</Descriptions.Item>
          <Descriptions.Item label="Style">{bundleProps.style}</Descriptions.Item>
          <Descriptions.Item label="Mo Line">{bundleProps.moLineNo}</Descriptions.Item>
          <Descriptions.Item label="Delivery Date">{moment(bundleProps.plannedDelDate).format('DD-MM-YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Co Line">{bundleProps.coLine}</Descriptions.Item>
          <Descriptions.Item label="MO Numbers">{bundleProps.moNumbers}</Descriptions.Item>
        </Descriptions>
      
        <Descriptions
          bordered
          column={4}
          style={{ textAlign: 'start', padding: '0px 25px',marginTop:'20px'}}
          labelStyle={{ width: '10%' }}
          contentStyle={{ width: '10%' }}
        >
          {invData.map((job, index) => (
            <React.Fragment key={index}>
              <Descriptions.Item label="Multicolor">{job.multiColor ? 'Yes' : 'No'}</Descriptions.Item>
              <Descriptions.Item label="Routing Job Quantity">{job.totalJobQuantity}</Descriptions.Item>
              <Descriptions.Item label="No. of Jobs">{job.totalNoOfJobs}</Descriptions.Item>
              <Descriptions.Item label="Operations">{job.operations.join(', ')}</Descriptions.Item>
              <Descriptions.Item label="Multisize">{job.multiSize ? 'Yes' : 'No'}</Descriptions.Item>
              {/* <Descriptions.Item label="Logical Bundle Qty">{job.logicalBundleQty}</Descriptions.Item> */}
              <Descriptions.Item label="Total Job Groups">{job.totalJobGroups}</Descriptions.Item>
              <Descriptions.Item label="No. of Bundles">{job.totalBundlesCount}</Descriptions.Item>
            </React.Fragment>
          ))}
        </Descriptions>
      
        <Table
          dataSource={jobWiseData}
          columns={columns.map((col) => ({
            ...col,
            onCell: () => ({ style: cellStyle }),
            onHeaderCell: () => ({ style: cellStyle }),
          }))}
          rowKey="sewingJobNumber"
          pagination={false}
          style={{ marginTop: '30px' }}
          bordered
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' ,padding:'30px '}}>
          <Button type="primary">Confirm Routing Jobs</Button>
        </div>
      </Card>
    </div>
  );
};

export default SewingJobGenerationPreview;
