import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { BasicRollInfoModel, BasicRollInfoRespone, BatchBasicInfoRespone, CodesRequest, CodesResponse, CommonRequestAttrs, CommonResponse, GlobalResponseObject, GrnRollInfoForRollResp, HeaderDetails, HeaderDetailsResponse, InsBasicRollInfoRequest, InsFabInsCreateExtRefRequest, InsFabInsSelectedBatchModel, InsFabInsSelectedBatchModelAttrs, InsFabInsSelectedBatchResponse, InsFabInsSelectedLotModel, InsFabInsSelectedLotModelAttrs, InsFabInsSelectedRollModel, InsFabInsSelectedRollModelAttrs, InsPhIdRequest, InsRollBasicInfoModel, InsRollBasicInfoResponse, PackListRecordForPackListIdResponse, PhItemIdResponse, PhItemLInesActualResponse, PhItemLinesActualModel, PlBatchLotRequest, RollCountModel, RollCountResponse, RollNumberRequest, ShadeDetails } from '@xpparel/shared-models';
import { FabricInspectionInfoService } from '@xpparel/shared-services';
import { DataSource, In } from 'typeorm';
import { PhItemLinesActualEntity } from '../packing-list/entities/ph-item-lines-actual.entity';
import { PackingListRepo } from '../packing-list/repository/packing-list.repository';
import { InspectionReportsRepo } from '../packing-list/repository/packlist.repository';
import { PhItemLinesActualRepo } from '../packing-list/repository/ph-item-lines-actual.repository';
import { PhItemLinesRepo } from '../packing-list/repository/ph-item-lines.repository';
import { PhItemsRepo } from '../packing-list/repository/ph-items.repository';
import { PhLinesRepo } from '../packing-list/repository/ph-lines-repository';
import { GrnRollInfoQryResp } from '../packing-list/repository/query-response/grn-roll-info.qry.resp';
import { InsHeaderConfigRepo } from '../wms-inspection-config/repositories/ins-header.config.repository';

@Injectable()
export class InspectionHelperService {
	constructor(
		private dataSource: DataSource,
		private phItemLinesRepo: PhItemLinesRepo,
		private phLinesRepo: PhLinesRepo,
		private phItemLinesActualRepo: PhItemLinesActualRepo,
		private phRepo: PackingListRepo,
		private inspectionReportsRepo: InspectionReportsRepo,
		private fabricInspectionInfoService: FabricInspectionInfoService,
		private insHeaderConfigRepo: InsHeaderConfigRepo,
		private phItemsRepo: PhItemsRepo,

	) {

	}
	async getRollCountByPackListIdOrBatchNoOrLotNo(req: PlBatchLotRequest): Promise<RollCountResponse> {
		const { username, companyCode, unitCode, userId, batchNos, packListId, lotNos } = req;

		const rollIds: string[] = await this.phItemLinesRepo.getRollCountByPackListIdOrBatchNoOrLotNo(username, companyCode, unitCode, userId, batchNos, packListId, lotNos);

		let data: RollCountModel[] = [];
		if (rollIds.length > 0) {
			data = [{
				batchNo: batchNos,
				lotNo: lotNos,
				rollCount: rollIds.length
			}];
			return new RollCountResponse(true, 123, 'Rolls Not Found!', data)
		}
		return new RollCountResponse(false, 123, 'Rolls Not Found!', [])
	}

	async getItemLineActualRecord(req: RollNumberRequest): Promise<PhItemLInesActualResponse> {
		const { rollNumber, unitCode, companyCode } = req;
		const data: PhItemLinesActualModel[] = []
		const res: PhItemLinesActualModel = await this.phItemLinesActualRepo.findOne({ where: { phItemLinesId: rollNumber, unitCode: unitCode, companyCode: companyCode } });
		if (!res) {
			return new PhItemLInesActualResponse(false, 123, 'Item Line Actual Record Not Found!', [])
		}
		data.push(res)
		return new PhItemLInesActualResponse(true, 123, 'Item Line Actual Record Found!', data)
	}

