import { SPS_C_JobRequestedTrimItemsModel, SPS_C_JobTrimRequest, SPS_C_ProcJobNumberRequest } from '@xpparel/shared-models';
import { ProcessingJobsService } from '@xpparel/shared-services';
import { Card, InputNumber, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../../common';

interface Trim {
  itemCode: string;
  itemDesc: string;
  itemType: string;
  requiredQty: number;
  uom: string;
}

interface TableRow {
  key: number;
  sno: number;
  itemCode: string;
  itemDesc: string;
  requiredQty: number;
  requestingQty: number;
  itemType: string;
  uom: string;
}

interface Props {
  jobNumber: string;
  refreshKey: number;
  updateChanges: (isChange: boolean) => void;
}

const WMSStrimDashboardRMIssuePage: React.FC<Props> = ({ jobNumber, refreshKey }) => {
  const [dataSource, setDataSource] = useState<TableRow[]>([]);
  const processService = new ProcessingJobsService();
  const user = useAppSelector((state) => state.user.user.user);
  const [expectedFulFillMentDate, setExpectedFulFillMentDate] = useState<Date | null>(null);

  const getJobInfoByJobNumber = async (jobNumber: string) => {
    const req = new SPS_C_ProcJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, true, true, true, true, true, true);
    try {
      const response = await processService.getJobInfoByJobNumber(req);
      if (response.data?.length > 0) {
        const job = response.data[0];
        const formattedTrims = job.trims.map((trim: Trim, index: number) => ({
          key: index,
          sno: index + 1,
          itemCode: trim.itemCode,
          itemDesc: trim.itemDesc,
          requiredQty: Number(trim.requiredQty),
          requestingQty: Number(trim.requiredQty),
          itemType: trim.itemType,
          uom: trim.uom,
        }));
        setDataSource(formattedTrims);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage)
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.internalMessage)
    }
  };

  useEffect(() => {
    if (jobNumber) {
      getJobInfoByJobNumber(jobNumber);
    }
  }, [jobNumber, refreshKey]);

  const columns: ColumnsType<TableRow> = [
    { title: 'SNo', dataIndex: 'sno', key: 'sno', align: "center" as const, },
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', align: "center" as const },
    { title: 'Item Desc', dataIndex: 'itemDesc', key: 'itemDesc', align: "center" as const },
    {
      title: 'Available Quantity',
      key: 'availableQuantity',
      align: "center" as const,
      render: (_, record) => record[0] || 0
    },
    { title: 'Required Quantity', dataIndex: 'requiredQty', key: 'requiredQty', align: "center" as const },
    { title: 'Item Type', dataIndex: 'itemType', key: 'itemType', align: "center" as const },
    { title: 'UOM', dataIndex: 'uom', key: 'uom', align: "center" as const },
  ];

  return (<>
    {dataSource.length > 0 && (
      <Card size='small' title={<span style={{ display: 'flex', justifyContent: 'center' }}>Raw Material Request Info</span>} bordered>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size='small'
          style={{ marginTop: 16 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    )}
  </>);
};

export default WMSStrimDashboardRMIssuePage;
