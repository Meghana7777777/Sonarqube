import React, { useEffect, useState } from 'react';
import { Table, Descriptions, Typography, Card, Button } from 'antd';
import { MoPropsModel, ProcessTypeEnum, SewingJobPreviewHeaderInfo, SewingJobWisePreviewModel } from '@xpparel/shared-models';
import moment from 'moment';

const { Text } = Typography;

interface IProps {
  sewJobPreviewData: SewingJobPreviewHeaderInfo;
  componentUpdateKey: number;
}
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
const columns = [
  {
    title: 'Routing Job Number',
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
  // {
  //   title: 'MO Numbers',
  //   dataIndex: 'moNumbers',
  //   key: 'moNumbers',
  //   render: (_: any, record: SewingJobWisePreviewModel) => record.bundleProps.moNumbers,
  // },
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
const SewingJobGenerationPreview: React.FC<IProps> = (props: IProps) => {

  useEffect(() => {
    if (props.sewJobPreviewData) {
      setInvData(props.sewJobPreviewData);
      setJobWiseData(props.sewJobPreviewData.jobWisePreviewModel);
      setBundleProps(props.sewJobPreviewData.jobWisePreviewModel[0].bundleProps)
    }
  }, [props.componentUpdateKey])
  const [invData, setInvData] = useState<SewingJobPreviewHeaderInfo>(undefined);

  const [bundleProps, setBundleProps] = useState<MoPropsModel>(undefined);
  const [jobWiseData, setJobWiseData] = useState<SewingJobWisePreviewModel[]>([]);

 

  const cellStyle: React.CSSProperties = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ padding: '10px' }}>

      <Card title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Routing Jobs Preview</span>} headStyle={{ backgroundColor: '#01576f' }}>
        {invData && <>
          <Descriptions
            title='Processing Jobs Header Preview'
            bordered
            column={4}
            style={{ textAlign: 'start', padding: '0px 25px' }}
            labelStyle={{ width: '10%' }}
            contentStyle={{ width: '10%' }}
          >
            <Descriptions.Item label="Order Serial">{invData.sewSerial}</Descriptions.Item>
            <Descriptions.Item label="Processing Type">{invData.processingType}</Descriptions.Item>
            <Descriptions.Item label="MO Number">{bundleProps.moNumber}</Descriptions.Item>
            <Descriptions.Item label="Destination">{bundleProps.destination}</Descriptions.Item>
            <Descriptions.Item label="Plan Prod Date">{moment(bundleProps.planProdDate).format('DD-MM-YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Buyer PO">{bundleProps.buyerPo}</Descriptions.Item>
            <Descriptions.Item label="Order Description">{invData.sewOrderDesc}</Descriptions.Item>
            <Descriptions.Item label="Style">{bundleProps.style}</Descriptions.Item>
            <Descriptions.Item label="MO Line">{bundleProps.moLineNo}</Descriptions.Item>
            <Descriptions.Item label="Delivery Date">{moment(bundleProps.plannedDelDate).format('DD-MM-YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Co Line">{bundleProps.coLine}</Descriptions.Item>
            {/* <Descriptions.Item label="MO Numbers">{bundleProps.moNumbers}</Descriptions.Item> */}
          </Descriptions>

          <Descriptions
            bordered
            column={4}
            style={{ textAlign: 'start', padding: '0px 25px', marginTop: '20px' }}
            labelStyle={{ width: '10%' }}
            contentStyle={{ width: '10%' }}
          >

            <React.Fragment >
              <Descriptions.Item label="Multicolor">{invData.multiColor ? 'Yes' : 'No'}</Descriptions.Item>
              <Descriptions.Item label="Routing Job Quantity">{invData.totalJobQuantity}</Descriptions.Item>
              <Descriptions.Item label="No. of Jobs">{invData.totalNoOfJobs}</Descriptions.Item>
              <Descriptions.Item label="Operations">{invData.operations.join(', ')}</Descriptions.Item>
              <Descriptions.Item label="Multisize">{invData.multiSize ? 'Yes' : 'No'}</Descriptions.Item>
              {/* <Descriptions.Item label="Logical Bundle Qty">{job.logicalBundleQty}</Descriptions.Item> */}
              <Descriptions.Item label="Total Job Groups">{invData.totalJobGroups}</Descriptions.Item>
              <Descriptions.Item label="No. of Bundles">{invData.totalBundlesCount}</Descriptions.Item>
              <Descriptions.Item label="Logical Bundle Qty">{invData.logicalBundleQty}</Descriptions.Item>
            </React.Fragment>

          </Descriptions>
        </>
        }
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
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' ,padding:'30px '}}>
          <Button type="primary">Confirm Sewing Jobs</Button>
        </div> */}
      </Card>
    </div>
  );
};

export default SewingJobGenerationPreview;
