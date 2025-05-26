import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { FGContainerGroupTypeEnum, PackListIdRequest, PgCartonsModel, PgCartonsResponse, ContainerGroupIdRequest, CartonInfoModel } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { FGContainerGroupItemsEntity } from './entities/container-group/container-group-items.entity';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { ContainerGroupItemsRepo } from './repositories/container-group-items.repository';
import { ContainerGroupRepo } from './repositories/container-group.repository';
import { PLConfigEntity } from '../packing-list/entities/pack-list.entity';

@Injectable()
export class FGContainerGroupInfoService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private containerCartonMapRepo: ContainerCartonMapRepo,
        @Inject(forwardRef(() => LocationMappingHelperService)) private locAllocHelper: LocationMappingHelperService,
        private containerGroupRepo: ContainerGroupRepo,
        private containerGroupItemRepo: ContainerGroupItemsRepo
    ) {

    }

    // ENDPOUNT
    // READER
    async getPgIdsForPackListId(req: PackListIdRequest): Promise<PgCartonsResponse> {
        const pgs = await this.containerGroupRepo.find({ select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packListId: req.packListId, isActive: true } });
        if (pgs.length == 0) {
            throw new ErrorResponse(36104, 'No container groups mapped for the pack list');
        }
        const containerDetails: PgCartonsModel[] = [];
        for (const pg of pgs) {
            const packList = await this.dataSource.getRepository(PLConfigEntity).findOne({ where: { id: req.packListId } })
            const containerPhDetail = new PgCartonsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, null,packList.plConfigNo,packList.plConfigDesc);
            containerDetails.push(containerPhDetail);
        }
        return new PgCartonsResponse(true, 46052, 'Pgs for pack list retrieved successfully', containerDetails);
    }

    // ENDPOUNT
    // READER
    async getInspectionCartonsForPgId(req: ContainerGroupIdRequest): Promise<PgCartonsResponse> {
        // get the container groups and group wise cartons
        const pgs = await this.containerGroupRepo.find({ select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.pgId, isActive: true, pgType: FGContainerGroupTypeEnum.INSPECTION } });
        if (pgs.length == 0) {
            throw new ErrorResponse(36104, 'No container groups mapped for the pack list');
        }
        const containerDetails: PgCartonsModel[] = [];
        for (const pg of pgs) {
            const packList = await this.dataSource.getRepository(PLConfigEntity).findOne({ where: { id: pg.packListId } })
            const cartonIds = [];
            // get all the cartons for the pg
            const cartons = await this.containerGroupItemRepo.find({ where: { pgId: pg.id, isActive: true } });
            cartons.forEach(r => cartonIds.push(r.itemLinesId));
            //TODO://
            const cartonInfoModels: CartonInfoModel[] = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, cartonIds, false);
            const containerPhDetail = new PgCartonsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, cartonInfoModels,packList.plConfigNo,packList.plConfigDesc);
            containerDetails.push(containerPhDetail);
        }
        return new PgCartonsResponse(true,36105, 'Container group info retrieved successfully', containerDetails);
    }

    // ENDPOUNT
    // READER
    async getWarehouseCartonsForForPgId(req: ContainerGroupIdRequest): Promise<PgCartonsResponse> {
        // get the container groups and group wise cartons
        const pgs = await this.containerGroupRepo.find({ select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.pgId, isActive: true, pgType: FGContainerGroupTypeEnum.WAREHOUSE } });
        if (pgs.length == 0) {
            throw new ErrorResponse(36104, 'No container groups mapped for the pack list');
        }
        const containerDetails: PgCartonsModel[] = [];
        for (const pg of pgs) {
            const packList = await this.dataSource.getRepository(PLConfigEntity).findOne({ where: { id: pg.packListId } })
            const cartonIds = [];
            // get all the cartons for the pg
            const cartons = await this.containerGroupItemRepo.find({ where: { pgId: pg.id, isActive: true } });
            cartons.forEach(r => cartonIds.push(r.itemLinesId));
            //TODO://
            const cartonInfoModels: CartonInfoModel[] = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, cartonIds, false);
            const containerPhDetail = new PgCartonsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, cartonInfoModels,packList.plConfigNo,packList.plConfigDesc);
            containerDetails.push(containerPhDetail);
        }
        return new PgCartonsResponse(true,36105, 'Container group info retrieved successfully', containerDetails);
    }

    // HELPER
    // READER
    async getDefaultContainerMappedForACarton(companyCode: string, unitCode: string, cartonId: number, pgType: FGContainerGroupTypeEnum,nullifyError?:boolean): Promise<{ pgId: number, defaulContainerId: number, pgName: string, packListId: number }> {
        const pgItem = await this.containerGroupItemRepo.findOne({ select: ['pgId', 'packListId'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, pgType: pgType, itemLinesId: cartonId } });
        if (!pgItem) {
            if(nullifyError){
                return 
            }
            throw new ErrorResponse(46053, 'The Carton is not mapped to any of the container groups');
        }
        const pg = await this.containerGroupRepo.findOne({ select: ['id', 'pgName', 'confirmedContainerId'], where: { id: pgItem.pgId, isActive: true } });
        if (!pg) {
            if(!nullifyError)
            throw new ErrorResponse(46054, 'No container group found for : ' + pgItem.pgId);
        }
        return { pgId: pg.id, defaulContainerId: pg.confirmedContainerId, pgName: pg.pgName, packListId: pg.packListId };
    }

    // HELPER
    // READER
    async getConfirmedContainerMappedForACarton(companyCode: string, unitCode: string, cartonId: number): Promise<{ pgId: number, defaulContainerId: number, pgName: string, packListId: number }> {
        const pgItem = await this.containerCartonMapRepo.findOne({ select: ['confirmedContainerId', 'packListId'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, itemLinesId: cartonId } });
        return { pgId: null, defaulContainerId: pgItem?.confirmedContainerId, pgName: null, packListId: pgItem?.packListId };
    }

    // HELPER
    // READER
    async getCartonIdsMappedForPg(companyCode: string, unitCode: string, pgId: number, transManager: GenericTransactionManager): Promise<number[]> {
        const cartonIds: number[] = [];
        let cartons: FGContainerGroupItemsEntity[] = [];
        if (transManager) {
            cartons = await transManager.getRepository(FGContainerGroupItemsEntity).find({ select: ['itemLinesId'], where: { pgId: pgId, companyCode: companyCode, unitCode: unitCode } });
        } else {
            cartons = await this.containerGroupItemRepo.find({ select: ['itemLinesId'], where: { pgId: pgId, companyCode: companyCode, unitCode: unitCode } });
        }
        cartons.forEach(r => {
            cartonIds.push(r.itemLinesId);
        });
        return cartonIds;
    }

    async getConfirmedContainerIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        return await this.containerCartonMapRepo.getConfirmedContainerIdsForPackList(companyCode, unitCode, packListId);
    }

    async getGrnCompletedBuNotInWhPackListCount(companyCode: string, unitCode: string, packListId: number[]): Promise<number> {
        return await this.containerCartonMapRepo.getGrnCompletedBuNotInWhPackListCount(companyCode, unitCode, packListId);
    }
}