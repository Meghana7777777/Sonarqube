import { Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CartonBarCodesReqDto, CartonBasicInfoModel, CommonResponse, FgCurrentContainerLocationEnum, GlobalResponseObject, ItemsResponse, PGCartonInfoModel, PGCartonInfoResponse, PLGenQtyInfoResponse, PackSerialRequest, PackingStatusEnum, PalletGroupTypeEnum, PoIdRequest, ScanToPackRequest } from "@xpparel/shared-models";
import { CartonInfoModel } from "packages/libs/shared-models/src/pkms/carton-filling/carton-info.model";
import { DataSource, In } from "typeorm";
import { ItemDimensionsEntity } from "../__masters__/items/entities/item-dimensions.entity";
import { ItemsEntity } from "../__masters__/items/entities/items.entity";
import { ItemDimensionsRepoInterface } from "../__masters__/items/repositories/item-dimensions-repo-interface";
import { InsConfigItemsEntity } from "../pkms-inspection-config/entities/pkms-ins-header-config-items";
import { PreIntegrationService } from "../pre-integrations/pre-integration.service";
import { PackListService } from "./packing-list.service";
import { CartonRepoInterFace } from "./repositories/carton-repo-interface";
import { ConfigLeastChildRepoInterface } from "./repositories/config-least-child.repo.interface";
import { PLConfigRepoInterface } from "./repositories/config-repo.interface";
import { PackOrderBomRepo } from "./repositories/pack-order-bom-repo";
import { ItemsService } from "../__masters__/items/items.service";
import { PKMSProcessingOrderEntity } from "../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

@Injectable()
export class PackingListInfoService {
    constructor(
        @Inject('ConfigRepoInterface')
        private readonly configRepo: PLConfigRepoInterface,
        @Inject('ConfigLeastChildRepoInterface')
        private readonly configChild: ConfigLeastChildRepoInterface,
        @Inject('CartonRepoInterFace')
        private readonly cartonRepo: CartonRepoInterFace,
        @Inject('ItemDimensionsRepoInterface')
        private readonly itemsDimensionsRepo: ItemDimensionsRepoInterface,
        private readonly bomItemsRepo: PackOrderBomRepo,
        private preIntegrationService: PreIntegrationService,
        private readonly itemsService: ItemsService,
        public dataSource: DataSource

    ) {

    }


    async getPoToPLGenQtyInfo(req: PackSerialRequest): Promise<PLGenQtyInfoResponse> {
        const orderInfo = await this.preIntegrationService.getPoData(req);
        // const plGenModel = new PLGenQtyInfoModel(orderInfo.id, orderInfo.packSerial, orderInfo.deliveryDate, orderInfo.qty, [])
        // for (const poLine of orderInfo.poOrderLines) {
        //     const plLineModel = new PlLineInfo(poLine.id, poLine.poLine, poLine.fgColor, [], poLine.productType, poLine.productName);
        //     for (const subLine of poLine.poOrderSubLines) {
        //         const plGenQtyQUery = await this.configChild.getPlGenQty(req.companyCode, req.unitCode, subLine.id);
        //         const plGenQty = plGenQtyQUery ? Number(plGenQtyQUery?.qty) : 0
        //         const additionQty = plGenQty - subLine.qty;
        //         const subLineModel = new PLSubLineQtyModel(subLine.id, subLine.size, subLine.qty, plGenQty, additionQty > 0 ? additionQty : 0);
        //         plLineModel.subLineQuantities.push(subLineModel)
        //     }
        //     plGenModel.plLines.push(plLineModel)
        // }
        return new PLGenQtyInfoResponse(true, 123, '', orderInfo)
    }

    async getPGCartonInfoForCartonBarcode(req: ScanToPackRequest): Promise<PGCartonInfoResponse> {
        const carton = await this.cartonRepo.findOne({ select: ['id', 'packingStatus', 'inspectionPick'], where: { barcode: req.barcode, companyCode: req.companyCode, unitCode: req.unitCode } });
        if (!carton) {
            throw new ErrorResponse(36068, 'Carton does not exist');
        }
        req.cartonId = carton.id;
        //TODO: Comment for demo purpose
        // if (carton.packingStatus == PackingStatusEnum.OPEN) {
        //     throw new ErrorResponse(0, 'FG Filing not Completed, Please do and try again.');
        // }
        const cartonsInfo = await this.getCartonsBasicInfoForCartonIds(req.companyCode, req.unitCode, [req.cartonId]);
        const cartonInfo = cartonsInfo[0];
        const pgType = carton.inspectionPick ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;

        let defaultPalletInfo: any[] = [];


        let actualAssignedPalletInfo: any[] = [];

        const CartonObj = new PGCartonInfoModel(undefined, undefined, undefined, defaultPalletInfo[0]?.palletCode, undefined, actualAssignedPalletInfo[0]?.palletCode, cartonInfo);
        return new PGCartonInfoResponse(true, 36069, 'Carton information retrieved successfully', CartonObj);
    }

