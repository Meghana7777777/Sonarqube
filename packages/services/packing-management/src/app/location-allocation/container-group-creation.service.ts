import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GlobalResponseObject, PackListIdRequest, CartonBasicInfoModel, FGContainerGroupTypeEnum } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import configuration from '../../config/configuration';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { FGContainerGroupItemsEntity } from './entities/container-group/container-group-items.entity';
import { FGContainerGroupEntity } from './entities/container-group/container-group.entity';
import { FGContainerSubGroupEntity } from './entities/container-group/container-sub-group.entity';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { ContainerGroupRepo } from './repositories/container-group.repository';

@Injectable()
export class ContainerGroupCreationService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        @Inject(forwardRef(() => LocationMappingHelperService)) private locAllocHelper: LocationMappingHelperService,
        private containerGroupRepo: ContainerGroupRepo
    ) {

    }

    // ENDPOINT
    // WRITER
    async createContainerGroupsForPackList(req: PackListIdRequest, externalManager?: boolean): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            // check if the mapping is already been created
            const pgs = await transManager.getRepository(FGContainerGroupEntity).findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packListId: req.packListId, isActive: true } });
            if (pgs) {
                if (!externalManager) {
                    throw new ErrorResponse(46050, 'Container groups already created for the pack list');
                } else {               
                    await transManager.getRepository(FGContainerSubGroupEntity).delete({ packListId: req.packListId })
                    await transManager.getRepository(FGContainerGroupItemsEntity).delete({ packListId: req.packListId })
                    await transManager.getRepository(FGContainerGroupEntity).delete({ packListId: req.packListId })
                }
            }
            // create the container groups for the inspection
            await this.createInspectionContainerGroups(req, transManager);
            // create the container groups for warehouse
            await this.createWarehouseContainerGroups(req, transManager);  
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46051, 'Container groups created successfully');
        } catch (err) {
            await transManager.releaseTransaction();
            throw err;
        }
    }

    // HELPER
    // WRITER
    async createInspectionContainerGroups(req: PackListIdRequest, transManager: GenericTransactionManager): Promise<boolean> {
        const cartonIds = await this.locAllocHelper.getInspectionCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        console.log(cartonIds,'createInspectionContainerGroups','cartonIds')
     
        const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, cartonIds);
        const containerCartonCapacity = configuration().appSepcific.containerCartonCapacity;
        if (!containerCartonCapacity) {
            throw new ErrorResponse(36103, 'Max container carton capacity is not defined');
        }
        console.log(cartonsInfo,'createInspectionContainerGroups','cartonsInfo')
        // no group the cartons based on the bacth and the width group
        const groupedCartons = this.getBatchWidthWiseCartons(cartonsInfo);
        // now based on the capacity of the container, split the map into chunks
        const pgGroupedCartons = this.getPgSaggregatedCartons(containerCartonCapacity, groupedCartons, false);
        // based on the info, construct the container_group, container_sub_group and container_group_items entities
        let currentPgId = 0;
        for (const [pgName, pg] of pgGroupedCartons) {
            const pgEntity = this.getContainerGroupEntity(req.companyCode, req.unitCode, req.packListId, pgName, FGContainerGroupTypeEnum.INSPECTION, '', req.username);
            const savedPgEntity = await transManager.getRepository(FGContainerGroupEntity).save(pgEntity);
            currentPgId = savedPgEntity.id;
            for (const [batch, batchCartons] of pg) {
                const pgSubGroups: FGContainerSubGroupEntity[] = [];
                for (const [width, cartons] of batchCartons) {
                    const bathcId = cartons[0].packListId;
                    const pgSubEnt = this.getContainerSubGroupEntity(req.companyCode, req.unitCode, req.packListId, bathcId, currentPgId, FGContainerGroupTypeEnum.INSPECTION, width?.toString(), cartons.length, '', req.username);

                    //push the records into an array
                    pgSubGroups.push(pgSubEnt);

                    const pgItems: FGContainerGroupItemsEntity[] = [];
                    cartons.forEach(carton => {
                        const pgItem = this.getContainerGroupItemsEntity(req.companyCode, req.unitCode, req.packListId, carton.cartonId, currentPgId, pgName, FGContainerGroupTypeEnum.INSPECTION, '', req.username);
                        pgItems.push(pgItem);
                    });
                    console.log(pgItems,'pgItemspgItems')
                    await transManager.getRepository(FGContainerGroupItemsEntity).save(pgItems, { reload: false });
                };
                await transManager.getRepository(FGContainerSubGroupEntity).save(pgSubGroups);
            }
        }

        return true;
    }

    // HELPER
    getContainerGroupEntity(companyCode: string, unitCode: string, packListId: number, pgName: string, pgType: FGContainerGroupTypeEnum, remarks: string, username: string): FGContainerGroupEntity {
        const ent = new FGContainerGroupEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgName = pgName;
        ent.pgType = pgType;
        ent.remarks = remarks;
        return ent;
    }

    // HELPER
    getContainerSubGroupEntity(companyCode: string, unitCode: string, packListId: number, phLinesId: number, pgId: number, pgType: FGContainerGroupTypeEnum, width: string, itemCount: number, remarks: string, username: string): FGContainerSubGroupEntity {
        const ent = new FGContainerSubGroupEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgId = pgId;
        ent.pgType = pgType;
        ent.remarks = remarks;
        ent.itemCount = itemCount;
        ent.phLinesId = phLinesId;
        ent.width = width;
        return ent;
    }

    // HELPER
    getContainerGroupItemsEntity(companyCode: string, unitCode: string, packListId: number, itemLinesId: number, pgId: number, pgName: string, pgType: FGContainerGroupTypeEnum, remarks: string, username: string): FGContainerGroupItemsEntity {
        const ent = new FGContainerGroupItemsEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgName = pgName;
        ent.pgType = pgType;
        ent.remarks = remarks;
        ent.itemLinesId = itemLinesId;
        ent.pgId = pgId;
        ent.pgName = pgName;
        return ent;
    }

    // HELPER
    getBatchWidthWiseCartons(cartonsInfo: CartonBasicInfoModel[]): Map<string, Map<number, CartonBasicInfoModel[]>> {
        const map = new Map<string, Map<number, CartonBasicInfoModel[]>>();
        cartonsInfo.forEach(r => {
            const width = Math.ceil(Number(r.width));
            if (!map.has(r.packListCode)) {
                map.set(r.packListCode, new Map<number, CartonBasicInfoModel[]>());
            }
            if (!map.get(r.packListCode).has(width)) {
                map.get(r.packListCode).set(width, []);
            }
            map.get(r.packListCode).get(width).push(r);
        });
        return map;
    }

    // HELPER
    getPgSaggregatedCartons(containerCartonCapacity: number, groupedCartons: Map<string, Map<number, CartonBasicInfoModel[]>>, saggregateBatchWise: boolean) {
        let pgCounter = 1;
        let cpPendingCartons = containerCartonCapacity;
        let currPgName = 'PG-1';

        const pgMap = new Map<string, Map<string, Map<number, CartonBasicInfoModel[]>>>();
        pgMap.set(currPgName, new Map<string, Map<number, CartonBasicInfoModel[]>>);

        groupedCartons.forEach((b, batch) => {
            b.forEach((wCartons, cartonWidth) => {
                wCartons.forEach((r, i) => {
                    cpPendingCartons--;

                    // NOTE: Do not move these below 2 set statements above the for loop for performance optimization. 
                    if (!pgMap.get(currPgName).has(batch)) {
                        pgMap.get(currPgName).set(batch, new Map<number, CartonBasicInfoModel[]>());
                    }
                    if (!pgMap.get(currPgName).get(batch).has(cartonWidth)) {
                        pgMap.get(currPgName).get(batch).set(cartonWidth, []);
                    }
                    // push the carton to the existing PG
                    pgMap.get(currPgName).get(batch).get(cartonWidth).push(r);

                    // set the new key to the map
                    if (cpPendingCartons == 0) {
                        pgCounter++;
                        currPgName = 'PG-' + pgCounter;
                        // create a new  PG here and set all the properties to the map
                        pgMap.set(currPgName, new Map<string, Map<number, CartonBasicInfoModel[]>>);
                        cpPendingCartons = containerCartonCapacity;
                    }
                });
            });

            // If the container grouping is done for the 
            if (saggregateBatchWise) {
                // before initilaizing it to one, just check if the current batch has 0 records, then pg name should not be incremented
                if (pgMap.get(currPgName)?.get(batch)?.size > 0) {
                    // do nothing
                    pgCounter++;
                    currPgName = 'PG-' + pgCounter;
                    cpPendingCartons = containerCartonCapacity;
                    pgMap.set(currPgName, new Map<string, Map<number, CartonBasicInfoModel[]>>);
                }
            }
        });
        return pgMap;
    }

    // HELPER
    // WRITER
    async createWarehouseContainerGroups(req: PackListIdRequest, transManager: GenericTransactionManager): Promise<boolean> {
        const cartonIds = await this.locAllocHelper.getWarehouseCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, cartonIds);
        // console.log(cartonsInfo,'cartonsInfocartonsInfocartonsInfocartonsInfo')
        const containerCartonCapacity = configuration().appSepcific.containerCartonCapacity;
        if (!containerCartonCapacity) {
            throw new ErrorResponse(36103, 'Max container carton capacity is not defined');
        }
        // no group the cartons based on the bacth and the width group
        const groupedCartons = this.getBatchWidthWiseCartons(cartonsInfo);
        // now based on the capacity of the container, split the map into chunks
        const pgGroupedCartons = this.getPgSaggregatedCartons(containerCartonCapacity, groupedCartons, true);
        // based on the info, construct the container_group, container_sub_group and container_group_items entities
        let currentPgId = 0;
        for (const [pgName, pg] of pgGroupedCartons) {
            for (const [batch, batchCartons] of pg) {
                const pgEntity = this.getContainerGroupEntity(req.companyCode, req.unitCode, req.packListId, pgName, FGContainerGroupTypeEnum.WAREHOUSE, '', req.username);
                const savedPgEntity = await transManager.getRepository(FGContainerGroupEntity).save(pgEntity);
                currentPgId = savedPgEntity.id;

                const pgSubGroups: FGContainerSubGroupEntity[] = [];
                for (const [width, cartons] of batchCartons) {
                    const bathcId = cartons[0].packListId;

                    const pgSubEnt = this.getContainerSubGroupEntity(req.companyCode, req.unitCode, req.packListId, bathcId, currentPgId, FGContainerGroupTypeEnum.WAREHOUSE, width?.toString(), cartons.length, '', req.username);

                    //push the records into an array
                    pgSubGroups.push(pgSubEnt);

                    const pgItems: FGContainerGroupItemsEntity[] = [];
                    cartons.forEach(carton => {
                        const pgItem = this.getContainerGroupItemsEntity(req.companyCode, req.unitCode, req.packListId, carton.cartonId, currentPgId, pgName, FGContainerGroupTypeEnum.WAREHOUSE, '', req.username);
                        pgItems.push(pgItem);
                    });
                    await transManager.getRepository(FGContainerGroupItemsEntity).save(pgItems, { reload: false });
                }
                await transManager.getRepository(FGContainerSubGroupEntity).save(pgSubGroups);
            }
        }

        return true;
    }

    // HELPER
    // WRITER
    async updateContainerIdToPg(companyCode: string, unitCode: string, pgId: number, containerId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        await transManager.getRepository(FGContainerGroupEntity).update({ id: pgId }, { confirmedContainerId: containerId, updatedUser: username });
        return true;
    }
}