	//not using
	async getBasicRollInfoForRollId(req: RollNumberRequest): Promise<BasicRollInfoRespone> {
		const { unitCode, companyCode, rollNumber } = req;
		const data: BasicRollInfoModel = await this.phItemLinesRepo.getBasicRollInfoForRollId(rollNumber, unitCode, companyCode);
		if (!data) {
			return new BasicRollInfoRespone(false, 123, 'Basic Roll Info Not Found!', null)
		}
		return new BasicRollInfoRespone(true, 123, 'Basic Roll Info Found!', data)
	}

	async getGrnRollInfoForRollId(req: RollNumberRequest): Promise<GrnRollInfoForRollResp> {
		const { unitCode, companyCode, rollNumber } = req;
		const data: GrnRollInfoQryResp[] = [];
		const res: GrnRollInfoQryResp = await this.phItemLinesRepo.getGrnRollInfoForRollId(rollNumber, unitCode, companyCode);
		if (!res) {
			return new GrnRollInfoForRollResp(false, 123, 'Grn Roll Info Not Found!', [])
		}
		data.push(res);
		return new GrnRollInfoForRollResp(true, 123, 'Grn Roll Info Found!', data)
	}




	// end point
	async getBasicInfoForBatch(req: PlBatchLotRequest): Promise<BatchBasicInfoRespone> {
		// read only batch numbers from the request
		return
	}

	async getPhItemIdByPhItemLineId(req: RollNumberRequest): Promise<PhItemIdResponse> {

		try {
			const phItemId = await this.phItemLinesRepo.getPhItemIdByPhItemLineId(req.rollNumber, req.unitCode, req.companyCode);

			if (!phItemId) {
				throw new Error(`No PH Item ID found for rollId: ${req.rollNumber}, unitCode: ${req.unitCode}, companyCode: ${req.companyCode}`);
			}

			return new PhItemIdResponse(true, 200, "PH Item ID retrieved successfully", { phItemId });
		} catch (error) {
			console.error('Error fetching PH Item ID:', error);
			return new PhItemIdResponse(false, 500, "Failed to retrieve PH Item ID", null);
		}
	}

	async getFabricInspectionSelectedItems(req: InsFabInsCreateExtRefRequest): Promise<InsFabInsSelectedBatchResponse> {
		try {
			// Fetch PH lines based on filters
			const phLines = await this.phLinesRepo.getPhLinesByBatchAndLot(req.batches, req.lotNos, req.packListIds, req.unitCode, req.companyCode);
			const batchMap = new Map<string, InsFabInsSelectedBatchModel>();
			const lotMap = new Map<string, InsFabInsSelectedLotModel>();
			const rollMap = new Map<string, InsFabInsSelectedRollModel>();
			const res: InsFabInsSelectedBatchModelAttrs = await this.inspectionReportsRepo.getHeaderAtributesById(req.packListIds[0]);
			if (!res) {
				throw new ErrorResponse(0, 'Pack list does not exist');
			}
			// Loop through each PH line record
			for (const data of phLines) {
				let rolls: InsFabInsSelectedRollModel = null;
				let lots: InsFabInsSelectedLotModel = null;
				// Only process if the roll ID is included in the request
				req.rollIds = req.rollIds.map(Number);
				if (req.rollIds.includes(data.rollId)) {
					const rAtt = new InsFabInsSelectedRollModelAttrs(Number(data.sWidth), Number(data.mWidth), Number(data.sLength));
					
					const phItemLines = await this.phItemLinesRepo.findOne({ where: { id: data.rollId } });
					rolls = new InsFabInsSelectedRollModel(data.packListId, data.rollId, data.barcode, Number(data.rollQty), rAtt, phItemLines?.gsm);
					lots = new InsFabInsSelectedLotModel(data.packListId, data.lotNumber, [rolls], undefined,data?.itemCode);
				}
				// Only proceed if a valid roll and lot were created
				if (rolls && lots) {
					if (!batchMap.has(data.batchNumber)) {
						const batchesData = new InsFabInsSelectedBatchModel(data.packListId, data.batchNumber, res, [lots]);
						batchMap.set(data.batchNumber, batchesData);
					} else {
						const existingBatch = batchMap.get(data.batchNumber);
						let existingLot = existingBatch.lotInfo.find(l => l.lotNo === data.lotNumber);
						if (existingLot) {
							existingLot.rolls.push(rolls);
						} else {
							existingBatch.lotInfo.push(lots);
						}
					}
				}
			}
			const finalBatches: InsFabInsSelectedBatchModel[] = [];
			batchMap.forEach((bV, bk) => {
				const duplicateLots = new Set<string>();
				// Create or update lots in lotMap
				bV.lotInfo.forEach(lot => {
					duplicateLots.add(lot.lotNo);
					if (!lotMap.has(lot.lotNo)) {
						const lots = new InsFabInsSelectedLotModel(lot.packListId, lot.lotNo, lot.rolls, new InsFabInsSelectedLotModelAttrs(bV.lotInfo.length),lot.itemCode);
						lotMap.set(lot.lotNo, lots);
					} else {
						lot.rolls.forEach(ri => {
							if (req.rollIds.includes(ri.rollId)) {
								lotMap.get(lot.lotNo).rolls.push(ri);
							}
						});
					}
				});
				const lotsData = [...duplicateLots].map(lotNo => lotMap.get(lotNo));
				finalBatches.push(new InsFabInsSelectedBatchModel(bV.packListId, bV.batchNo, bV.attrs, lotsData));
			});
			return new InsFabInsSelectedBatchResponse(true, 1, '', finalBatches);
		} catch (error) {
			console.error("Error in getFabricInspectionSelectedItems:", error);
			throw new Error(error.message || "Error fetching selected inspection items");
		}
	}


