import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CartonPrintModel, CartonPrintReqDto, CommonIdReqModal, CommonResponse, PackingTableJobsDto, PackingTableJobsResponse, PackJobModel, PackJobPlanningRequest, PackJobResModel, PackJobsResponse, PackJobStatusEnum, PackMatReqStatusEnum, PkRatioModel, PlanPackJobModel, PoIdRequest, PoPackJobResponse, unPlanRequest } from "@xpparel/shared-models";
import { DataSource, MoreThanOrEqual } from "typeorm";
import { TransactionalBaseService } from "../../base-services";
import { ITransactionManager } from "../../database/typeorm-transactions";
import { PackTableEntity } from "../__masters__/pack-table/entities/pack-table.entity";
import { PackTableRepoInterface } from "../__masters__/pack-table/repositories/pack-table.repo.interface";
import { ConfigLeastAggregatorEntity } from "../packing-list/entities/config-least-aggregator.entity";
import { ConfigLeastChildEntity } from "../packing-list/entities/config-least-child.entity";
import { CrtnEntity } from "../packing-list/entities/crtns.entity";
import { JobHeaderEntity } from "../packing-list/entities/job-header.entity";
import { PLConfigEntity } from "../packing-list/entities/pack-list.entity";
import { JobHeaderRepoInterface } from "../packing-list/repositories/job-header-repo.interface";
import { PackingMaterialReqRepoInterface } from "../packing-material-request/repositories/packing-material-req-repo-interface";
import { PKMSProcessingOrderRepoInterface } from "../pre-integrations/pkms-po-repositories/interfaces/pkms-processing-order.repo.interface";
import { PKMSProcessingOrderEntity } from "../pre-integrations/pkms-po-entities/pkms-processing-order-entity";
import { PKMSProductSubLineFeaturesEntity } from "../pre-integrations/pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSPoLineEntity } from "../pre-integrations/pkms-po-entities/pkms-po-line-entity";

@Injectable()
export class PackJobService extends TransactionalBaseService {
	constructor(
		@Inject('JobHeaderRepoInterface')
		private readonly packJobRepository: JobHeaderRepoInterface,
		@Inject('PackTableRepoInterface')
		private readonly packTableRepo: PackTableRepoInterface,
		@Inject('PackingMaterialReqRepoInterface')
		private readonly packMaterialReq: PackingMaterialReqRepoInterface,
		@Inject('PKMSProcessingOrderRepoInterface')
		private readonly poRepo: PKMSProcessingOrderRepoInterface,
		@Inject('LoggerService')
		logger: LoggerService,
		@Inject('TransactionManager')
		transactionManager: ITransactionManager,
		private dataSource: DataSource

	) {
		super(transactionManager, logger)
	}

	async unPlanPackJobRequestsFromPackTable(reqData: unPlanRequest): Promise<CommonResponse> {
		const currPlanningJOb = reqData.packJobs[0];
		const reqRecord = await this.packJobRepository.findOne({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode, jobNumber: currPlanningJOb.packJobNumber } })
		if (!reqRecord) {
			throw new ErrorResponse(36021, `Request ${currPlanningJOb.packJobNumber} does not exist`);
		}
		if (reqRecord.status == PackJobStatusEnum.COMPLETED) {
			throw new ErrorResponse(36022, `Request ${currPlanningJOb.packJobNumber} is already completed. You cannot unplan`);
		}
		await this.packJobRepository.update({ companyCode: reqData.companyCode, unitCode: reqData.unitCode, jobNumber: currPlanningJOb.packJobNumber, }, { workStationId: null, workStationDesc: '', status: PackJobStatusEnum.OPEN });

