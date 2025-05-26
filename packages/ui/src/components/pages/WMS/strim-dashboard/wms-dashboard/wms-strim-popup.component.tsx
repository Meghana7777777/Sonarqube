import { ReloadOutlined } from "@ant-design/icons";
import { INV_C_InvOutExtRefIdToGetAllocationsRequest, IPS_R_JobModel, MaterialRequestTypeEnum, ProcessTypeEnum, Rm_C_OutExtRefIdToGetAllocationsRequest, Rm_R_OutAllocationInfoAndBundlesModel, SPS_C_ProcJobNumberRequest, SPS_RequestDetailsModel } from "@xpparel/shared-models";
import { InvIssuanceService, ProcessingJobsService, WmsSpsTrimRequestService } from "@xpparel/shared-services";
import { Button, Card, Col, Row, Space } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import WMSInvAllocationsTablePage from "./trim-Inv-allocation-issurence";
import WMSRMAllocationsTablePage from "./trim-rm-allocation.pgae";
import WMSStrimDashboardInventoryRequestPage from "./wms-strim-dashboard-job-inv-info.page";
import WMSStrimDashboardRMIssue from "./wms-strim-dashboard-job-rm-info.page";
import { WMSStrimDashboardJobDetailsPage } from "./wms-strim-dashboard-job.details.page";
import { IInventoryInfo } from "../ips-dashboard/ips-interface";
import { AlertMessages } from "packages/ui/src/components/common";

interface JobNumberProps {
  jobNumber: string;
  processType: ProcessTypeEnum;
  updateChanges: (isChange: boolean) => void;
}

export const WMSStrimDashboardPopup: React.FC<JobNumberProps> = ({ jobNumber, processType, updateChanges }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const processService = new ProcessingJobsService();
  const user = useAppSelector((state) => state.user.user?.user);
  const invIssuanceService = new InvIssuanceService();
  const [inventoryRequests, setInventoryRequests] = useState<IInventoryInfo[]>([]);
  const [rmRequests, setRmRequests] = useState<Rm_R_OutAllocationInfoAndBundlesModel[]>([]);
  const rmService = new WmsSpsTrimRequestService();
  useEffect(() => {
    getRequestDetailsForJob()
  }, [jobNumber, processType, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getRequestDetailsForJob = async () => {
    try {
      const request = new SPS_C_ProcJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, false, false, false, false, false, false);
      const response = await processService.getRequestDetailsForJob(request);
      const inventoryDetails: IInventoryInfo[] = [];
      const rmDetails: Rm_R_OutAllocationInfoAndBundlesModel[] = [];
      if (response.status && response.data.length) {
        for (const eachRec of response.data) {
          if (eachRec.requestType === MaterialRequestTypeEnum.ITEM_SKU) {
            const invReq = new INV_C_InvOutExtRefIdToGetAllocationsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, eachRec.requestId, processType);
            const invResponse = await invIssuanceService.getAllocationsForInvOutRequestRefId(invReq);
            if (invResponse.status && invResponse.data?.length) {
              inventoryDetails.push({ ...eachRec, ...invResponse.data[0] });
            }
          }

          if (eachRec.requestType === MaterialRequestTypeEnum.RM) {
            const rmReq = new Rm_C_OutExtRefIdToGetAllocationsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, eachRec.requestId, processType);
            const rmResponse = await rmService.getRmAllocatedMaterialForRequestRefId(rmReq);
            if (rmResponse.status && rmResponse.data?.length) {
              rmDetails.push({ ...eachRec, ...rmResponse.data[0] });
            }
          }
        }
      }
      setInventoryRequests(inventoryDetails);
      setRmRequests(rmDetails);
    } catch (err) {
      setInventoryRequests([]);
      setRmRequests([]);
      AlertMessages.getErrorMessage(err.message);
    }
  };

  return (
    <Card
      title="WMS Dashboard Job Details"
      bordered
      extra={<Button icon={<ReloadOutlined />} onClick={handleRefresh} type="text" title="Refresh All" />}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <WMSStrimDashboardJobDetailsPage jobNumber={jobNumber} refreshKey={refreshKey} />
        <Row gutter={16}>
          <Col span={12}>
            <WMSInvAllocationsTablePage handleRefresh={handleRefresh} jobNumber={jobNumber} processType={processType} refreshKey={refreshKey} requestDeatils={inventoryRequests} />
          </Col>
          <Col span={12}>
            <WMSRMAllocationsTablePage jobNumber={jobNumber} processType={processType} refreshKey={refreshKey} requestDeatils={rmRequests} />
          </Col>
        </Row>
        <WMSStrimDashboardInventoryRequestPage jobNumber={jobNumber} updateChanges={updateChanges} refreshKey={refreshKey} />
        <WMSStrimDashboardRMIssue jobNumber={jobNumber} updateChanges={updateChanges} refreshKey={refreshKey} />
      </Space>
    </Card>
  );
};

export default WMSStrimDashboardPopup;
