import { JobSewSerialReq, SewingJobPropsModel } from '@xpparel/shared-models';
import { ProcessingJobsService } from '@xpparel/shared-services';
import { Descriptions, Empty, Tag } from 'antd';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../../common';

interface Props {
  jobNumber: string
  refreshKey: number
}

export const IPSStrimDashboardJobPage: React.FC<Props> = ({ jobNumber, refreshKey }) => {
  const [jobData, setJobData] = useState<SewingJobPropsModel | null>(null);
  const processService = new ProcessingJobsService();
  const user = useAppSelector((state) => state.user.user.user);

  const fetchJobData = async (jobNumber: string) => {
    const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, jobNumber, undefined, false);
    try {
      const response = await processService.getSewingJobQtyAndPropsInfoByJobNumber(req);
      if (response.data) {
        setJobData(response.data);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage)
        setJobData(null);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.internalMessage)
      setJobData(null);
    }
  };

  useEffect(() => {
    if (jobNumber) {
      fetchJobData(jobNumber);
    }
  }, [jobNumber, refreshKey]);

  return (
    <div>
      {jobData ? (
        <div>
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }} labelStyle={{ fontWeight: 'bold' }}>
            <Descriptions.Item label="Job Number">{jobData.jobNumber}</Descriptions.Item>
            <Descriptions.Item label="Mo Number">{jobData.moNumber}</Descriptions.Item>
            <Descriptions.Item label="Fg Colors">{jobData.fgColors}</Descriptions.Item>
            <Descriptions.Item label="Module Number"> <Tag color="#108ee9">{jobData.moduleNumber}</Tag></Descriptions.Item>
            <Descriptions.Item label="Mo Line Numbers">{jobData.moLineNumbers}</Descriptions.Item>
            <Descriptions.Item label="No Of Job Bundles">
              <Tag color="#2db7f5">{jobData.noOfJobBundles}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Output Reported Quantity">
              <Tag color="green">{jobData.outputReportedQty}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Pending To Input Quantity">
              <Tag color="orange">{jobData.pendingToInputQty}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Plan Production Date">{jobData.planProductionDate ? jobData.planProductionDate.split(',').map(date => moment(date).format('DD-MM-YYYY')).join(', ') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Processing Type">{jobData.processingType}</Descriptions.Item>
            <Descriptions.Item label="Product Name">{jobData.productName}</Descriptions.Item>
            <Descriptions.Item label="Rejected Quantity">{jobData.rejectedQty}</Descriptions.Item>
            <Descriptions.Item label="Sizes">{jobData.sizes}</Descriptions.Item>
            <Descriptions.Item label="Buyer">{jobData.buyer}</Descriptions.Item>
            <Descriptions.Item label="Destination">{jobData.destination}</Descriptions.Item>
            <Descriptions.Item label="Co Line">{jobData.coLine}</Descriptions.Item>
            <Descriptions.Item label="Eligible To Report Quantity">
              <Tag color="blue">{jobData.eligibleToReportQty}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Style">{jobData.style}</Descriptions.Item>
            <Descriptions.Item label="Work In Progress"><Tag color="#87d068">{jobData.wip}</Tag></Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Empty description="No job data available" />
      )}
    </div>
  );
};

export default IPSStrimDashboardJobPage;
