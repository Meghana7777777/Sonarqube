import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BarcodeDetailsForQualityResultsModel, BarcodeDetailsForQualityResultsResponse, BarcodeQualityResultsModel, CommonRequestAttrs, GlobalResponseObject, IModuleIdRequest, InputPlanningDashboardModel, IPlannningDowntimeResponse, IPlannningJobModel, IPlannningJobModelResponse, IPlannningJobStatusResponse, IPlannningModuleModel, IPlannningModuleModelResponse, IPlannningSectionModelResponse, IPlannningTrimsResponse, JobSewSerialReq, jobStatusTypeModel, ModuleDowntimeDataModel, SequencedIJobOperationModel, SequencedIJobOperationResponse, SewingIJobNoRequest, TrimDetailsModel, TrimStatusEnum } from "@xpparel/shared-models";
import { SewingJobGenActualService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { SJobLineOperationsRepo } from "../entities/repository/s-job-line-operations";
import { SJobLinePlanRepo } from "../entities/repository/s-job-line-plan.repository";
import { WsDownTimeRepo } from "../entities/repository/ws-downtime.repository";
import { SJobLineOperationsEntity } from "../entities/s-job-line-operations";
import { ModuleRepository } from "../master/module/repo/module-repo";
import { SectionRepository } from "../master/section/section.repository";
import { WorkstationRepository } from "../master/workstation/workstation.repository";
import { SewingJobGenerationServiceForMO } from "../sewing-job-generation/sewing-job-generation-for-mo.service";
import { BarcodeQualityResultsEntity } from "../entities/barcode-quality-results.entity";
import { BarcodeQualityResultsRepo } from "../entities/repository/barcode-quality-details.repo";
import { BarcodeDetailsForQualityResultsDto } from "./barcode-quality-results.dto";
import { SJobSubLineRepo } from "../entities/repository/s-job-sub-line.repository";
import { SJobLineEntity } from "../entities/s-job-line.entity";


@Injectable()
export class InputPlanningDashboardService {
	constructor(
		private sJobLinePlanRepo: SJobLinePlanRepo,
		private sJobLineOperationsRepo: SJobLineOperationsRepo,
		private moduleRepository: ModuleRepository,
		private sectionRepository: SectionRepository,
		private sewingJobGenActualService: SewingJobGenActualService,
		private workstationRepository: WorkstationRepository,
		private barcodeQualityResultsRepo: BarcodeQualityResultsRepo,
		private sJobSubLine: SJobSubLineRepo,
		@Inject(forwardRef(() => SewingJobGenerationServiceForMO)) private sewJobGenService: SewingJobGenerationServiceForMO
	) {

	}

	// async getJobDetailsByJobNo(req: SewingIJobNoRequest): Promise<IPlannningJobModelResponse> {
	// 	try {

	// 		const { jobNo } = req;
	// 		const jobDetails = await this.sOrderRepo.getIJobDetailsByJobNo(jobNo, req.unitCode, req.companyCode);
	// 		const operations = await this.sJobLineOperationsRepo.getSequencedOperationsByJobId(jobNo, req.unitCode, req.companyCode);
	// 		if (!operations || operations.length === 0) {
	// 			throw new Error(`No operations found for job number: ${req.jobNo}`);
	// 		}
	// 		const operationData: SequencedIJobOperationModel[] = operations.map((op) => new SequencedIJobOperationModel(op.jobNo, op.operationCode, op.originalQty, op.inputQty, op.goodQty, op.rejectionQty, op.openRejections, op.operationSequence, op.smv)
	// 		);
	// 		const firstOperationGoodQty = operationData[0].goodQty;
	// 		const firstOperationRejectionQty = operationData[0].rejectionQty;
	// 		const lastOperationGoodQty = operationData[operationData.length - 1].goodQty;
	// 		const lastOperationRejectionQty = operationData[operationData.length - 1].rejectionQty;
	// 		const firstOperationReportedQty = firstOperationGoodQty + firstOperationRejectionQty;
	// 		const lastOperationReportedQty = lastOperationGoodQty + lastOperationRejectionQty;
	// 		let jobCompletionPercentage = 0;
	// 		if (firstOperationGoodQty > 0) {
	// 			jobCompletionPercentage = (lastOperationGoodQty / firstOperationGoodQty) * 100;
	// 		}
	// 		const workInProgressQty = lastOperationReportedQty - firstOperationReportedQty;
	// 		const isRejected = operations.some((operation) => operation.openRejections > 0);
	// 		const cutJobdetails = "";
	// 		const jobStatusResponse: IPlannningJobStatusResponse = await this.getJobStatusByJobNo(req.username, req.userId, req.companyCode, req.unitCode, req.jobNo, jobDetails.sewSerial);
	// 		const jobStatus: jobStatusTypeModel = jobStatusResponse.data;

	// 		const planningJobModel = new IPlannningJobModel(jobDetails.sewSerial, jobDetails.jobNo, jobStatus, jobDetails.mOrderNo, jobDetails.mLineOrderNo, jobDetails.productName, jobDetails.productType, cutJobdetails, isRejected, jobCompletionPercentage, workInProgressQty);
	// 		return new IPlannningJobModelResponse(true, 980, 'Success', planningJobModel);
	// 	} catch (err) {
	// 		throw new Error(`Failed to retrieve job details for jobNo: ${req.jobNo}. Error: ${err.message}`);
	// 	}
	// }

	async getModuledetailsByModuleCode(req: IModuleIdRequest): Promise<IPlannningModuleModelResponse> {
		try {
			const { moduleCode } = req;
			const moduleData = await this.moduleRepository.getIModuleDataByModuleCode(moduleCode, req.unitCode, req.companyCode);

			if (!moduleData || !moduleData.jobs.length) {
				throw new Error(`Module not found for moduleCode: ${moduleCode}`);
			}

			const jobDetailes: IPlannningJobModel[] = [];
			let totalWorkInProgressQty = 0;
			for (const job of moduleData.jobs) {
				const sewinegReq = new SewingIJobNoRequest(req.username, req.unitCode, req.companyCode, req.userId, job.jobNo);
				const jobDetailsResponse = null;
				// await this.sewJobGenService.getJobDetailsForInputDashboard(sewinegReq);

				if (jobDetailsResponse.status) {
					totalWorkInProgressQty += jobDetailsResponse.data.workInProgress;
					jobDetailes.push(jobDetailsResponse.data)
				}
			}

			const downtimeDetails = await this.workstationRepository.getModuleDowntimeData(moduleCode, req.unitCode, req.companyCode);
			const moduleMetrics = await this.sJobLinePlanRepo.getModuleMetrics(moduleCode, req.unitCode, req.companyCode);
			const planningModuleModel = new IPlannningModuleModel(moduleData.moduleId, moduleCode, moduleData.moduleColor, jobDetailes, downtimeDetails, moduleMetrics, totalWorkInProgressQty);
			return new IPlannningModuleModelResponse(true, 980, 'Success', [planningModuleModel]);

		} catch (err) {

			return new IPlannningModuleModelResponse(
				false,
				26071,
				`Failed to retrieve module details for moduleCode: ${req.moduleCode}. Error: ${err.message}`,
				[]
			);
		}
	}

	async getInputPlanningdashBoardData(req: CommonRequestAttrs): Promise<IPlannningSectionModelResponse> {
		try {
			const sections = await this.sectionRepository.findSections(req.unitCode, req.companyCode);
			if (sections.length === 0) {
				return new IPlannningSectionModelResponse(false,26063, "No sections found", []);
			}
			const sectionDataPromises = sections.map(async (section) => {
				const { sectionId, sectionCode, sectionColor, secType } = section;
				const modules = await this.moduleRepository.getModulesBySectionCode(sectionCode, req.unitCode, req.companyCode);
				const moduleDetailes = [];
				for (const module of modules) {
					const jobDetailsResponse = await this.getModuledetailsByModuleCode({ moduleCode: module.moduleCode, username: req.username, unitCode: req.unitCode, companyCode: req.companyCode, userId: req.userId, });
					for (const rec of jobDetailsResponse.data) {
						moduleDetailes.push(rec)
					}
				}
				const sectionMetrics = { totalPlannedWork: '', totalActualWorkDone: '', overallEfficiencyPercentage: '' }
				const plantIssue = true

				return new InputPlanningDashboardModel(sectionId, sectionCode, sectionColor, secType, moduleDetailes, sectionMetrics, plantIssue);
			});

			const sectionData = await Promise.all(sectionDataPromises);

			return new IPlannningSectionModelResponse(true, 26064, "Input Planning Dashboard data fetched successfully", sectionData);
		} catch (err) {
			return new IPlannningSectionModelResponse(false, 26065, `Failed to fetch Input Planning Dashboard data. Error: ${err.message}`, []);
		}
	}

	async getModuleDowntimeDataByModuleCode(req: IModuleIdRequest): Promise<IPlannningDowntimeResponse> {
		try {
			const downtimeData = await this.workstationRepository.getModuleDowntimeData(req.moduleCode, req.unitCode, req.companyCode);

			if (!downtimeData) {
				throw new Error(`No downtime data found for module code: ${req.moduleCode}`);
			}

			const moduleDowntimeData = new ModuleDowntimeDataModel(
				downtimeData.downTimeStatus,
				downtimeData.downtimeReasons,
				downtimeData.downtimeImpactOnWork
			);

			return new IPlannningDowntimeResponse(true, 26066, "Downtime details fetched successfully", moduleDowntimeData);
		} catch (err) {
			console.error(`Error fetching module downtime data: ${err.message}`);
			throw new Error(`Failed to retrieve module downtime data: ${err.message}`);
		}
	}

	async getTrimsDataByJobNo(req: SewingIJobNoRequest): Promise<IPlannningTrimsResponse> {
		try {
			const trimDetail: TrimDetailsModel[] = []
			// await this.sJobTrimItemsRepo.getTrimsDetailsByJobNo(req.jobNo, req.unitCode, req.companyCode);

			if (!trimDetail) {
				throw new Error(`No trim details found for job number: ${req.jobNo}`);
			}

			return new IPlannningTrimsResponse(true, 26067, 'Trim detail retrieved successfully.', trimDetail);
		} catch (err) {
			console.error(`Error fetching trim details: ${err.message}`);
			return new IPlannningTrimsResponse(false, 26068, `Failed to retrieve trim details: ${err.message}`, null);
		}
	}

	async getJobStatusByJobNo(username: string, userId: number, companyCode: string, unitCode: string, jobNo: string, sewSerial: number): Promise<IPlannningJobStatusResponse> {

		const jobData: SJobLineOperationsEntity = await this.sJobLineOperationsRepo.findOne({
			where: { jobNumber: jobNo },
		});

		const operations = await this.sJobLineOperationsRepo.getSequencedOperationsByJobId(jobNo, unitCode, companyCode);
		const operationData: SequencedIJobOperationModel[] = operations.map((op) => new SequencedIJobOperationModel(op.processingSerial, op.processType, op.jobNumber, op.operationGroup, '', op.operationCodes, op.originalQty, op.inputQty, op.goodQty, op.rejectionQty, op.openRejections, op.operationSequence, op.smv));
		const firstOperationGoodQty = operationData[0].goodQty;
		const firstOperationRejectionQty = operationData[0].rejectionQty;
		const firstOperationReportedQty = firstOperationGoodQty + firstOperationRejectionQty;
		const pendingFirstOperationReportedQty = operationData[0].inputQty - (firstOperationReportedQty)
		const jobSewSerialReq = new JobSewSerialReq(username, userId, unitCode, companyCode, jobNo, sewSerial, false);

		const cutPannelQtyResponse = await this.sewingJobGenActualService.getCutPanelsInfoForJobNumber(jobSewSerialReq);
		let totalCutEligibleQty = 0;
		if (Array.isArray(cutPannelQtyResponse.data)) {
			cutPannelQtyResponse.data.forEach((panel) => {
				if (panel.cutEligibleQty) {
					totalCutEligibleQty += panel.cutEligibleQty;
				}
			});
		} else {
			console.error('The cutPannelQty data is not in the expected format', cutPannelQtyResponse);
		}

		let trimStatus: jobStatusTypeModel = null;
		let inputStatus: jobStatusTypeModel;
		if (jobData) {
			// const trimData: SJobTrimItemsEntity = await this.sJobTrimItemsRepo.findOne({
			// 	where: { jobNo },
			// });
			const trimData= null;
			if (trimData) {
				if (trimData.status === TrimStatusEnum.ISSUED || trimData.status === TrimStatusEnum.PARTIALLY_ISSUED) {
					const originalQty = jobData.originalQty
					inputStatus = this.getInputStatus(pendingFirstOperationReportedQty, totalCutEligibleQty, firstOperationReportedQty, originalQty);
					return new IPlannningJobStatusResponse(true, 980, 'Success', inputStatus);
				} else {
					trimStatus = this.getTrimStatus(trimData.status);
					return new IPlannningJobStatusResponse(true, 980, 'Success', trimStatus);
				}
			}
		}

		trimStatus = this.getTrimStatus(TrimStatusEnum.OPEN);
		return new IPlannningJobStatusResponse(true, 980, 'Success', trimStatus);
	}

	private getTrimStatus(status: TrimStatusEnum): jobStatusTypeModel {
		let statusText: string;
		let shape: string;
		let color: string;
		switch (status) {
			case TrimStatusEnum.OPEN:
				statusText = 'Open';
				shape = 'circle';
				color = 'gray';
				break;
			case TrimStatusEnum.PARTIALLY_ISSUED:
				statusText = 'Partially Issued';
				shape = 'circle';
				color = 'orange';
				break;
			default:
				statusText = 'Unknown';
				shape = 'circle';
				color = 'red';
				break;
		}
		return new jobStatusTypeModel(statusText, shape, color);
	}

	private getInputStatus(pendingFirstOperationReportedQty: number, totalCutEligibleQty: number, firstOperationReportedQty: number, originalQty: number): jobStatusTypeModel {
		let status: string;
		let shape: string;
		let color: string;
		if (pendingFirstOperationReportedQty > 0 && totalCutEligibleQty === 0) {
			status = 'Open';
			shape = 'hexagon';
			color = 'gray';
		} else if (totalCutEligibleQty < pendingFirstOperationReportedQty && totalCutEligibleQty > 0) {
			status = 'Partial';
			shape = 'hexagon';
			color = 'orange';
		} else if (pendingFirstOperationReportedQty <= totalCutEligibleQty && firstOperationReportedQty === 0) {
			status = 'Partial';
			shape = 'square';
			color = 'gray';
		} else if (pendingFirstOperationReportedQty <= totalCutEligibleQty && originalQty > firstOperationReportedQty) {
			status = 'Partial';
			shape = 'square';
			color = 'orange';
		} else if (pendingFirstOperationReportedQty <= totalCutEligibleQty && originalQty === firstOperationReportedQty) {
			status = 'Partial';
			shape = 'square';
			color = 'green';
		} else {
			status = 'Unknown';
			shape = 'hexagon';
			color = 'red';
		}
		return new jobStatusTypeModel(status, shape, color);
	}

	async getSequencedOperationsByJobId(req: SewingIJobNoRequest): Promise<SequencedIJobOperationResponse> {
		try {
			const operationEntities = await this.sJobLineOperationsRepo.getSequencedOperationsByJobId(req.jobNo, req.unitCode, req.companyCode);
			if (!operationEntities || operationEntities.length === 0) {
				throw new Error(`No operations found for job number: ${req.jobNo}`);
			}

			const operations: SequencedIJobOperationModel[] = operationEntities.map(op => new SequencedIJobOperationModel(op.processingSerial, op.processType, op.jobNumber, op.operationGroup,  op.operationCode.toString(), op.operationCodes, op.originalQty, op.inputQty, op.goodQty, op.rejectionQty, op.openRejections, op.operationSequence, op.smv));
			const firstOperationGoodQty = operations[0].goodQty;
			const firstOperationRejectionQty = operations[0].rejectionQty;
			const lastOperationGoodQty = operations[operations.length - 1].goodQty;
			const lastOperationRejectionQty = operations[operations.length - 1].rejectionQty;
			const firstOperationReportedQty = firstOperationGoodQty + firstOperationRejectionQty;
			const lastOperationReportedQty = lastOperationGoodQty + lastOperationRejectionQty;
			let jobCompletionPercentage = 0;
			if (firstOperationGoodQty > 0) {
				jobCompletionPercentage = (lastOperationGoodQty / firstOperationGoodQty) * 100;
			}
			const workInProgress = lastOperationReportedQty - firstOperationReportedQty;
			return new SequencedIJobOperationResponse(true, 26069, "Operations retrieved successfully", operations);
		} catch (err) {
			console.error(`Error fetching operations: ${err.message}`);
			return new SequencedIJobOperationResponse(false, 26070, `Failed to retrieve operations: ${err.message}`, null
			);
		}
	}

	async saveBarcodeQualityDetails(req: BarcodeDetailsForQualityResultsDto): Promise<GlobalResponseObject> {
		try {
			if (!req || !(req instanceof BarcodeDetailsForQualityResultsDto)) {
				throw new Error('Invalid data: Expected BarcodeDetailsForQualityResultsDto.');
			}
			const barcodeInfo = req.barcode;
			let resourceCode = 'NA';
			const barcodeSplit = barcodeInfo?.split('-');
			if (barcodeSplit) {
				if(barcodeSplit[0] != 'KNIT' && barcodeSplit[1] != 'LB') {
					const jobLineInfo = await this.sJobLinePlanRepo.findOne({where: {jobNumber: barcodeInfo}});
					resourceCode = jobLineInfo?.locationCode;
				} else if (barcodeSplit[0] != 'KNIT' && barcodeSplit[1] == 'LB') {
					const jobInfo = await this.sJobSubLine.findOne({where: {bundleNumber: req.barcode}});
					// const jobactInfo = await this.sJobLine.findOne({where: {id: jobInfo.sJobLineId}});
					// const jobLineInfo = await this.sJobLinePlanRepo.findOne({where: {jobNo: jobactInfo.jobNo}});
					// resourceCode = jobLineInfo?.moduleNo;
				}
			}
			const barcodeQualityResult = new BarcodeQualityResultsEntity();
			barcodeQualityResult.barcode = req.barcode;
			barcodeQualityResult.barcodeType = req.barcodeType;
			barcodeQualityResult.operationCode = req.operationCode;
			barcodeQualityResult.processType = req.processType;
			barcodeQualityResult.failCount = req.failCount;
			barcodeQualityResult.resourceCode = resourceCode;
			barcodeQualityResult.companyCode = req.companyCode;
			barcodeQualityResult.unitCode = req.unitCode;
			barcodeQualityResult.createdUser = req.createdUser;
			barcodeQualityResult.updatedUser = req.updatedUser;

			await this.barcodeQualityResultsRepo.save(barcodeQualityResult);

			return new GlobalResponseObject(true, 1, 'Barcode quality details saved successfully.');
		} catch (error) {
			console.error('Error saving barcode quality details:', error);
			return new GlobalResponseObject(false, 0, error.message || 'An error occurred while saving barcode quality details.');
		}
	}
	

	async getBarcodeQualityDetailsByModuleCode(req: IModuleIdRequest): Promise<BarcodeDetailsForQualityResultsResponse> {
		try {
			const barcodeQualityResults = await this.barcodeQualityResultsRepo.find({ where: { resourceCode: req.moduleCode, companyCode: req.companyCode, unitCode: req.unitCode } });
			const barcodeDetails = barcodeQualityResults.map(result => {
				return new BarcodeQualityResultsModel(result.barcode, result.barcodeType, result.operationCode, result.processType, result.failCount, result.resourceCode);
			});
			return new BarcodeDetailsForQualityResultsResponse(true, 0, 'Data fetched successfully', barcodeDetails);
		} catch (error) {
			console.error('Error fetching barcode quality details:', error);
			return new BarcodeDetailsForQualityResultsResponse(false, 1, error.message || 'An error occurred while fetching barcode details.', []);
		}
	}

}
