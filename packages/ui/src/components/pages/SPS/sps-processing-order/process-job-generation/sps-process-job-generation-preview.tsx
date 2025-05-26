import React, { useEffect, useState } from 'react';
import { Table, Descriptions, Typography, Card, Button } from 'antd';
import { MoPropsModel, PJ_BundlePropsModel, PJ_ProcessingJobBatchDetails, PJ_ProcessingJobLine, PJ_ProcessingJobPreviewHeaderInfo, PJ_ProcessingJobPreviewModelResp, PJ_ProcessingJobSubLine, PJ_ProcessingJobWisePreviewModel, ProcessTypeEnum, SewingJobPreviewHeaderInfo, SewingJobWisePreviewModel } from '@xpparel/shared-models';
import moment from 'moment';

const { Text } = Typography;

interface IProps {
  processJobPreviewData: PJ_ProcessingJobPreviewHeaderInfo;
  componentUpdateKey: number;
}

const columns:any = [
  {
    title: 'Processing Job Number',
    dataIndex: 'jobNumber',
    key: 'jobNumber',
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
    render: (_: any, record: PJ_ProcessingJobWisePreviewModel) => record.bundleProps.productName,
  },
  {
    title: 'FG Color',
    dataIndex: 'fgColor',
    key: 'fgColor',
    render: (_: any, record: PJ_ProcessingJobWisePreviewModel) => record.bundleProps.fgColor,
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    render: (_: any, record: PJ_ProcessingJobWisePreviewModel) => record.bundleProps.size,
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
const SPSProcessJobPreview: React.FC<IProps> = (props: IProps) => {

  useEffect(() => {
    if (props.processJobPreviewData) {
      setInvData(props.processJobPreviewData);
      setJobWiseData(props.processJobPreviewData.jobWisePreviewModel);
      setBundleProps(props.processJobPreviewData.jobWisePreviewModel.map(job => job.bundleProps))
    }
  }, [props.componentUpdateKey])
  const [invData, setInvData] = useState<PJ_ProcessingJobPreviewHeaderInfo>(undefined);
  const [bundleProps, setBundleProps] = useState<PJ_BundlePropsModel[]>([]);
  const [jobWiseData, setJobWiseData] = useState<PJ_ProcessingJobWisePreviewModel[]>([]);


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
            <Descriptions.Item label="Processing Serial">{invData.processingSerial}</Descriptions.Item>
            <Descriptions.Item label="Process Type">{invData.processingType}</Descriptions.Item>  
            <Descriptions.Item label="Destination">{bundleProps.length > 0 ? bundleProps[0].destination : 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Plan Prod Date">{moment(bundleProps[0].planProdDate).format('DD-MM-YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Order Description">{invData.processingOrderDesc}</Descriptions.Item>
            <Descriptions.Item label="Style">{bundleProps[0].style}</Descriptions.Item>
            <Descriptions.Item label="Delivery Date">{moment(bundleProps[0].plannedDelDate).format('DD-MM-YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Co Number">{bundleProps[0].coNumber}</Descriptions.Item>
            <Descriptions.Item label="MO Numbers">{bundleProps[0].moNumbers}</Descriptions.Item>
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
              <Descriptions.Item label="Multi Size">{invData.multiSize ? 'Yes' : 'No'}</Descriptions.Item>
              <Descriptions.Item label="Total Job Groups">{invData.totalJobGroups}</Descriptions.Item>
              <Descriptions.Item label="No. of Bundles">{invData.totalBundlesCount}</Descriptions.Item>
              {/* <Descriptions.Item label="Logical Bundle Count">{invData.totalBundlesCount}</Descriptions.Item>  */}
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

export default SPSProcessJobPreview;
