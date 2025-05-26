import React, { useEffect, useState } from 'react';
import { Card, Empty, Tag } from 'antd';
import MoveToInvSummary from './move-to-inv-summary';
import { PJ_ProcessingSerialRequest, ProcessTypeEnum, PJ_ProcessingTypesResponseModel } from '@xpparel/shared-models';
import { ProcessingJobsService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';

interface Props {
  poSerial: number;
  productName: string[];
  fgColor: string[];
}

const MoveToInvPage: React.FC<Props> = ({ poSerial, productName, fgColor }) => {
  const [processTypes, setProcessTypes] = useState<ProcessTypeEnum[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const processingJobsService = new ProcessingJobsService();

  const getProcessTypesByProcSerialNumber = async () => {
    try {
      const req = new PJ_ProcessingSerialRequest(user.userName, user.orgData?.unitCode, user.orgData?.companyCode, user.userId, poSerial);
      const res = await processingJobsService.getProcessingTypesByProcessingSerial(req);
      if (res.status) {
        const types = res.data.map((item: PJ_ProcessingTypesResponseModel) => item.processType) as ProcessTypeEnum[];
        setProcessTypes(types);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
        setProcessTypes([]);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error)
      setProcessTypes([]);
    }
  };

  useEffect(() => {
    if (poSerial) {
      getProcessTypesByProcSerialNumber();
    }
  }, [poSerial]);

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 500 }}>Move To Inventory Summary</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
            <Tag color="blue">Order Quantity</Tag>
            <Tag color="green">Job Quantity</Tag>
            <Tag color="orange">Total Bundles</Tag>
            <Tag color="geekblue">Total Moved Bundles</Tag>
            <Tag color="purple">Total BundlesQty</Tag>
            <Tag color="volcano">Total MovedBundlesQty</Tag>
          </div>
        </div>
      }
    >
      {
        processTypes.length > 0 ? (
          <MoveToInvSummary
            poSerial={poSerial}
            processTypes={processTypes}
            fgColor={fgColor}
            productName={productName}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No process types found for this PO Serial."
            />
          </div>
        )
      }
    </Card >
  );
};

export default MoveToInvPage;