	async getPackListRecordDataForPackListId(req: InsPhIdRequest): Promise<PackListRecordForPackListIdResponse> {
		const phId = req.phId[0];
		const packRec = await this.phRepo.findOne({ where: { id: Number(phId), isActive: true } });
		if (!packRec) {
			throw new ErrorResponse(0, 'Pack list does not exist');
		}
		return new PackListRecordForPackListIdResponse(true, 4, '', packRec)
	}

	async getBasicRollInfoForInspection(req: InsBasicRollInfoRequest): Promise<InsRollBasicInfoResponse> {
		try {
			const rolls = await this.phItemLinesRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, id: In(req.rollIds) }, relations: ['phItemId', 'phItemId.phLinesId', 'phItemId.phLinesId.packHeaderId'] });
			if (!rolls.length) {
				throw new BadRequestException('No rolls found for the given roll IDs.');
			}
			const itemLinesIds = rolls.map(r => r.id);
			const actualRollsRecords = await this.phItemLinesActualRepo.find({ select: ['aShade', 'phItemLinesId', 'aWidth', 'aGsm'], where: { companyCode: req.companyCode, unitCode: req.unitCode, phItemLinesId: In(itemLinesIds), }, });

			// Map actual roll data by roll ID
			const actualRollInfoMap = new Map<number, PhItemLinesActualEntity>();
			actualRollsRecords.forEach(r => actualRollInfoMap.set(r.phItemLinesId, r));
			const rollsInfo: InsRollBasicInfoModel[] = rolls.map(r => {
				const actualRollProps = actualRollInfoMap.get(r.id);
				const batchInfo = r.phItemId.phLinesId;
				const remainingQty = Number(r.inputQuantity) - Number(r.issuedQuantity);
				return new InsRollBasicInfoModel(r.id, r.inspectionPick, r.barcode, r.phId, r.inputQuantity, remainingQty, batchInfo?.id, batchInfo?.batchNumber, batchInfo?.lotNumber, r.inputWidth?.toString(), r.issuedQuantity, r.inputQuantity, r.sShade, r.sSkGroup, r.phItemId.itemCode, r.phItemId.itemDescription, actualRollProps?.aShade, r.sWidth, r.sQuantity, r.grnDate, r.inputQuantityUom, r.inputWidthUom, r.measuredWidth, r.measuredWeight, actualRollProps?.aWidth?.toString(), Number(r.allocatedQuantity), r.objectExtNumber, r.phItemId.itemCategory, r.phItemId.itemColor, r?.gsm);

			});
			return new InsRollBasicInfoResponse(true, 1, '', rollsInfo);
		} catch (error) {
			throw new BadRequestException(`Failed to fetch roll information: ${error.message}`);
		}
	}

	async updateShowInInventory(req: InsPhIdRequest): Promise<GlobalResponseObject> {
		try {
			const { phId } = req;
			const result = await this.phItemLinesRepo.update({ phId: In(phId) }, { showInInventory: true });
			if (result.affected > 0) {
				return new GlobalResponseObject(true, 1, 'Updated successfully');
			} else {
				return new GlobalResponseObject(false, 0, 'No records updated');
			}
		} catch (error) {
			console.error('Error updating ShowInInventory:', error);
			return new GlobalResponseObject(false, 0, 'Error updating ShowInInventory');
		}
	}

	async updateShowInInventoryJob(req: InsPhIdRequest): Promise<CommonResponse> {
		try {
			const phId = req.phId[0];
			const headerData = await this.insHeaderConfigRepo.find({ where: { 'refId': Number(phId), 'selected': true } })
			const mandatoryIns = headerData.map((item => item.insTypeI1))
			const checkReq = new InsPhIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.phId, mandatoryIns)
			const res = await this.fabricInspectionInfoService.checkForShowInInventoryUpdate(checkReq);
			if (res.data) {
				// console.log('res',res.data)
				const updatedRes = await this.updateShowInInventory(req);
				return new CommonResponse(true, 56787, 'Updated Successfully!', true)
			}
			return new CommonResponse(false, 56784, 'Not Updated Successfully!', false)
		} catch (error) {
			// console.log(error);
			throw new Error(error);
		}
	}


	async updateShadeDetails(req: ShadeDetails[]): Promise<GlobalResponseObject> {
		try {
			req.map((item) => {
				this.phItemLinesActualRepo.update({ 'phItemLinesId': item.rollId }, { aShade: item.shade });
			})
			return new GlobalResponseObject(true, 9867, 'shade updated sucess!')
		} catch (err) {
			throw new ErrorResponse(0, 'shade not updated');
			console.error(err);
		}
	}

	async getHeaderDetailsForInspection(req: InsPhIdRequest): Promise<HeaderDetailsResponse> {
		const phId = req.phId[0];
		const data = await this.insHeaderConfigRepo.findOne({ where: { 'refId': Number(phId), 'insTypeI1': req.InspectionTypes[0],unitCode:req.unitCode,companyCode:req.companyCode } });
		if (data) {
			return new HeaderDetailsResponse(true, 8764, 'data retreived!', new HeaderDetails(data.defaultPerc));
		}
		return new HeaderDetailsResponse(false, 8764, 'data not retreived', null);
	}


	async getAllStyles(req: CommonRequestAttrs): Promise<CodesResponse> {
		const data = await this.phItemsRepo.getDistinctItemStyles(req.companyCode, req.unitCode);
		if (data.length > 0) {
			return new CodesResponse(true, 8734, 'styles retrived sucessfully!', data);
		}
		return new CodesResponse(false, 8734, 'styles not retrived!', []);
	}

	async getLotForStyle(req: CodesRequest): Promise<CodesResponse> {
		const data = await this.phItemsRepo.getLotsForStyle(req.Codes, req.unitCode, req.companyCode);
		if (data.length > 0) {
			return new CodesResponse(true, 8732, 'Lots retrieved successfully!', data);
		}
		return new CodesResponse(false, 8732, 'Lots not retrieved!', []);
	}


	async getItemCodesForLot(req: CodesRequest): Promise<CodesResponse> {

		const data = await this.phItemsRepo.getItemCodesForLot(req.Codes, req.unitCode, req.companyCode);
		if (data.length > 0) {
			return new CodesResponse(true, 8731, 'ItemCodes retrieved successfully!', data);
		}
		return new CodesResponse(false, 8731, 'ItemCodes not retrieved!', []);
	}

	async getRollIdsForItemCode(req: CodesRequest): Promise<CodesResponse> {
		const data = await this.phItemLinesRepo.getRollIdsForItemCode(req.Codes, req.unitCode, req.companyCode);
		if (data.length > 0) {
			return new CodesResponse(true, 8730, 'RollIds retrieved successfully!', data);
		}
		return new CodesResponse(false, 8730, 'RollIds not retrieved!', []);
	}

}

