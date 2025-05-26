import { ReloadOutlined } from "@ant-design/icons";
import { INV_C_InvOutExtRefIdToGetAllocationsRequest, MaterialRequestTypeEnum, ProcessTypeEnum, Rm_C_OutExtRefIdToGetAllocationsRequest, Rm_R_OutAllocationInfoAndBundlesModel, SPS_C_ProcJobNumberRequest } from "@xpparel/shared-models";
import { InvIssuanceService, ProcessingJobsService, WmsSpsTrimRequestService } from "@xpparel/shared-services";
import { Button, Card, Col, Row, Space } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import React, { useEffect, useState } from "react";
import { IInventoryInfo } from "./ips-interface";
import IPSInventoryAllocationsTablePage from "./ips-inv-allocation";
import IPSRMAllocationsTablePage from "./ips-rm-allocation";
import IPSStrimDashboardInventoryRequestPage from "./ips-strim-dashboard-job-inv-info.page";
import IPSStrimDashboardRMRequestPage from "./ips-strim-dashboard-job-rm-info.page";
import IPSStrimDashboardJobPage from "./ips-strim-dashboard-job.details.page";

interface AllocationModel {
	allocationId: number;
	allocatedBy: string;
	allocatedDate: string;
	issued: boolean;
	bundles: BundleModel[];
}

interface BundleModel {
	itemSku: string;
	bunBarcode: string;
	pslId: number;
	aQty: number;
	rQty: number;
	iQty: number;
}
interface JobNumberProps {
	jobNumber: string;
	processType: ProcessTypeEnum;
	updateChanges:(isChange: boolean) => void;
	iNeedActionItems: boolean;
}

export const IpsDashboardPopup: React.FC<JobNumberProps> = ({ jobNumber, processType, updateChanges, iNeedActionItems }) => {
	const [refreshKey, setRefreshKey] = useState(0);
	const processService = new ProcessingJobsService();
	const user = useAppSelector((state) => state.user.user?.user);
	const invIssuanceService = new InvIssuanceService();
	const [allocations, setAllocations] = useState<AllocationModel[]>([]);
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
			title={<span  style={{ display: 'flex', justifyContent:'center' }}>IPS Dashboard Job Details</span>}
			bordered
			size="small"
			bodyStyle={{padding:'0'}}
			extra={
				<Button
					icon={<ReloadOutlined />}
					onClick={handleRefresh}
					type="text"
					title="Refresh All"
				/>
			}
		>
			<Space direction="vertical" size="middle" style={{ width: "100%" }}>
				<IPSStrimDashboardJobPage jobNumber={jobNumber} refreshKey={refreshKey} />
				<Row gutter={16}>
					<Col span={12}>
						<IPSInventoryAllocationsTablePage iNeedActionItems={iNeedActionItems} jobNumber={jobNumber} processType={processType} refreshKey={refreshKey} allocations={allocations} requestDetails={inventoryRequests} />
					</Col>
					<Col span={12}>
						<IPSRMAllocationsTablePage jobNumber={jobNumber} processType={processType} refreshKey={refreshKey} allocations={allocations} requestDeatils={rmRequests} />
					</Col>
				</Row>
				<IPSStrimDashboardInventoryRequestPage iNeedActionItems={iNeedActionItems} handleRefresh={handleRefresh} jobNumber={jobNumber} updateChanges={updateChanges} refreshKey={refreshKey} />
				<IPSStrimDashboardRMRequestPage iNeedActionItems={iNeedActionItems} handleRefresh={handleRefresh} jobNumber={jobNumber} updateChanges={updateChanges} refreshKey={refreshKey} />
			</Space>
		</Card>
	);
};

export default IpsDashboardPopup;