    async getCartonIdsForPackList(companyCode: string, unitCode: string, packListId: number, cartonsSelectedFor: FgCurrentContainerLocationEnum): Promise<number[]> {
        const cartonIds: number[] = [];
        if (cartonsSelectedFor) {
            const cartons = await this.dataSource.getRepository(InsConfigItemsEntity).find({ select: ['insItemId'], where: { companyCode: companyCode, unitCode: unitCode, plRefId: packListId } })
            cartons.forEach(r => {
                cartonIds.push(r.insItemId);
            });
            // await this.cartonRepo.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, inspectionPick: insPick, pkConfigId: packListId } });
        } else {
            const cartons = await this.cartonRepo.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, pkConfigId: packListId } });
            cartons.forEach(r => {
                cartonIds.push(r.id);
            });
        }
        return cartonIds;
    }

    // HELPER
    async getCartonsBasicInfoForCartonIds(companyCode: string, unitCode: string, cartonIds: number[]): Promise<any[]> {
        const cartons = await this.cartonRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(cartonIds) } });
        const cartonsInfo: CartonBasicInfoModel[] = [];
        const materialMap: Map<number, ItemDimensionsEntity> = new Map()
        for (const carton of cartons) {
            if (!materialMap.has(carton.itemId)) {
                const it = await this.dataSource.getRepository(ItemsEntity).findOne({ where: { id: carton.itemId } })
                const item = await this.itemsDimensionsRepo.findOne({ where: { id: it.dimensionsId } })
                materialMap.set(carton.itemId, item)
            }
            const completedQty = carton.completedQty ? carton.completedQty : 0;
            cartonsInfo.push(new CartonBasicInfoModel(carton.id, carton.cartonProtoId, carton.id, carton.barcode, carton.requiredQty, carton.requiredQty - completedQty, completedQty, carton.poId, carton.pkConfigId, String(carton.pkConfigId), carton.inspectionPick, carton.grossWeight, carton.netWeight, carton.plannedGrossWeight, carton.plannedNetWeight, materialMap.get(carton.itemId).width, materialMap.get(carton.itemId).length, materialMap.get(carton.itemId).height));
        }
        return cartonsInfo;
    }

    async getCartonsInfoForCartonIds(companyCode: string, unitCode: string, cartonIds: number[], iNeedCartonActualInfoAlso: boolean): Promise<CartonInfoModel[]> {
        const cartons = await this.cartonRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(cartonIds) } });
        const cartonsInfo: any[] = [];
        const materialMap: Map<number, ItemDimensionsEntity> = new Map()
        for (const carton of cartons) {
            if (!materialMap.has(carton.itemId)) {
                const it = await this.dataSource.getRepository(ItemsEntity).findOne({ where: { id: carton.itemId } })
                const item = await this.itemsDimensionsRepo.findOne({ where: { id: it.dimensionsId } })
                materialMap.set(carton.itemId, item)
            }
            const findPackListNo = await this.configRepo.findOne({ select: ['plConfigNo'], where: { id: carton.pkConfigId } })
            cartonsInfo.push(new CartonInfoModel(carton.id, carton.cartonProtoId, carton.id, carton.requiredQty, carton.inspectionPick, carton.barcode, materialMap.get(carton.itemId).width, materialMap.get(carton.itemId).length, materialMap.get(carton.itemId).height, carton.grossWeight, carton.netWeight, findPackListNo.plConfigNo, carton.pkConfigId));
        }
        return cartonsInfo;
    }


    async isCartonPackingDone(req: CartonBarCodesReqDto): Promise<GlobalResponseObject> {
        const scannedCartonsCount = await this.cartonRepo.count({ where: { barcode: In(req.cartonBarCodes), companyCode: req.companyCode, unitCode: req.unitCode, packingStatus: PackingStatusEnum.COMPLETED } })
        if (scannedCartonsCount !== req?.cartonBarCodes?.length) {
            throw new ErrorResponse(6451, 'Material is not ready for inspection')
        }
        return new GlobalResponseObject(true, 65413, 'Data Retrieved Successfully')
    }

    async getBOMItemsForPackOrder(req: PoIdRequest): Promise<ItemsResponse> {
        const packOrderId = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['id'], where: { processingSerial: req.poID } })
        const bomItems = await this.bomItemsRepo.find({ select: ['bomId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packOrderId: packOrderId.id } });
        return await this.itemsService.getItemsDataForItemIds(req.companyCode, req.unitCode, bomItems.map(rec => rec.bomId));
    }
}