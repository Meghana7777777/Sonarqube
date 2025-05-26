import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Not } from "typeorm";
import { CommonResponse, ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, GlobalResponseObject, ItemsResponse, ItemsModelDto, MaterialReqModel, MaterialTypeEnum, PackSerialNumberReqDto } from "@xpparel/shared-models";
import { BaseService } from "../../../base-services";
import { LoggerService } from "../../../logger";
import { ItemsCreateDTO } from "./dto/items-create.dto";
import { ItemsToggleDto } from "./dto/items-toggle.dto";
import { ItemsEntity } from "./entities/items.entity";
import { ItemDimensionsRepoInterface } from "./repositories/item-dimensions-repo-interface";
import { ItemsRepoInterface } from "./repositories/items-repo-interface";
import { ItemDimensionsEntity } from "./entities/item-dimensions.entity";
import { MaterialTypeEntity } from "../material-type/entities/material-type.entity";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { PackOrderBomEntity } from "../../packing-list/entities/pack-bom.entity";
import { PKMSProcessingOrderEntity } from "../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

@Injectable()
export class ItemsService extends BaseService {

    constructor(
        @Inject('ItemsRepoInterface')
        private readonly itemsRepo: ItemsRepoInterface,
        @Inject('ItemDimensionsRepoInterface')
        private readonly itemsDimensionsRepo: ItemDimensionsRepoInterface,
        @Inject('LoggerService')
        logger: LoggerService,
        public dataSource: DataSource,
    ) {
        super(logger)
    }





