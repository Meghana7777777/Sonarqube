import { SPS_C_JobRequestedTrimItemsModel, SPS_C_JobTrimRequest, SPS_C_ProcJobNumberRequest, StockCodesRequest } from '@xpparel/shared-models';
import { PackingListService, ProcessingJobsService } from '@xpparel/shared-services';
import { Button, Card, DatePicker, Form, InputNumber, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../../common';

interface Trim {
  itemCode: string;
  itemDesc: string;
  itemType: string;
  requiredQty: number;
  issuedQty: number;
  allocatedQty: number;
  uom: string;
}

interface TableRow {
  key: number;
  sno: number;
  itemCode: string;
  itemDesc: string;
  requiredQty: number;
  requestingQty: number;
  issuedQty: number;
  allocatedQty: number;
  itemType: string;
  uom: string;
}

interface Props {
  jobNumber: string;
  refreshKey: number;
  updateChanges: (isChange: boolean) => void;
  handleRefresh: () => void;
  iNeedActionItems: boolean;
}

const IPSStrimDashboardRMRequestPage: React.FC<Props> = ({ jobNumber, refreshKey, updateChanges, handleRefresh, iNeedActionItems }) => {
  const [dataSource, setDataSource] = useState<TableRow[]>([]);
  const processService = new ProcessingJobsService();
  const user = useAppSelector((state) => state.user.user.user);
  const [expectedFulFillMentDate, setExpectedFulFillMentDate] = useState<Date | null>(null);
  const wmsService = new PackingListService();
  const [availableQtyMap, setAvailableQtyMap] = useState<Record<string, number>>({});
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (jobNumber) {
      getJobInfoByJobNumber(jobNumber);
    }
  }, [jobNumber, refreshKey]);

  const getJobInfoByJobNumber = async (jobNumber: string) => {
    const req = new SPS_C_ProcJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, false, false, false, true, false, false);
    try {
      const response = await processService.getJobInfoByJobNumber(req);
      if (response.data?.length > 0) {
        const job = response.data.find((job: any) => job.jobNumber === jobNumber);
        if (!job) {
          AlertMessages.getErrorMessage(`Job not found for job number: ${jobNumber}`);
          return;
        }
        const moNumber = job.moNumber;
        const formattedTrims = job.trims.map((trim: Trim, index: number) => ({
          key: index,
          sno: index + 1,
          itemCode: trim.itemCode,
          itemDesc: trim.itemDesc,
          requiredQty: Number(trim.requiredQty),
          allocatedQty: Number(trim.allocatedQty),
          issuedQty: Number(trim.issuedQty),
          requestingQty: Number(trim.requiredQty),
          itemType: trim.itemType,
          uom: trim.uom,
        }));
        setDataSource(formattedTrims);
        getAvailableQtyByItems(formattedTrims, moNumber);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage)
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.internalMessage)
    }
  };

  const getAvailableQtyByItems = async (items: TableRow[], moNumber: string) => {
    const qtyMap: Record<string, number> = {};

    for (const item of items) {
      try {
        const req = new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, item.itemCode, [], [], [moNumber]);

        const res = await wmsService.getInStockObjectsForItemCode(req);
        if (res.status && res.data?.length > 0) {
          const totalQty = res.data.reduce((sum, obj) => sum + (obj.leftOverQuantity || 0), 0);
          qtyMap[item.itemCode] = totalQty;
        } else {
          qtyMap[item.itemCode] = 0;
        }
      } catch (err) {
        qtyMap[item.itemCode] = 0;
      }
    }
    setAvailableQtyMap(qtyMap);
  };

  const handleQtyChange = (value: number | null, index: number) => {
    const updated = [...dataSource];
    updated[index].requestingQty = value || 0;
    setDataSource(updated);
  };

  const handleRequestRM = async () => {
    try {
      if (!expectedFulFillMentDate) {
        AlertMessages.getErrorMessage('Please select an expected fulfillment date.');
        return;
      }
      const today = new Date().toISOString();
      const items = dataSource.map((row, index) =>
        new SPS_C_JobRequestedTrimItemsModel(row.itemCode, formRef.getFieldValue([index, 'requestingQty']))
      );
      const req = new SPS_C_JobTrimRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, user?.userName, today, expectedFulFillMentDate, items, []);
      const res = await processService.saveTrimReqForSewingJob(req);
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        updateChanges(true);
        handleRefresh();
        setExpectedFulFillMentDate(null);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage || 'Request failed');
      }
    } catch (err: any) {
      AlertMessages.getErrorMessage(err?.message || 'Error occurred');
    }
  };


  const columns: ColumnsType<TableRow> = [
    { title: 'SNo', dataIndex: 'sno', key: 'sno', align: "center" as const, },
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', align: "center" as const },
    { title: 'Item Desc', dataIndex: 'itemDesc', key: 'itemDesc', align: "center" as const },
    {
      title: 'Available Quantity',
      key: 'availableQuantity',
      align: "center" as const,
      render: (_, record) => availableQtyMap[record.itemCode] || 0
    },
    { title: 'Required Quantity', dataIndex: 'requiredQty', key: 'requiredQty', align: "center" as const },
    { title: 'Requested Quantity', dataIndex: 'allocatedQty', key: 'allocatedQty', align: "center" },
    { title: 'Issued Quantity', dataIndex: 'issuedQty', key: 'issuedQty', align: "center" },
    {
      title: 'Requesting qty',
      dataIndex: 'requestingQty',
      align: "center" as const,
      key: 'requestingQty',
      render: (value, record, index) => {
        const pendingQty = record.requiredQty - record.allocatedQty;
        const availableQty = availableQtyMap[record.itemCode] || 0;
        const defaultQty = Math.min(pendingQty, availableQty);
        return (
          <Form.Item
            initialValue={defaultQty}
            name={[index, 'requestingQty']} style={{ margin: 0 }}>
            <InputNumber
              min={defaultQty}
              disabled={true}
              // max={defaultQty}
              onChange={(val) => handleQtyChange(val, index)}
            />
          </Form.Item>
        );
      }
    },
    { title: 'Item Type', dataIndex: 'itemType', key: 'itemType', align: "center" as const },
    { title: 'UOM', dataIndex: 'uom', key: 'uom', align: "center" as const },
  ];

  return (<>
    {dataSource.length > 0 && (
      <Card size='small' title={<span style={{ display: 'flex', justifyContent: 'center' }}>RM Request Info</span>} bordered>
        <Form form={formRef}>
          {Object.keys(availableQtyMap || {}).length > 0 && (<Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size='small'
            style={{ marginTop: 16 }}
            scroll={{ x: 'max-content' }}
          />)}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
            <div>
              <Form.Item label='Expected Fulfillment Date' name='expectedFulFillMentDate' rules={[{ required: true }]}>
                <DatePicker onChange={(momentDate) => setExpectedFulFillMentDate(momentDate ? momentDate.toDate() : null)} />
              </Form.Item>
            </div>
            {expectedFulFillMentDate && iNeedActionItems && (
              <Button
                type="primary"
                size="small"
                style={{
                  backgroundColor: "#2d6a4f",
                  borderColor: "#2d6a4f",
                  fontWeight: 600,
                  width: 140,
                  height: 35,
                  lineHeight: "24px",
                  padding: "0 12px"
                }}
                onClick={handleRequestRM}
                disabled={!iNeedActionItems}
              >
                Request RM
              </Button>
            )}
          </div>
        </Form>
      </Card>
    )}
  </>
  );
};

export default IPSStrimDashboardRMRequestPage;
