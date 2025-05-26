import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { CommonResponse, ErrorResponse } from "@xpparel/backend-utils";
import { BoxMapReqDto, CartonSpecModel, CartonSpecResponse, CommonIdReqModal, CommonRequestAttrs, PackingSpecReqModelDto, PackingSpecResponse, PackingSpecResponseDto, PackSerialNumberReqDto, PackSpecDropDownDtoModel, PackSpecDropDownResponse } from "@xpparel/shared-models";
import { BaseService, TransactionalBaseService } from "../../../base-services";
import { ItemsEntity } from "../items/entities/items.entity";
import { PackingSpecCreateDto } from "./dto/packing-spec-create.dto";
import { BoxMapEntity } from "./entities/box-map.entity";
import { PackingSpecEntity } from "./entities/packing-spec.entity";
import { BoxMapEntityRepoInterface } from "./repositories/box-map-repo-interface";
import { PackingSpecRepoInterface } from "./repositories/packing-spec-repo-interface";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { DataSource, FindOptionsWhere, In, Not } from "typeorm";
import { PackOrderBomEntity } from "../../packing-list/entities/pack-bom.entity";


@Injectable()
export class PackingSpecService extends TransactionalBaseService {
	constructor(
		@Inject('PackingSpecRepoInterface') private readonly psRepo: PackingSpecRepoInterface,
		@Inject('BoxMapEntityRepoInterface') private readonly boxRepo: BoxMapEntityRepoInterface,
		@Inject('LoggerService') logger: LoggerService,
		@Inject('TransactionManager')

		transactionManager: ITransactionManager,
		public dataSource: DataSource
	) {
		super(transactionManager, logger)
	}
	async createPackingSpec(dto: PackingSpecCreateDto) {
		if (dto.code) {
			const findRecord = await this.psRepo.findOne({ where: { code: dto.code } });
			if (findRecord && findRecord.id !== dto.id) {
				throw new ErrorResponse(54585, "pack Spec  Code already exists.");
			}
		}
		const packingSpec = new PackingSpecEntity();
		packingSpec.code = dto.code;
		packingSpec.companyCode = dto.companyCode;
		packingSpec.desc = dto.desc;
		packingSpec.unitCode = dto.unitCode;
		packingSpec.createdUser = dto.username;
		packingSpec.noOfLevels = dto.noOfLevels;

		const boxReq: BoxMapEntity[] = [];
		return this.executeWithTransaction(async (transactionManager) => {
			if (dto.id)
				await transactionManager.getRepository(BoxMapEntity).delete({ specId: dto.id });
			if (dto.id) {
				packingSpec.id = dto.id;
			}
			const packing = await transactionManager.getRepository(PackingSpecEntity).save(packingSpec);
			for (const rec of dto.boxMap) {
				const boxEntity = new BoxMapEntity();
				boxEntity.companyCode = dto.companyCode;
				boxEntity.unitCode = dto.unitCode;
				boxEntity.createdUser = dto.username;
				boxEntity.specId = packing.id
				boxEntity.itemId = rec.itemId
				boxEntity.noOfItems = rec.noOfItems;
				boxEntity.levelNo = rec.levelNo;
				if (rec.id) {
					boxEntity.id = rec.id;
				}
				boxReq.push(boxEntity);
			}

			await transactionManager.getRepository(BoxMapEntity).save(boxReq);
			this.logMessage(`Packing spec with code ${dto.code} saved successfully`);
			return new CommonResponse(true, dto?.id ? 36094 : 36095, `Packing spec ${dto.id ? "Updated" : "Created"} successfully`);
		});
	}