		return new CommonResponse(true, 36023, 'Request unplanned successfully')

	}
	async getPlannedPackJobRequestsOfPackTable(req: PackJobPlanningRequest): Promise<PackingTableJobsResponse> {
		const workStations = new PackTableEntity()
		workStations.id = req.workStationsId
		const jobRequest = await this.packJobRepository.getPlannedPackJobDataByTableId(req);

		if (jobRequest.length == 0) {
			throw new ErrorResponse(36024, 'No inprogress and completed pack jobs requests are found');
		}
		const tableData = await this.packTableRepo.findOne({ where: { id: req.workStationsId } })
		const jobPlanInfos: PackJobModel[] = [];
		let cartonsCount = 0
		for (const packJob of jobRequest) {
			const cartonsReq = new CartonPrintReqDto(packJob.po_id, packJob.pk_config_id, req.username, req.unitCode, req.companyCode, req.userId, packJob.pack_job_id);
			const packedCartons = await this.getCartonPrintData(cartonsReq);
			const jobData = new PackJobModel(packJob.pack_job_id, packJob.job_number, packJob.po_id, packJob.cartons, packJob.priority, packJob.request_no, packJob.request_id, packJob.mat_request_on, packJob.planned_date_time, packJob.mat_status ? packJob.mat_status : PackMatReqStatusEnum.OPEN, packedCartons.data, packedCartons.data.cartonsPerPackJob);
			jobData.poId = packJob.po_id;
			jobData.tableId = packJob.work_station_id;
			cartonsCount += packedCartons.data.cartonsPerPackJob;
			jobPlanInfos.push(jobData)
		}
		const finalResult = new PackingTableJobsDto(tableData.id, tableData.tableDesc, tableData.tableName, jobPlanInfos, cartonsCount)
		return new PackingTableJobsResponse(true, 36025, 'Pack Tables planned successfully', finalResult);
	}


	async getYetToPlanPackJobs(req: CommonIdReqModal): Promise<PackJobsResponse> {
		const data: PackJobModel[] = []
		const YetToPlanPackJobs = await this.packJobRepository.getYetToPlanPackJobs(req.id, req.companyCode, req.unitCode)
		for (const planedJobs of YetToPlanPackJobs) {
			//TODO:
			const cartonsReq = new CartonPrintReqDto(planedJobs.po, planedJobs.pk_config_id, req.username, req.unitCode, req.companyCode, req.userId, planedJobs.id);
			const packedCartons = await this.getCartonPrintData(cartonsReq);
			const materialData = await this.packMaterialReq.findOne({ where: { id: planedJobs.pk_mat_req_id, companyCode: req.companyCode, unitCode: req.unitCode } })
			const finalResult = new PackJobModel(planedJobs.id, planedJobs.job_number, planedJobs.po, planedJobs.job_qty, planedJobs.priority, materialData?.requestNo, planedJobs.pk_mat_req_id, materialData?.matReqOn, planedJobs.planned_date_time, materialData?.matStatus, packedCartons.data)
			data.push(finalResult);
		}
		if (data.length > 0) {
			return new PackJobsResponse(true, 967, 'Data retrieved successfully', data);
		} else {
			return new PackJobsResponse(false, 965, 'No Data Found', [])
		}
	};

	async getCartonPrintData(req: CartonPrintReqDto): Promise<CommonResponse> {
		let data: CartonPrintModel[] = [];
		const whereClause = new CrtnEntity;
		whereClause.pkConfigId = req.packListId;
		whereClause.companyCode = req.companyCode;
		whereClause.unitCode = req.unitCode;
		if (req.packJobId) {
			whereClause.pkJobId = req.packJobId;
		}
		const findCartons = await this.dataSource.getRepository(CrtnEntity).find({ where: whereClause });
		const packListData = await this.dataSource.getRepository(PLConfigEntity).findOne({ where: { id: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
		const findPoNo = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['prcOrdDescription', 'processingSerial'], where: { id: packListData.poId, companyCode: req.companyCode, unitCode: req.unitCode } })
		const findPoProperties = await this.dataSource.getRepository(PKMSProductSubLineFeaturesEntity).findOne({ select: ['destination', 'deliveryDate', 'fgColor', 'styleCode', 'moNumber', 'customerName'], where: { processingSerial: findPoNo.processingSerial, companyCode: req.companyCode, unitCode: req.unitCode } })

		for (const carton of findCartons) {
			const cLeastChild = await this.dataSource.getRepository(ConfigLeastChildEntity).find({ select: ['ratio', 'size', 'color', 'leastAggregator'], where: { poId: req.poId, parentHierarchyId: carton.cartonProtoId, companyCode: req.companyCode, unitCode: req.unitCode } });
			const colors = [];
			const mapForCLeastChild = new Map<string, PkRatioModel>();
			for (const rec of cLeastChild) {
				const cLChild = await this.dataSource.getRepository(ConfigLeastAggregatorEntity).findOne({ select: ['count'], where: { id: rec.leastAggregator } })
				if (!mapForCLeastChild.get(rec.size + rec.color)) {
					mapForCLeastChild.set(rec.size + rec.color, new PkRatioModel(rec.size, (rec.ratio * cLChild?.count)))
				} else {
					mapForCLeastChild.get(rec.size + rec.color).ratio += (rec.ratio * cLChild?.count);
				}
				colors.push(rec.color);
			}
			const removeDuplicates = [...new Set(colors)];

			//TODO: need to add poNumber,address,orderRefNo,destination
			const result = new CartonPrintModel(carton.barcode, findPoNo.prcOrdDescription, carton.style, removeDuplicates.join(','), Array.from(mapForCLeastChild.values()), carton.requiredQty, findPoProperties.destination, carton.exfactory, packListData.plConfigNo, undefined, findPoProperties.moNumber, findPoProperties.customerName, 1);
			data.push(result);
		}
		const ctnNo = new Set<string>();
		const poNo = new Set<string>();
		const style = new Set<string>();
		const color = new Set<string>();
		const sizeRatio = new Map<string, PkRatioModel>();
		const destination = new Set<string>();
		const exFactory = new Set<string>();
		const packListNo = new Set<string>();
		const buyerAddress = new Set<string>();
		let cartonQty = 0;
		for (const crtns of data) {
			ctnNo.add(crtns.ctnNo);
			poNo.add(crtns.poNo)
			style.add(crtns.style)
			color.add(crtns.color)
			for (const si of crtns.sizeRatio) {
				if (!sizeRatio.has((String(si.ratio) + si.size))) {
					sizeRatio.set(si.ratio + si.size, si)
				}
			}
			cartonQty += crtns.cartonQty
			destination.add(crtns.destination)
			exFactory.add(crtns.exFactory)
			packListNo.add(crtns.packListNo)
			buyerAddress.add(crtns.buyerAddress)
		}
		const ctnNoAfterRemovedDuplicates = [...ctnNo].join(',');
		const poNoAfterRemovedDuplicates = [...poNo].join(',');
		const styleAfterRemovedDuplicates = [...style].join(',');
		const colorAfterRemovedDuplicates = [...color].join(',');
		const destinationAfterRemovedDuplicates = [...destination].join(',');
		const exFactoryAfterRemovedDuplicates = [...exFactory].join(',');
		const packListNoAfterRemovedDuplicates = [...packListNo].join(',');
		const buyerAddressAfterRemovedDuplicates = [...buyerAddress].join(',');

		//TODO: need to add orderRefNo
		const packingCartons = new CartonPrintModel(
			ctnNoAfterRemovedDuplicates,
			poNoAfterRemovedDuplicates,
			styleAfterRemovedDuplicates,
			colorAfterRemovedDuplicates,
			Array.from(sizeRatio.values()),
			cartonQty,
			destinationAfterRemovedDuplicates,
			exFactoryAfterRemovedDuplicates,
			packListNoAfterRemovedDuplicates,
			buyerAddressAfterRemovedDuplicates,
			findPoProperties.moNumber,
			findPoProperties.customerName,
			ctnNo.size
		)
		return new CommonResponse(true, 967, "Data Retrieved Successfully", packingCartons);
	};


	async planPackJobToPackTable(req: PlanPackJobModel): Promise<CommonResponse> {
		if (req.packJobs.length > 1) {
			throw new ErrorResponse(36026, "you can plan only one request at a time")
		}
		// check if the request is available in the cut-table-plan
		const currPlanningJob = req.packJobs[0];
		const reqRecords = await this.packJobRepository.findOne({ select: ['id', 'workStationId', 'workStationDesc'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: currPlanningJob.packJobId } })
		if (!reqRecords) {
			throw new ErrorResponse(36027, "No packJobs are available")
		}
		if (reqRecords.workStationId) {
			throw new ErrorResponse(36028, "packJobs already mapped to packTable")
		}
		const packTables = await this.packTableRepo.findOne({ where: { id: req.packTableId, companyCode: req.companyCode, unitCode: req.unitCode } });
		if (!packTables) {
			throw new ErrorResponse(36029, "given table id doesn't exist")
		}
		let priority = 0;
		// If np priority is provided, then plan it to the last
		if (!currPlanningJob.priority) {
			// get the max priority for the current table
			const maxPriority = await this.packJobRepository.getMaxPriorityForWorkstationId(req.packTableId, req.companyCode, req.unitCode);
			priority = maxPriority + 1;
		} else {
			priority = currPlanningJob.priority;
		}
		const tableDescription = packTables.tableDesc 
		return this.executeWithTransaction(async (transactionManager) => {
			await transactionManager.getRepository(JobHeaderEntity).update({ id: reqRecords.id, companyCode: req.companyCode, unitCode: req.unitCode }, {
				plannedDateTime: () => `Now()`, updatedUser: req.username, workStationId: req.packTableId, workStationDesc: tableDescription, status: PackJobStatusEnum.IN_PROGRESS, priority: priority
			})
			if (currPlanningJob.priority > 0) {
				await this.updateThePrioritiesBasedOnThePlan(req.packTableId, currPlanningJob.priority, reqRecords.id, req.companyCode, req.unitCode, transactionManager);
			}
			return new CommonResponse(true, 36030, 'Pack jobs are plan to pack table')
		})

	}

	async updateThePrioritiesBasedOnThePlan(tableId: number, priority: number, currentId: number, companyCode: string, unitCode: string, manager?: ITransactionManager): Promise<boolean> {
		let limiter = priority;
		// const packTable = new PackTableEntity();
		// packTable.id = tableId;
		const hightPriorityRequests = await manager.getRepository(JobHeaderEntity).find({ select: ['id', 'priority'], where: { companyCode: companyCode, unitCode: unitCode, workStationId: tableId, status: PackJobStatusEnum.IN_PROGRESS, priority: MoreThanOrEqual(priority) }, order: { priority: 'ASC' } });
		for (const rec of hightPriorityRequests) {
			if (currentId == rec.id) {
				continue;
			}
			// if the current record priority is already greater than +1 of the incoming priority, then dont update it
			if (rec.priority <= limiter) {
				await manager.getRepository(JobHeaderEntity).update({ id: rec.id, companyCode: companyCode, unitCode: unitCode }, { priority: () => `priority + 1` });
				limiter += 1;
			}
		}
		return true;
	}

	async getPackJobsForPo(req: PoIdRequest): Promise<PoPackJobResponse> {
		const data: PackJobResModel[] = []
		const packOrder = await this.poRepo.find({ where: { id: req.poID } })
		for (const po of packOrder) {
			const PackJobs = await this.packJobRepository.find({ where: { poId: po.id } })
			for (const rec of PackJobs) {
				const packData = new PackJobResModel(rec.id, rec.jobNumber)
				data.push(packData)
			}
		}
		return new PoPackJobResponse(true, 967, 'Data Retrieved Successfully', data)

	}




}

