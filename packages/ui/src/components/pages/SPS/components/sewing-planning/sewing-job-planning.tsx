import { CommonRequestAttrs, GbGetAllLocationsDto, GBSectionRequest, GetAllSectionsResDto, PJP_LocationWiseJobsModel, PJP_ProcessingJobPlanningRequest, PJP_StyleProductProcessingSerialReq, PJP_UnPlannedProcessingJobsModel, PO_StyleInfoModel, ProcessingOrderInfoModel, ProcessTypeEnum, processTypeEnumDisplayValues, ProductInfoModel, sewPlanProcessTypeOptions, StyleCodeRequest, StyleProductCodeRequest } from "@xpparel/shared-models";
import { GbConfigHelperService, ProcessingJobsPlanningService, SewingProcessingOrderService } from "@xpparel/shared-services";
import { Affix, Card, Col, Form, message, Modal, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
import SewSectionCollapse from "./sew-sections-collapse";
import SewingJobGroupContainer from "./sewing-job-group-container";
import './sewing-order-planning.css';

const { Option } = Select;

const ManufacturingOrderComponent = () => {
	const [selectedStyle, setSelectedStyle] = useState<string>(undefined);
	const [selectedProduct, setSelectedProduct] = useState<string>(undefined);
	const [selectedSewSerialId, setSelectedSewSerialId] = useState<number>(undefined);
	const [selectedProcessType, setSelectedProcessType] = useState<ProcessTypeEnum>(undefined);
	const service = new SewingProcessingOrderService();
	const planningService = new ProcessingJobsPlanningService();
	const user = useAppSelector((state) => state.user.user.user);
	const [sewingOrderData, setSewingOrderData] = useState<PO_StyleInfoModel[]>([])
	const [sewingOrderLinesData, setSewingOrderLinesData] = useState<ProductInfoModel[]>()
	const [sewSerialData, setSewSerialData] = useState<ProcessingOrderInfoModel[]>([])
	const [unplannedJobOrdersData, setUnplannedJobOrdersData] = useState<PJP_UnPlannedProcessingJobsModel[]>([]);
	const globalService = new GbConfigHelperService()
	const [sectionData, setSectionData] = useState<GetAllSectionsResDto[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pendingDropDetails, setPendingDropDetails] = useState<{ e: React.DragEvent; targetModuleId: string; moduleType: string; selectedDate: any; } | null>(null);
	const [locationData, setLocationData] = useState<GbGetAllLocationsDto[]>()
	const [plannedJobs, setPlannedJobs] = useState<PJP_LocationWiseJobsModel[]>([])
	const [moduleAssignments, setModuleAssignments] = useState<{ moduleId: string[] }>();
	const [unplannedJob, setUnPlannedJob] = useState<string>();
	const [refreshSections, setRefreshSections] = useState<number[]>([]);
	const [unPlanBlockRefreshKey, setUnPlanBlockRefreshKey] = useState<number>(0);

	useEffect(() => {
		getSPSOrderCreatedStyles()
		getModuleAssignments()
	}, [])

	const getSPSOrderCreatedStyles = async () => {
		const request = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
		try {
			const res = await service.getSewOrderCreatedStyles(request);
			if (res.status) {
				setSewingOrderData(res.data);
			} else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		} catch (error) {
			AlertMessages.getErrorMessage(error.message);
		}
	};


	const getProductInfoForGivenStyle = async (value) => {
		try {
			const request = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, value)
			const res = await service.getProductInfoForGivenStyle(request)
			if (res.status) {
				setSewingOrderLinesData(res.data);
			} else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
		}
	}

	const getSPSOrderInfoByStyeAndProduct = async (productCode: string) => {
		try {
			const request = new StyleProductCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyle, productCode);
			const res = await service.getSPSOrderInfoByStyeAndProduct(request);
			if (res.status) {
				setSewSerialData(res.data);
			} else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
		}
	};

	const getUnPlannedProcessingJobs = (processingSerial: number) => {
		try {
			const request = new PJP_StyleProductProcessingSerialReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyle, selectedProduct, processingSerial, selectedProcessType);
			planningService.getUnPlannedProcessingJobs(request).then((res) => {
				if (res.status) {
					setUnplannedJobOrdersData(res.data);
				}
				else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setUnplannedJobOrdersData([])
				}
			})
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
			setUnplannedJobOrdersData([])
		}
	};


	const getAllSectionsByDepartmentsFromGbC = (value: ProcessTypeEnum) => {
		if (!value) {
			setSectionData([]);
			return;
		}
		const request = new GBSectionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, [value])
		try {
			globalService.getAllSectionsByDepartmentsFromGbC(request).then(res => {
				if (res.status) {
					setSectionData(res.data);
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setSectionData([]);
				}
			})
		} catch (err) {
			setSectionData([]);
			message.error('Something went wrong while fetching the sections.');
		}
	}

	const getModuleAssignments = () => {
		const modules = plannedJobs.map((job) => job.locationCode)
		setModuleAssignments({ moduleId: modules })
	};


	const handleModalOk = () => {
		if (pendingDropDetails) {
			const { e, targetModuleId, moduleType, selectedDate } = pendingDropDetails;
			onDrop(e, targetModuleId, moduleType, selectedDate, undefined);
		}
		setIsModalVisible(false);
		setPendingDropDetails(null);
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
		setPendingDropDetails(null);
	};

	const handleStyleChange = (value: string) => {
		setSelectedStyle(value);
		setSelectedProduct(null);
		getProductInfoForGivenStyle(value)

	};

	const handleProductChange = (value: string) => {
		setSelectedProduct(value);
		const selectedOrderLine = sewingOrderLinesData.find(
			(orderLine) => orderLine.productCode === value
		);
		if (selectedOrderLine) {
			getSPSOrderInfoByStyeAndProduct(selectedOrderLine.productCode);
		}
		setUnplannedJobOrdersData([]);
		setSelectedSewSerialId(null)
	};

	const handleSewSerialChange = (value: number) => {
		setSelectedSewSerialId(value);
		getUnPlannedProcessingJobs(value)
	};
	const handleChangeProcessType = (value: ProcessTypeEnum) => {
		setSelectedProcessType(value);
		getAllSectionsByDepartmentsFromGbC(value)

	}

	const onDragStart = (event: React.DragEvent, job: string, locationCode: string, sectionId: number) => {
		event.dataTransfer.setData("jobNo", job);
		event.dataTransfer.setData("locationCode", locationCode);
		event.dataTransfer.setData("fromSectionId", `${sectionId}`);;
		setUnPlannedJob(job);
	};

	const onDrop = async (e: React.DragEvent, targetModuleId: string, moduleType: string, selectedDate: any, sectionId: number) => {
		e.preventDefault();
		if (!selectedSewSerialId) {
			AlertMessages.getErrorMessage("Please select Process Order")
			return
		}

		let isUnJobsRefresh = false;

		const refreshSections = [];
		const fromLocation = e.dataTransfer.getData("locationCode");
		if (fromLocation == targetModuleId) {
			return;
		}

		const jobNo = e.dataTransfer.getData("jobNo");
		if (fromLocation != 'undefined') {
			refreshSections.push(Number(e.dataTransfer.getData("fromSectionId")))
		} else {
			isUnJobsRefresh = true;
		}
		if (targetModuleId) {
			refreshSections.push(sectionId);
			const reverseProcessTypeEnumMap = Object.entries(processTypeEnumDisplayValues).reduce((acc, [key, value]) => {
				acc[value] = key;
				return acc;
			}, {} as Record<string, string>);
			// const moduleCode = reverseProcessTypeEnumMap[moduleType];
			// console.log(moduleCode,'moduleCode---------')
			// console.log(selectedProcessType, 'selectedProcessType------------')
			// if (selectedProcessType !== moduleCode) {
			// 	message.error(`Job type (${selectedProcessType}) does not match location type (${moduleType}).`);
			// 	return;
			// }
		} else {
			isUnJobsRefresh = true;
		}

		try {
			const req = new PJP_ProcessingJobPlanningRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo, targetModuleId, selectedDate);
			const res = await planningService.planProcessingJobToLocation(req);
			if (res.status) {
				AlertMessages.getSuccessMessage(res.internalMessage);
				setRefreshSections(refreshSections);
				if (isUnJobsRefresh) {
					setUnPlanBlockRefreshKey(pre => pre + 1);
					getUnPlannedProcessingJobs(selectedSewSerialId)
				}
			} else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		} catch (error) {
			AlertMessages.getErrorMessage(error.message);
		}
	};

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	return (
		<Card size="small" title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Job Order Planning</span>} headStyle={{ backgroundColor: '#01576f' }}>
			<Form layout="horizontal" >
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item label="Process Type" >
							<Select
								placeholder="Select Processing Serial No"
								onChange={e => handleChangeProcessType(e)}
								value={selectedProcessType}
								allowClear
								showSearch
								optionFilterProp="children"
							>
								{sewPlanProcessTypeOptions.map(processType => (
									<Option key={processType} value={processType}>
										{processTypeEnumDisplayValues[processType]}
									</Option>
								)
								)}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item label="Style Code" >
							<Select
								placeholder="Style Code"
								onChange={handleStyleChange}
								allowClear
								showSearch
							>
								{sewingOrderData?.map((order) => (
									<Option key={order.styleCode} value={order.styleCode}>
										{order.styleCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item label="Product Code" >
							<Select
								placeholder="Product Code"
								onChange={handleProductChange}
								value={selectedProduct || undefined}
								disabled={!selectedStyle}
								allowClear
								showSearch

							>
								{selectedStyle &&
									sewingOrderLinesData?.map((sewingOrder) => (
										<Option key={sewingOrder.productCode} value={sewingOrder.productCode}>
											{sewingOrder.productCode}
										</Option>
									))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item label="Processing Serial" >
							<Select
								placeholder="Select Processing Serial No"
								onChange={handleSewSerialChange}
								value={selectedSewSerialId || undefined}
								disabled={!selectedProduct}
								allowClear
								showSearch
								optionFilterProp="children"
							>
								{selectedProduct &&
									sewSerialData?.map((ss) => (
										<Option key={ss.processingSerial} value={ss.processingSerial}>
											{ss.prcOrdDescription}
										</Option>
									))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<div style={{ display: 'flex', borderRadius: "10px", marginTop: "10px", }} >
				<div style={{ display: 'flex', flexDirection: 'column', flex: '0.2' }}>
					<Affix offsetTop={70}>
						<SewingJobGroupContainer
							selectedProcessingSerial={selectedSewSerialId}
							jobOrders={unplannedJobOrdersData}
							onDragStart={onDragStart}
							onDrop={onDrop}
							onDragOver={onDragOver}
							refreshKey={unPlanBlockRefreshKey}
						/>
					</Affix>
				</div>
				<div style={{ display: 'flex', flex: '0.8', margin: '0px 0px 0px 10px' }}>
					{selectedProcessType &&
						<SewSectionCollapse onDragOver={onDragOver} onDragStart={onDragStart} onDrop={onDrop} sections={sectionData} refreshSections={refreshSections} />
					}
				</div>
			</div>
			<Modal
				title="Confirm Job Assignment"
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				okText="Yes, Assign"
				cancelText="Cancel"
			>
				<p>Are you sure you want to assign this job to the selected module?</p>
			</Modal>
		</Card>

	);
};

export default ManufacturingOrderComponent;