	async getAllPackingSpecs(req: PackSerialNumberReqDto): Promise<PackingSpecResponse> {
		try {
			const response: PackingSpecResponseDto[] = [];
			const packSpecWhereClause: FindOptionsWhere<PackingSpecEntity> = new PackingSpecEntity();
			packSpecWhereClause.companyCode = req.companyCode;
			packSpecWhereClause.unitCode = req.unitCode;
			if (req.packSerial) {
				const packItemsReq = new PackSerialNumberReqDto(req.username, req.unitCode, req.companyCode, req.userId, req.packSerial)
				const packOrderSpecs = await this.getAllSpecDropdownData(packItemsReq);
				const packMappedPackSpecIds = packOrderSpecs.data.map(rec => rec.id);
				packSpecWhereClause.id = In(packMappedPackSpecIds)
			}
			const packingIds = await this.psRepo.find({ where: packSpecWhereClause, order: { createdAt: 'desc' } })
			for (const packingId of packingIds) {
				const pa = new PackingSpecEntity();
				pa.id = packingId.id
				const boxData = await this.boxRepo.find({ select: ['itemId', 'levelNo', 'noOfItems', 'remarks', 'specId', 'id', 'isActive'], where: { companyCode: req.companyCode, unitCode: req.unitCode, specId: packingId.id }, order: { createdAt: 'DESC' } })
				const boxReqModel: BoxMapReqDto[] = []
				for (const data of boxData) {
					const specIds = await this.dataSource.getRepository(PackingSpecEntity).findOne({ select: ['id'], where: { id: data.specId } })
					const itemIds = await this.dataSource.getRepository(ItemsEntity).findOne({ select: ['id', 'desc'], where: { id: data.itemId } })
					const boxMapReq = new BoxMapReqDto(specIds.id, itemIds.id, data.levelNo, data.noOfItems, data.id, itemIds.desc);
					boxReqModel.push(boxMapReq)
				}
				const resModel = new PackingSpecResponseDto(packingId.id, packingId.code, packingId.desc, packingId.noOfLevels, packingId.isActive, boxReqModel)
				response.push(resModel)
			}
			if (response.length > 0) {
				return new PackingSpecResponse(true, 36096, 'Pack Spec data retrieved successfully', response)
			} else {
				return new PackingSpecResponse(false, 924, 'No Data Found', [])
			}
		} catch (error) {
			console.log(error, 'errr')
			throw new ErrorResponse(6451, error.message)
		}

	}

	async togglePackingSpec(dto: PackingSpecCreateDto) {
		const togglePackingSpec = await this.psRepo.findOneById(dto.id)
		if (togglePackingSpec) {
			const entity = new PackingSpecEntity()
			entity.id = dto.id
			entity.isActive = !togglePackingSpec.isActive
			await this.psRepo.save(entity)
			let message = togglePackingSpec.isActive ? "Deactivated Successfully" : " Activated Successfully"
			return new CommonResponse(true, togglePackingSpec.isActive ? 920 : 921, message)
		} else {
			return new CommonResponse(false, 924, "No Data Found")
		}
	}

	async getAllSpecDropdownData(req: PackSerialNumberReqDto): Promise<PackSpecDropDownResponse> {
		if (req.packSerial) { 
			const data = await this.psRepo.getMappedBomSpec(req)
			return new PackSpecDropDownResponse(true, 69035, 'Pack Spec data retrieved successfully', data)
		} else {
			const packingIds = await this.psRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } })
			return new PackSpecDropDownResponse(true, 36096, 'Pack Spec data retrieved successfully', packingIds.map(rec => new PackSpecDropDownDtoModel(rec.id, rec.code, rec.desc)))
		}

	}

	async getCartonSpecData(req: CommonIdReqModal): Promise<CartonSpecResponse> {
		const packingId = await this.psRepo.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } })
		if (!packingId) {
			throw new ErrorResponse(965, 'Data not found')
		}
		const pa = new PackingSpecEntity();
		pa.id = packingId.id
		const boxData = await this.boxRepo.find({ select: ['itemId', 'levelNo', 'noOfItems', 'remarks', 'specId', 'id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, specId: packingId.id }, order: { createdAt: 'DESC' } })
		const boxReqModel: BoxMapReqDto[] = [];
		const resModel = new CartonSpecModel(packingId.id, packingId.code, packingId.desc, undefined, undefined, undefined, [])
		for (const data of boxData) {

			const itemIds = await this.dataSource.getRepository(ItemsEntity).findOne({ select: ['id', 'code'], where: { id: data.itemId } })
			if (data.levelNo === 1) {
				resModel.cartonId = data.id;
				resModel.cartonBoxId = itemIds.id;
				resModel.cartonName = itemIds.code

			} else {
				const boxMapReq = new BoxMapReqDto(data.specId, itemIds.id, data.levelNo, data.noOfItems, data.id, itemIds.code)
				boxReqModel.push(boxMapReq);

			}
		}
		resModel.polyBags = boxReqModel;
		return new CartonSpecResponse(true, 36096, 'Pack Spec data retrieved successfully', resModel)
	}
}