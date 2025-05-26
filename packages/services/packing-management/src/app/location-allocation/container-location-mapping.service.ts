import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ContainerLocationMapRepo } from './repositories/container-location-map.repository';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { FGContainerLocationMapEntity } from './entities/container-location-map.entity';
import { FGContainerCartonMapEntity } from './entities/container-carton-map.entity';
import { FGContainerLocationMapHistoryEntity } from './entities/container-location-map-history.entity';
import { LocationContainerMappingRequest, GlobalResponseObject, PackListIdRequest, FgCurrentContainerLocationEnum, ContainerIdRequest, FgContainerLocationStatusEnum, PackOrderIdModel, CartonBarcodeLocationRequest } from '@xpparel/shared-models';
import { FgWarehouseBarcodeScanningService } from '../fg-warehouse/fg-wh-barcode-scanning.service';
import { FgMContainerEntity } from '../__masters__/container/entities/fgm-container.entity';
import { FgMLocationEntity } from '../__masters__/location/entities/fgm-location.entity';
import { CrtnEntity } from '../packing-list/entities/crtns.entity';

@Injectable()
export class ContainerLocationMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private containerCartonMapRepo: ContainerCartonMapRepo,
        private containerLocationMapRepo: ContainerLocationMapRepo,
        @Inject(forwardRef(() => LocationMappingHelperService))
        private locAllocHelper: LocationMappingHelperService,
        private fgWhBarcodeScanningService: FgWarehouseBarcodeScanningService
    ) {

    }

    // END POINT
    // FUNCIONALITY
    async confirmContainersToLocation(req: LocationContainerMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const overRideSysAllocation: boolean = req.isOverRideSysAllocation;
            const containerIdsSet = new Set<number>();
            req.containerInfo.forEach(r => containerIdsSet.add(r.containerId));
            if (containerIdsSet.size == 0) {
                throw new ErrorResponse(46094, 'Please select the containers');
            }
            const containerIds = Array.from(containerIdsSet);

            // check if the pllaets and the location exist
            await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, containerIds);
            // await this.locAllocHelper.getBasicInfoForLocationIds(req.companyCode, req.unitCode, [req.locationId]);

            // if the container is already mapped to some location, then remove it from the old location to the new Location
            const containerLocationMapEnts: FGContainerLocationMapEntity[] = [];
            const containerLocationMapHisEnts: FGContainerLocationMapHistoryEntity[] = [];
            await transManager.startTransaction();
            for (const containerId of containerIds) {
                // check if the pllaet in any location currently
                const containerInAnylocation = await this.containerLocationMapRepo.findOne({ select: ['suggestedLocationId', 'confirmedLocationId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, containerId: containerId, isActive: true } })
                if (containerInAnylocation) {
                    if (!overRideSysAllocation) {
                        const sysMappedLocation = containerInAnylocation.suggestedLocationId;
                        if (sysMappedLocation != req.locationId) {
                            throw new ErrorResponse(46061, 'Trying to allocate to a different location than the system suggested location');
                        }
                    }
                    if (containerInAnylocation.confirmedLocationId == req.locationId && containerInAnylocation.status == FgContainerLocationStatusEnum.CONFIRMED) {
                        throw new ErrorResponse(46062, 'The container is already placed in the current location');
                    }
                    // Validation funnction that checks if a container can be placed into a location without any space issues
                    await this.validateLocationCapacityForContainerConfirmation(req.companyCode, req.unitCode, containerId, req.locationId, transManager);

                    // then map the container to the new location and create a history record
                    // else update the new confirmed container ID to the carton and unmap it from the old container. Also insert the record into the history
                    await transManager.getRepository(FGContainerLocationMapEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, containerId: containerId }, {
                        confirmedLocationId: req.locationId, updatedUser: req.username, status: FgContainerLocationStatusEnum.CONFIRMED
                    });
                    // create the history entity
                    const historyEnt = this.getContainerLocationMapHistoryEntity(req.companyCode, req.unitCode, req.username, containerId, '', containerInAnylocation.confirmedLocationId, req.locationId);
                    containerLocationMapHisEnts.push(historyEnt);
                } else if (overRideSysAllocation) {
                    // Validation funnction that checks if a container can be placed into a location without any space issues
                    await this.validateLocationCapacityForContainerConfirmation(req.companyCode, req.unitCode, containerId, req.locationId, transManager);
                    // simply map the container to the location
                    const containerLocationMapentity = this.getContainerLocationMapEntity(req.companyCode, req.unitCode, req.username, containerId, req.locationId, req.locationId, FgContainerLocationStatusEnum.CONFIRMED);
                    containerLocationMapEnts.push(containerLocationMapentity);
                } else {
                    throw new ErrorResponse(46063, 'Containers can only be placed in suggested location without approval')
                }
            }
            // save all the carton mappings and the histories
            await transManager.getRepository(FGContainerLocationMapEntity).save(containerLocationMapEnts);
            await transManager.getRepository(FGContainerLocationMapHistoryEntity).save(containerLocationMapHisEnts);
            const container = await transManager.getRepository(FGContainerLocationMapEntity).findOne({ select: ['confirmedLocationId'], where: { containerId: req.containerInfo[0].containerId, companyCode: req.companyCode, unitCode: req.unitCode } })
            const location = await transManager.getRepository(FgMLocationEntity).findOne({ select: ['barcodeId'], where: { id: container.confirmedLocationId, companyCode: req.companyCode, unitCode: req.unitCode } })
            const cartonIds = await transManager.getRepository(FGContainerCartonMapEntity).find({ select: ['itemLinesId'], where: { confirmedContainerId: req.containerInfo[0].containerId, companyCode: req.companyCode, unitCode: req.unitCode } })
            const cartonIdsSet = new Set<number>()
            cartonIds.forEach((rec) => cartonIdsSet.add(rec.itemLinesId))
            const findCartonBarCodes = await transManager.getRepository(CrtnEntity).find({ select: ['barcode'], where: { id: In([...cartonIdsSet]), companyCode: req.companyCode, unitCode: req.unitCode } })
            const reqBarCodes = findCartonBarCodes.map((rec) => rec.barcode);
            const fgWhReq = new CartonBarcodeLocationRequest(reqBarCodes, req.username, req.unitCode, req.companyCode, req.userId, location.barcodeId);
            await this.fgWhBarcodeScanningService.FgWarehouseInBarcodeLocationMapping(fgWhReq)
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46064, 'Container is mapped to the location');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // END POINT
    // FUNCIONALITY
    async allocateContainersToLocation(req: LocationContainerMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const locationId = req.locationId;
            const containerIdsSet = new Set<number>();
            req.containerInfo.forEach(r => containerIdsSet.add(r.containerId));
            if (containerIdsSet.size == 0) {
                throw new ErrorResponse(46094, 'Please select the containers');
            }
            const containerIds = Array.from(containerIdsSet);
            await transManager.startTransaction();
            for (const containerId of containerIds) {
                // check if the pllaet is existing or not
                await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, containerIds);
                const containerLocationMapRecord = await this.containerLocationMapRepo.findOne({ where: { containerId: containerId, isActive: true, companyCode: req.companyCode, unitCode: req.unitCode } });
                if (!containerLocationMapRecord) {
                    // check if the selected location has some free space
                    await this.validateLocationCapacityForContainerAllocation(req.companyCode, req.unitCode, 0, locationId, transManager);
                    const containerLocationMapEntity = this.getContainerLocationMapEntity(req.companyCode, req.unitCode, req.username, containerId, locationId, locationId, FgContainerLocationStatusEnum.OPEN);
                    await transManager.getRepository(FGContainerLocationMapEntity).save(containerLocationMapEntity);
                } else {
                    if (containerLocationMapRecord.status == FgContainerLocationStatusEnum.CONFIRMED) {
                        throw new ErrorResponse(46065, 'Container is already confirmed to a location');
                    }
                    // check if the same location is being mapped
                    if (containerLocationMapRecord.suggestedLocationId == locationId) {
                        throw new ErrorResponse(46066, 'Container is already mapped to the same location');
                    }
                    // check if the selected location has some free space
                    await this.validateLocationCapacityForContainerAllocation(req.companyCode, req.unitCode, 0, locationId, transManager);
                    // update the suggested location id to the container
                    await transManager.getRepository(FGContainerLocationMapEntity).update({ containerId: containerId, companyCode: req.companyCode, unitCode: req.unitCode }, { suggestedLocationId: locationId, updatedUser: req.username });
                }
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46067, 'Container is mapped to the suggested location')
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // END POINT
    // FUNCIONALITY
    async allocatePakcListContainersToLocation(req: PackOrderIdModel): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const packOrderId = req.packOrderId;
            const locationContainerMap = new Map<number, { containerId: number }[]>();
            const consumedContainerIds = new Set<number>();
            const toConsiderContainerIds = new Set<number>();
            // get all the confirmed containers for the packing list
            const confirmedContainersForPackList = await this.containerCartonMapRepo.getConfirmedContainerIdsForPackList(req.companyCode, req.unitCode, packOrderId);
            if (confirmedContainersForPackList.length == 0) {
                throw new ErrorResponse(46095, 'No conformed containers for the packing list');
            }

            const onlyWhContainerIds: number[] = [];
            // filter out the inpsection containers
            const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, confirmedContainersForPackList);
            containersInfo.forEach(r => {
                if (r.containerCurrentLoc == FgCurrentContainerLocationEnum.WAREHOUSE) {
                    // only consider the warehouse related containers
                    onlyWhContainerIds.push(r.containerId);
                }
            });

            // filter out the already suggested/confirmed containers
            const alreadySugOrConContainers = await this.containerLocationMapRepo.find({ select: ['containerId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, containerId: In(onlyWhContainerIds), isActive: true } });
            const alreadySugOrConContainerIds = new Set<number>();
            alreadySugOrConContainers.forEach(r => {
                alreadySugOrConContainerIds.add(r.containerId);
            });
            onlyWhContainerIds.forEach(r => {
                if (!alreadySugOrConContainerIds.has(r)) {
                    toConsiderContainerIds.add(r);
                }
            });

            // validates that all the containers are existing in the system - NO NEED. CAN REMOVE
            // await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, confirmedContainers);

            // get all free space Locations
            const spaceFreeLocations = await this.locAllocHelper.getAllSpaceFreeLocationsInWarehouse(req.companyCode, req.unitCode, req.whId);
            spaceFreeLocations.forEach(location => {
                const capacity = location.totalSupportedContainers;
                let freeSpace = location.totalFilledContainers;
                for (const containerId of toConsiderContainerIds) {
                    if (consumedContainerIds.has(containerId)) {
                        continue;
                    }
                    if (freeSpace < capacity) {
                        if (!locationContainerMap.has(location.locationId)) {
                            locationContainerMap.set(location.locationId, []);
                        }
                        locationContainerMap.get(location.locationId).push({ containerId: containerId });
                        consumedContainerIds.add(containerId);
                        freeSpace++;
                    }
                }
            });
            const containerLocationMapEnts: FGContainerLocationMapEntity[] = [];
            locationContainerMap.forEach((containers, location) => {
                containers.forEach(p => {
                    const containerLocationMapentity = this.getContainerLocationMapEntity(req.companyCode, req.unitCode, req.username, p.containerId, location, location, FgContainerLocationStatusEnum.OPEN);
                    containerLocationMapEnts.push(containerLocationMapentity);
                });
            });
            await transManager.startTransaction();
            await transManager.getRepository(FGContainerLocationMapEntity).save(containerLocationMapEnts);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46068, 'Containers mapped to location');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    getContainerLocationMapEntity(companyCode: string, unitCode: string, username: string, containerId: number, suggestedLocationId: number, confirmedLocationId: number, status: FgContainerLocationStatusEnum): FGContainerLocationMapEntity {
        const containerLocationMapEnt = new FGContainerLocationMapEntity();
        containerLocationMapEnt.companyCode = companyCode;
        containerLocationMapEnt.unitCode = unitCode;
        containerLocationMapEnt.createdUser = username;
        containerLocationMapEnt.containerId = containerId;
        containerLocationMapEnt.suggestedLocationId = suggestedLocationId;
        containerLocationMapEnt.confirmedLocationId = confirmedLocationId;
        containerLocationMapEnt.status = status;
        return containerLocationMapEnt;
    }

    // HELPER
    getContainerLocationMapHistoryEntity(companyCode: string, unitCode: string, username: string, containerId: number, remarks: string, fromLocationId: number, toLocationId: number): FGContainerLocationMapHistoryEntity {
        const containerLocationMapHistEnt = new FGContainerLocationMapHistoryEntity();
        containerLocationMapHistEnt.companyCode = companyCode;
        containerLocationMapHistEnt.unitCode = unitCode;
        containerLocationMapHistEnt.createdUser = username;
        containerLocationMapHistEnt.movedBy = username;
        containerLocationMapHistEnt.remarks = remarks;
        containerLocationMapHistEnt.fromLocationId = fromLocationId;
        containerLocationMapHistEnt.toLocationId = toLocationId;
        containerLocationMapHistEnt.containerId = containerId;
        return containerLocationMapHistEnt;
    }

    // HELPER
    async validateLocationCapacityForContainerConfirmation(companyCode: string, unitCode: string, containerId: number, locationId: number, transManager: GenericTransactionManager): Promise<boolean> {
        // get the allocated and the sugegsted containers in the location
        const totalSugAndConfContainersInLocation = await this.locAllocHelper.getLocationWithSuggestedAndConfirmedContainers(companyCode, unitCode, locationId, transManager);
        // const allocatedContainersInLocation = await transManager.getRepository(ContainerLocationMapEntity).find({ select: ['id', 'containerId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedLocationId: locationId, status: ContainerLocationStatusEnum.CONFIRMED, isActive: true} });
        const locationBasicInfo = await this.locAllocHelper.getBasicInfoForLocationIds(companyCode, unitCode, [locationId]);
        const currentLocationInfo = locationBasicInfo[0];
        if (!currentLocationInfo) {
            throw new ErrorResponse(46010, 'Location does not exist');
        }
        const totalContainersInLocation = totalSugAndConfContainersInLocation.confirmedContainers; // allocatedContainersInLocation.length;
        const locationCapacity = currentLocationInfo.totalSupportedContainers;
        if (totalContainersInLocation >= locationCapacity) {
            throw new ErrorResponse(46096,'Location capacity is already full. Cannot keep more containers');
        }
        return true;
    }

    // HELPER
    async validateLocationCapacityForContainerAllocation(companyCode: string, unitCode: string, containerId: number, locationId: number, transManager: GenericTransactionManager): Promise<boolean> {
        // get the allocated and the sugegsted containers in the location
        const totalSugAndConfContainersInLocation = await this.locAllocHelper.getLocationWithSuggestedAndConfirmedContainers(companyCode, unitCode, locationId, transManager);
        const locationBasicInfo = await this.locAllocHelper.getBasicInfoForLocationIds(companyCode, unitCode, [locationId]);
        const currentLocationInfo = locationBasicInfo[0];
        if (!currentLocationInfo) {
            throw new ErrorResponse(46010, 'Location does not exist');
        }
        const totalContainersInLocation = totalSugAndConfContainersInLocation.allocateContainers + totalSugAndConfContainersInLocation.confirmedContainers;
        const locationCapacity = currentLocationInfo.totalSupportedContainers;
        if (totalContainersInLocation >= locationCapacity) {
            throw new ErrorResponse(46096,'Location capacity is already full. Cannot keep more containers');
        }
        return true;
    }

    // End Point to Unmap container from Location
    async unmapContainerFromALocation(req: ContainerIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            // get all the confirmed containers for the packing list
            const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [req.containerId]);
            if (containersInfo.length == 0) {
                throw new ErrorResponse(46095, 'No confirmed containers for the packing list');
            }
            await transManager.startTransaction();
            await this.unmapContainerToALocationHelper(req.companyCode, req.unitCode, req.containerId, req.username, transManager);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46069, 'Container UnMapped Successfully.');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    // unmaps the container to a location when ever a container is scanned to put a carton into it
    async unmapContainerToALocationHelper(companyCode: string, unitCode: string, containerId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        // unmap the container to the location
        const containerMapRec = await transManager.getRepository(FGContainerLocationMapEntity).findOne({ select: ['containerId', 'confirmedLocationId', 'status'], where: { companyCode: companyCode, unitCode: unitCode, containerId: containerId } });
        // if(containerMapRec?.status == ContainerLocationStatusEnum.CONFIRMED) {
        await transManager.getRepository(FGContainerLocationMapEntity).update({ companyCode: companyCode, unitCode: unitCode, containerId: containerId }, { status: FgContainerLocationStatusEnum.OPEN, updatedUser: username, isActive: false });
        // create the history record also
        const historyEnt = this.getContainerLocationMapHistoryEntity(companyCode, unitCode, username, containerId, 'unmapped', containerMapRec.confirmedLocationId, 0);
        await transManager.getRepository(FGContainerLocationMapHistoryEntity).save(historyEnt);
        // }
        return true;
    }
}