    async createItems(req: ItemsCreateDTO[]) {
        const transactionManager = new GenericTransactionManager(this.dataSource)
        try {
            await transactionManager.startTransaction();
            for (const dto of req) {
                if (dto.code) {
                    const findRecord = await this.itemsRepo.findOne({ where: { code: dto.code } });
                    if (findRecord && findRecord.id !== dto.id) {
                        throw new ErrorResponse(36005, "Items Code already exists.");
                    }
                }
                const newItem = this.itemsRepo.create(dto);
                if (dto.category != MaterialTypeEnum.TRIM) {
                    const whereClause = new ItemDimensionsEntity();
                    whereClause.length = dto.length;
                    whereClause.width = dto.width;
                    if (dto.category === MaterialTypeEnum.CARTON) {
                        whereClause.height = dto.height
                    }
                    const dm = await this.dataSource.getRepository(ItemDimensionsEntity).findOne({ where: whereClause })
                    if (dm) {
                        newItem.dimensionsId = dm.id;
                    } else {
                        const dimObj = new ItemDimensionsEntity()
                        dimObj.height = dto.height
                        dimObj.length = dto.length
                        dimObj.width = dto.width

                        const saveDimendionInfo = await this.dataSource.getRepository(ItemDimensionsEntity).save(dimObj)
                        if (saveDimendionInfo) {
                            newItem.dimensionsId = saveDimendionInfo.id
                        }
                    }
                }
                const itemsSave = await transactionManager.getRepository(ItemsEntity).save(newItem);
                const packOrderId = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ where: { processingSerial: Number(dto.packSerial) } })
                const pkBom = new PackOrderBomEntity();
                pkBom.packOrderId = packOrderId.id;
                pkBom.bomId = itemsSave.id;
                pkBom.companyCode = dto.companyCode;
                pkBom.unitCode = dto.unitCode;
                pkBom.createdUser = dto.username;
                await transactionManager.getRepository(PackOrderBomEntity).save(pkBom);
                this.logMessage('Items Saved Successfully');
            }
            await transactionManager.completeTransaction();
            return new GlobalResponseObject(true, req[0]?.id ? 922 : 923, req[0].id ? 'Updated Successfully' : 'Created Successfully')

        } catch (error) {
            await transactionManager.releaseTransaction()
            console.log(error)
            throw new ErrorResponse(64561, error.message)
        }

    }


    async getAllItems(dto: MaterialReqModel) {
        const getItem = await this.itemsRepo.getALLItems(dto.unitCode, dto.companyCode, dto.category, []);
        if (getItem.length) {
            const respModel: ItemsModelDto[] = [];
            getItem.forEach(rec => {
                const mt: any = rec.materialType;
                respModel.push(new ItemsModelDto(rec.id, rec.code, rec.desc, rec.length, rec.width, rec.height, rec.category, rec.materialType, rec.materialTypeDesc, rec.dimensionId, rec.isActive))
            })
            return new ItemsResponse(true, 36006, 'items data retrieved successfully', respModel)
        } else {
            return new ItemsResponse(false, 924, 'No Data Found', [])
        }

    }

    async toggleItems(dto: ItemsToggleDto) {
        const toggleItem = await this.itemsRepo.findOneById(dto.id)
        if (toggleItem) {
            const entity = new ItemsEntity()
            entity.id = dto.id
            entity.isActive = !toggleItem.isActive
            await this.itemsRepo.save(entity)
            let message = toggleItem.isActive ? "Deactivated Successfully" : " Activated Successfully"
            return new CommonResponse(true, toggleItem.isActive ? 920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async getItemsToPackingSpec(req: MaterialReqModel): Promise<ItemsResponse> {
        const getItems = await this.itemsRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, category: req.category } })
        if (getItems.length) {
            const respModel: ItemsModelDto[] = [];
            for (const rec of getItems) {
                const dm = await this.dataSource.getRepository(ItemDimensionsEntity).findOne({ select: ['length', 'width', 'height'], where: { id: rec?.dimensionsId } })
                const mt = await this.dataSource.getRepository(MaterialTypeEntity).findOne({ select: ['materialTypeDesc'], where: { id: rec.materialType } })
                respModel.push(new ItemsModelDto(
                    rec.id,
                    rec.code,
                    rec.desc,
                    dm?.length,
                    dm?.width,
                    dm?.height,
                    rec.category,
                    mt?.id,
                    mt?.materialTypeDesc,
                    rec?.dimensionsId
                ));
            }
            return new ItemsResponse(true, 5554, 'Packing spec data retrieved successfully', respModel)
        } else {
            return new ItemsResponse(false, 5432, 'no data found', [])
        }
    }


    async getUnMappedItemsToSpecByPo(req: PackSerialNumberReqDto): Promise<ItemsResponse> {
        try {
            const packOrderId = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['id'], where: { processingSerial: req.packSerial, companyCode: req.companyCode, unitCode: req.unitCode } });
            const bomItems = await this.dataSource.getRepository(PackOrderBomEntity).find({ select: ['bomId'], where: { packOrderId: packOrderId.id, companyCode: req.companyCode, unitCode: req.unitCode } })
            const data = await this.itemsRepo.getUnMappedItemsToSpecByPo(bomItems.map(rec => rec.bomId));
            return new ItemsResponse(true, 545, 'Items Retrieved Successfully', data)
        } catch (error) {
            console.log(error)
            throw new ErrorResponse(9561, error.message)
        }

    }

    async getItemsDataForItemIds(unitCode: string, companyCode: string, itemIds: number[]): Promise<ItemsResponse> {
        const getItem = await this.itemsRepo.getALLItems(unitCode, companyCode, undefined, itemIds);
        
        if (getItem.length === 0) {
            throw new ErrorResponse(924, 'No Data Found');
        }
        const respModel: ItemsModelDto[] = [];
        getItem.forEach(rec => {
            const mt: any = rec.materialType;
            respModel.push(new ItemsModelDto(rec.id, rec.code, rec.desc, rec.length, rec.width, rec.height, rec.category, rec.materialType, rec.materialTypeDesc, rec.dimensionId, rec.isActive))
        })
        return new ItemsResponse(true, 36006, 'items data retrieved successfully', respModel)

    }


}