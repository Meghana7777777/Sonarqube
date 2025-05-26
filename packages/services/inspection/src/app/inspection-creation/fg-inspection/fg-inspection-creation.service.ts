import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { AllIns, CartonBarCodesReqDto, CommonResponse, FgInsCreateExtRefRequest, FgInsSelectedBatchResponse, GlobalResponseObject, InsFabricInspectionRequestCategoryEnum, InsFgInsSelectedCartonModelAttrs, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsInspectionMaterialEnum, InsInspectionMaterialTypeEnum, InsTypesEnum, InsTypesEnumType, PackFabricInspectionRequestCategoryEnum, PackFinalInspectionStatusEnum, PackJobIdsRequest, PKMSInsStatusReqDto, PKMSIrActivityChangeRequest } from "@xpparel/shared-models";
import { InsPackingHelperService, PackListService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { InsRequestAttributeEntity } from "../../entities/ins-request-attributes.entity";
import { InsRequestHistoryEntity } from "../../entities/ins-request-history.entity";
import { InsRequestItemEntity } from "../../entities/ins-request-items.entity";
import { InsRequestEntity } from "../../entities/ins-request.entity";
import { InsRequestLinesEntity } from "../../entities/ins_request_lines.entity";
import { InsRequestHistoryRepo } from "../../inspection/repositories/ins-request-history.repository";
import { InsRequestItemRepo } from "../../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../../inspection/repositories/ins-request.repository";


@Injectable()
export class FgInspectionCreationService {
	constructor(
		private dataSource: DataSource,
		private inspReqRepo: InsRequestEntityRepo,
		private inspReqItemsRepo: InsRequestItemRepo,
		private insPackingHelperService: InsPackingHelperService,
		private insRequestHistoryRepo: InsRequestHistoryRepo,
		private packListService: PackListService
	) { }

	async createFgInspectionRequest(req: FgInsCreateExtRefRequest): Promise<GlobalResponseObject> {
		console.log('req12345',req);
		const manager = new GenericTransactionManager(this.dataSource);
		try {
			// Fetch selected inspection items from pkms
			const insItemsRes: FgInsSelectedBatchResponse = await this.insPackingHelperService.getFgInspectionSelectedItems(req)

			if (!insItemsRes?.data?.length) {
				throw new Error('No inspection items found');
			}
			const unitCode: string = req.unitCode;
			const companyCode: string = req.companyCode;
			const userName: string = req.username;
			const phId: number[] = req.packListIds;
			let insReqId: number = 0;


			await manager.startTransaction();
			// Save Parent Inspection Request
			const lastReqNum = await this.inspReqRepo.getLastRequestNumberForPackList(phId[0], unitCode, companyCode);
			console.log('lastReqNum4353',lastReqNum)
			const preFix = ` ${phId[0]}` ? 'RR' : 'R';  //check
			const reqCode = ` ${preFix}-${unitCode} -${phId[0]} -${lastReqNum}`;
			// need to create the inspection header and assign rolls to the inspection header

			for (const batch of insItemsRes.data) {
				const style = new Set<string>();
				const packListNo = new Set<string>();
				const po = new Set<string>();
				const delDate = new Set<string>();
				const destination = new Set<string>()
				let rollAttrs: InsFgInsSelectedCartonModelAttrs = { color: [], size: [], quantity: '' };
				const buyerAddress = new Set<string>();
				// console.log('123',)
				const inspHeaderEntityObj = new InsRequestEntity();
				inspHeaderEntityObj.companyCode = companyCode;
				inspHeaderEntityObj.createdUser = userName;
				inspHeaderEntityObj.unitCode = unitCode;
				inspHeaderEntityObj.insCode = reqCode;
				inspHeaderEntityObj.insMaterialType = InsInspectionMaterialTypeEnum.FG;
				inspHeaderEntityObj.insType = req.insType;
				inspHeaderEntityObj.insMaterial = InsInspectionMaterialEnum.CARTON;
				inspHeaderEntityObj.insType = req.insType;
				inspHeaderEntityObj.refIdL1 = batch?.lotInfo[0]?.packListId?.toString();
				inspHeaderEntityObj.refIdL2 = batch?.lotInfo[0]?.packJobId?.toString()||'';
				inspHeaderEntityObj.refIdL3 = batch?.lotInfo[0]?.packOrderID?.toString();
				inspHeaderEntityObj.refJobL1 = batch.batchNo;
				inspHeaderEntityObj.refJobL2 = batch.lotInfo[0]?.packJob|| '';
				inspHeaderEntityObj.refJobL3 = '';
				inspHeaderEntityObj.finalInspectionStatus = InsInspectionFinalInSpectionStatusEnum.OPEN;
				// inspHeaderEntityObj.insActivityStatus = reqModel./equestCategory == FabricInspectionRequestCategoryEnum.RELAXATION ? InspectionInsActivityStatusEnum.INPROGRESS : InspectionInsActivityStatusEnum.OPEN;
				inspHeaderEntityObj.insActivityStatus = InsInspectionActivityStatusEnum.OPEN;
				// TODO : get inspection material type AND material
				// If request fails need to insert another request
				inspHeaderEntityObj.parentRequestId = phId[0] ? phId[0] : null;
				inspHeaderEntityObj.createReRequest = false;

				// TODO: Need to develop a logic for priority
				inspHeaderEntityObj.priority = 0;
				inspHeaderEntityObj.insCreationTime = new Date()

				delDate.add(batch.attrs.delDate[0]);
				destination.add(batch.attrs.destination[0]);



				// NEED TO INSERT INSPECTION ATTRIBUTES BASED ON THE INSPECTION CATEGORY
				// GETTING INSPECTION HEADER ATTRIBUTES
				console.log('inspHeaderEntityObj789',inspHeaderEntityObj)
				const savedInsRequest = await manager.getRepository(InsRequestEntity).save(inspHeaderEntityObj);
				insReqId = savedInsRequest.id;

				for (const lot of batch.lotInfo) {
					const insRequestLine = new InsRequestLinesEntity();


					insRequestLine.companyCode = companyCode;
					insRequestLine.createdUser = userName;
					insRequestLine.unitCode = unitCode;
					insRequestLine.insRequestId = savedInsRequest.id;
					insRequestLine.refIdL1 = lot.packListId?.toString() || '';
					insRequestLine.refJobL1 = batch.batchNo || '';
					insRequestLine.inspectionOwner = '';
					insRequestLine.refJobL3 = '';
					insRequestLine.insMaterial = InsInspectionMaterialEnum.CARTON;
					insRequestLine.insMaterialType = InsInspectionMaterialTypeEnum.FG;
					insRequestLine.insType = req.insType;
					insRequestLine.refJobL2 = lot.packJob;
					insRequestLine.refJobL3 = '';
					insRequestLine.inspectionAreaI1 = '';
					insRequestLine.inspectionAreaI2 = '';
					const savedInsRequestLine = await manager.getRepository(InsRequestLinesEntity).save(insRequestLine)
					// for (const lot of batch.lotInfo || []) {
					// Save Lot-Level Data
					po.add(lot.packOrderNo);
					for (const roll of lot.cortons || []) {
						// Save Inspection Request Items
						const insRequestItem = new InsRequestItemEntity();
						insRequestItem.companyCode = companyCode;
						insRequestItem.createdUser = userName;
						insRequestItem.unitCode = unitCode;
						insRequestItem.insRequestId = savedInsRequest.id;
						insRequestItem.insRequestLineId = savedInsRequestLine.id;
						insRequestItem.refIdL1 = roll?.cartonId.toString() || '';
						insRequestItem.refNoL1 = roll.cartonBarocde || '';
						insRequestItem.insQuantity = roll.cartonQty || 0;
						insRequestItem.insActivityStatus = InsInspectionActivityStatusEnum.OPEN;
						insRequestItem.finalInspectionStatus = InsInspectionFinalInSpectionStatusEnum.OPEN;
						insRequestItem.inspectionOwner = '';
						insRequestItem.inspectionResult = InsInspectionFinalInSpectionStatusEnum.OPEN;
						insRequestItem.insFailQuantity = null;
						insRequestItem.insPassQuantity = null;
						insRequestItem.inspectionAreaI1 = '';
						insRequestItem.inspectionAreaI2 = '';
						insRequestItem.rejectedReasonId = 0; //check
						insRequestItem.styleNumber = Array.isArray(batch?.attrs?.styles) ? batch.attrs.styles.join(',') : '';
						const insReqItemSaved = await this.inspReqItemsRepo.save(insRequestItem);
						// Save Inspection Request Attributes

						style.add(insReqItemSaved.styleNumber);
						packListNo.add(savedInsRequest.refIdL1)

						buyerAddress.add(Array.isArray(batch?.attrs?.buyer) ? batch?.attrs?.buyer.join(',') : '');
						rollAttrs = roll.attrs;
					}

				}
				const attributes = [];
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.STYLE_NO, [...style].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.BUYER, [...buyerAddress].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.PO_NO, [...po].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.PACKING_LIST_NUMBER, [...packListNo].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.DELIVARYDATE, [...delDate].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				attributes.push(this.getAttributesEntity(InsInspectionHeaderAttributes.DESTINATION, [...destination].join(','), unitCode, companyCode, req.username, savedInsRequest.id));
				const attributesToSave = [
					{ key: InsInspectionHeaderAttributes.COLOR, value: rollAttrs?.color?.toString() || '' },
					{ key: 'SIZE', value: rollAttrs?.size?.toString() || '' }, // Assuming 'SIZE' is not part of the enum
					// { key: 'QUANTITY', value: rollAttrs?.quantity?.toString() || '' }  
					{ key: 'QUANTITY', value: rollAttrs?.quantity?.toString() || '' },// Assuming 'QUANTITY' is not part of the enum

				];
				attributesToSave.forEach(attr => {
					attributes.push(this.getAttributesEntity(attr.key as InsInspectionHeaderAttributes, attr.value, unitCode, companyCode, req.username, savedInsRequest.id));
				});
				await manager.getRepository(InsRequestAttributeEntity).save(attributes);

			}

			const history = new InsRequestHistoryEntity();
			history.companyCode = req.companyCode;
			history.createdUser = req.username;
			history.unitCode = req.unitCode;
			history.createdAt = new Date();
			history.InsRedId = insReqId;
			history.oldStatus = InsInspectionActivityStatusEnum.OPEN;
			history.newStatus = InsInspectionActivityStatusEnum.OPEN;
			history.inspectionPerson = req.username;
			history.insRequestItemId = 0;
			history.inspectionAreaI1 = '';
			history.inspectionAreaI2 = '';
			// history.FabInsType = InsFabricInspectionRequestCategoryEnum.NONE;
			// history.FgInsType = PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION;
			history.insType = InsTypesEnum.PRE_INSPECTION,
				await this.insRequestHistoryRepo.save(history);

			await manager.completeTransaction();
			return new GlobalResponseObject(true, 1, 'Inspection Confirmed successfully!')
		} catch (error) {
			console.log('PKMS Inspection Creation Error',error)
			await manager.releaseTransaction();
			throw new Error(`Error creating Fabric Inspection Request: ${error.message}`);
		}
	}

	getAttributesEntity(attName: InsInspectionHeaderAttributes, attValue: string, unitCode: string, companyCode: string, userName: string, inspId: number) {
		const inspReqAttributes = new InsRequestAttributeEntity();
		inspReqAttributes.attributeName = attName;
		inspReqAttributes.attributeValue = attValue;
		inspReqAttributes.companyCode = companyCode;
		inspReqAttributes.createdUser = userName;
		inspReqAttributes.insRequestId = inspId;
		inspReqAttributes.unitCode = unitCode;
		return inspReqAttributes;
	}



	async updatePMSInspectionActivityStatus(req: PKMSIrActivityChangeRequest): Promise<GlobalResponseObject> {
		// Validate inspection request
		const findInsReqCartonBarCodes = await this.dataSource.getRepository(InsRequestItemEntity).find({ select: ['refNoL1'], where: { insRequestId: req.insReqId, companyCode: req.companyCode, unitCode: req.unitCode } })
		const cartonBarcodes: string[] = [];
		findInsReqCartonBarCodes.forEach(rec => cartonBarcodes.push(rec.refNoL1))
		const cartonsPackingDone = await this.packListService.isCartonPackingDone(new CartonBarCodesReqDto(req.username, req.unitCode, req.companyCode, req.userId, cartonBarcodes))
		if (!cartonsPackingDone.status) {
			throw new ErrorResponse(96516, cartonsPackingDone.internalMessage);
		}
		const manager = new GenericTransactionManager(this.dataSource);
		const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
		manager.startTransaction();
		try {
			const irRecord = await this.inspReqRepo.findOne({ select: ['id', 'insActivityStatus', 'insMaterialType', 'insType'], where: { id: req.insReqId, companyCode: req.companyCode, unitCode: req.unitCode }, });

			if (!irRecord) {
				throw new ErrorResponse(36044, 'Inspection request is invalid');
			}
			const inComingActivity = req.insCurrentActivity;
			const currentActivity = irRecord.insActivityStatus;
			const date = req.changeDateTime ? new Date(req.changeDateTime) : null;

			if (!date || isNaN(date.getTime())) {
				throw new ErrorResponse(36047, 'Invalid changeDateTime format');
			}

			const validTransitions = {
				[InsInspectionActivityStatusEnum.OPEN]: [InsInspectionActivityStatusEnum.MATERIAL_RECEIVED],
				[InsInspectionActivityStatusEnum.MATERIAL_RECEIVED]: [InsInspectionActivityStatusEnum.INPROGRESS],
				[InsInspectionActivityStatusEnum.INPROGRESS]: [InsInspectionActivityStatusEnum.COMPLETED],
			};

			if (!validTransitions[currentActivity]?.includes(inComingActivity)) {
				throw new ErrorResponse(36045, 'The Inspection flow is incorrect. OPEN -> MATERIAL RECEIVED -> IN PROGRESS -> COMPLETED');
			}

			// if (irRecord.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
			// 	throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
			// }


			// Prepare update object
			const pkInsE = new InsRequestEntity();
			pkInsE.insActivityStatus = inComingActivity;
			pkInsE.remarks = req.remarks;
			pkInsE.materialReceiveAt = date;

			if (inComingActivity === InsInspectionActivityStatusEnum.INPROGRESS) {
				pkInsE.insStartedAt = new Date();
			}

			// Update records

			await this.inspReqRepo.update({ id: req.insReqId, ...userReq }, pkInsE);
			await this.inspReqItemsRepo.update({ insRequestId: req.insReqId, ...userReq }, { insActivityStatus: inComingActivity });


			// remarks.insType = irRecord.insMaterialType === InsInspectionMaterialTypeEnum.FG ? (irRecord.requestCategory as unknown as AllIns) : (irRecord.insType as unknown as AllIns);

			const history = new InsRequestHistoryEntity();
			history.companyCode = req.companyCode;
			history.createdUser = req.username;
			history.unitCode = req.unitCode;
			history.createdAt = new Date();
			history.InsRedId = req.insReqId;
			history.oldStatus = currentActivity;
			history.newStatus = inComingActivity;
			history.inspectionPerson = req.username;
			history.insRequestItemId = 0;
			history.inspectionAreaI1 = '';
			history.inspectionAreaI2 = '';
			history.remarks = req.remarks;
			// history.FabInsType = InsFabricInspectionRequestCategoryEnum.INSPECTION;
			// // history.FgInsType = irRecord.requestCategory;
			// history.FgInsType = irRecord.insType as unknown as PackFabricInspectionRequestCategoryEnum;
			history.insType = irRecord.insType
			history.inspectionPerson = req.username;

			await this.insRequestHistoryRepo.save(history);
			manager.completeTransaction();
			return new GlobalResponseObject(true, 36046, 'Inspection request status changed successfully');

		} catch (error) {
			console.error("Error in updatePMSInspectionActivityStatus:", error);
			manager.releaseTransaction();
			return new GlobalResponseObject(false, 36048, 'Failed to change inspection request status');
		}
	}




	async deleteFgInspectionRequest(req: PackJobIdsRequest): Promise<GlobalResponseObject> {
		let insRequestIds: number[] = [];
		const manager = new GenericTransactionManager(this.dataSource);
		await manager.startTransaction();

		try {
			// getting the related inspection request IDs
			const insReqLines = await manager.getRepository(InsRequestLinesEntity).find({
				where: { refIdL1: In(req.packListIds) },
			});
			console.log(insReqLines);
			// Extract unique `i	 nsRequestId`s
			insRequestIds = [...new Set(insReqLines?.map(line => line?.insRequestId))];
			if (insRequestIds.length === 0) {
				return new GlobalResponseObject(false, 0, "No inspection requests found for deletion.");
			}

			// Delete related records in a transaction
			await manager.getRepository(InsRequestLinesEntity).delete({ insRequestId: In(insRequestIds) });
			await manager.getRepository(InsRequestItemEntity).delete({ insRequestId: In(insRequestIds) });
			await manager.getRepository(InsRequestAttributeEntity).delete({ insRequestId: In(insRequestIds) });
			await manager.getRepository(InsRequestEntity).delete({ id: In(insRequestIds) });

			// Commit transaction
			await manager.completeTransaction();

			return new GlobalResponseObject(true, 1, "Fabric inspection request deleted successfully.");
		} catch (error) {
			await manager.releaseTransaction();
			return new GlobalResponseObject(false, 0, `Failed to delete fg inspection request: ${error.message}`);
		}
	};


	async getInspectionStatus(req: PKMSInsStatusReqDto): Promise<CommonResponse> {
		const userReq = { companyCode: req.companyCode, unitCode: req.unitCode }
		let status = false
		if (!req.packListIds.length || !req.insPreferenceType) {
			throw new ErrorResponse(36049, 'Req Is Not Valid')
		}
		const insReq = await this.dataSource.getRepository(InsRequestEntity).count({ where: { refIdL1: In(req.packListIds), insType: req.insPreferenceType, ...userReq, finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum.PASS } });
		status = insReq === req.packListIds.length;
		if (req.cartonIds && req.cartonIds.length) {
			const items = await this.dataSource.getRepository(InsRequestItemEntity).count({ where: { refIdL1: In(req.cartonIds), finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum.PASS, ...userReq } })
			status = items === req.cartonIds.length
		}
		if (status) {
			return new CommonResponse(status, 36050, "Inspection Completed For Given data", status)
		} else {
			return new CommonResponse(status, 36051, "Inspection Not Completed For Given data", status)

		}
	}

}



//packing list id input -- packing kist -batch ,pack job-lots--req,,craton--req lines 





