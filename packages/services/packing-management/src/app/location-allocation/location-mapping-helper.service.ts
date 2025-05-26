import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CartonBasicInfoModel, CartonInfoModel, ContainerDetailsModel, FgContainerBehaviorEnum, FgContainerLocationStatusEnum, FgContainersDetailsModel, FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum, GlobalResponseObject, LocationDetailsModel } from '@xpparel/shared-models';
import { In } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { FgContainerDataService } from '../__masters__/container/fg-container-data-service';
import { FgLocationsService } from '../__masters__/location/fg-location.services';
import { PackingListInfoService } from '../packing-list/packing-list.info.service';
import { FGContainerLocationMapEntity } from './entities/container-location-map.entity';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { ContainerLocationMapRepo } from './repositories/container-location-map.repository';


@Injectable()
export class LocationMappingHelperService {
    constructor(
        private containerCartonMapRepo: ContainerCartonMapRepo,
        private containerLocationRepo: ContainerLocationMapRepo,
        @Inject(forwardRef(() => PackingListInfoService)) private packlistInfoService: PackingListInfoService,
        @Inject(forwardRef(() => FgContainerDataService)) private containersService: FgContainerDataService,
        @Inject(forwardRef(() => FgLocationsService)) private locationService: FgLocationsService,
    ) {

    }

    async getInspectionCartonIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        return await this.packlistInfoService.getCartonIdsForPackList(companyCode, unitCode, packListId, FgCurrentContainerLocationEnum.INSPECTION);
    }

    async getWarehouseCartonIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        return await this.packlistInfoService.getCartonIdsForPackList(companyCode, unitCode, packListId, FgCurrentContainerLocationEnum.WAREHOUSE);
    }

    async getCartonIdsForContainer(companyCode: string, unitCode: string, containerId: number, cartonMapStatus: FgContainerLocationStatusEnum[]): Promise<number[]> {
        const cartonIds: number[] = [];
        const allocatedCartonsForContainer = await this.containerCartonMapRepo.find({
            select: ['suggestedContainerId', 'confirmedContainerId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: containerId, isActive: true, status: In(cartonMapStatus) }
        });
        // all the cartons in the container
        const allocatedCartonIds = allocatedCartonsForContainer.map(r => r.itemLinesId);
        return allocatedCartonIds;
    }

    // HELPER
    async getBasicInfoForCartonIds(companyCode: string, unitCode: string, cartonIds: number[]): Promise<CartonBasicInfoModel[]> {
        const cartonsBasicInfo: CartonBasicInfoModel[] = await this.packlistInfoService.getCartonsBasicInfoForCartonIds(companyCode, unitCode, cartonIds);
        return cartonsBasicInfo ?? [];
    }

    // HELPER
    // NOTE: NEED TO OVERRIDE THE ALLOCTION CONFIRMATION STATUS
    // -----------------------------------------------------------------------------------------------------------------------------------------
    async getCartonInfoForCartonIds(companyCode: string, unitCode: string, cartonIds: number[], iNeedCartonActualInfoAlso: boolean): Promise<CartonInfoModel[]> {
        const cartonsInfo: CartonInfoModel[] = await this.packlistInfoService.getCartonsInfoForCartonIds(companyCode, unitCode, cartonIds, iNeedCartonActualInfoAlso);
        if (cartonsInfo.length == 0) {
            throw new ErrorResponse(46077, 'Given cartons doesnt exist');
        }
        // now update the mapping status of the container if it is already mapped to a container
        // -------------------------- NEEDS status OVERRIDE --------------------
        for (const carton of cartonsInfo) {
            // check if the carton is confirmed to any container
            //TODO://
            // const cartonConf = await this.containerCartonMapRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, itemLinesId: carton.id, isActive: true, status: ContainerLocationStatusEnum.CONFIRMED } });
            // carton.status = cartonConf > 0 ? ContainerLocationStatusEnum.CONFIRMED : ContainerLocationStatusEnum.OPEN;
        }
        return cartonsInfo ?? [];
    }

    // HELPER
    getCartonIdsInfoMap(basicCartonsInfo: CartonBasicInfoModel[]): Map<number, CartonBasicInfoModel> {
        const cartonBasicInfoMap = new Map<number, CartonBasicInfoModel>();
        basicCartonsInfo.forEach(r => {
            cartonBasicInfoMap.set(r.cartonId, r);
        });
        return cartonBasicInfoMap;
    }


    // HELPER
    // NOTE: NEED TO OVERRIDE THE ALLOCTION CONFIRMATION STATUS
    // -----------------------------------------------------------------------------------------------------------------------------------------
    async getBasicInfoForContainerIds(companyCode: string, unitCode: string, containerIds: number[]): Promise<FgContainersDetailsModel[]> {
        let containerBasicInfo: FgContainersDetailsModel[] = await this.containersService.getContainersBasicInfo(companyCode, unitCode, containerIds);
        if (containerBasicInfo.length == 0) {
            throw new ErrorResponse(46078, 'Selected containers does not exist');
        }
        // -------------------------- NEEDS status OVERRIDE --------------------
        // now update the mapping status of the container if it is already mapped to a location
        for (const container of containerBasicInfo) {
            const containerConf = await this.containerLocationRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, containerId: container.containerId, isActive: true, status: FgContainerLocationStatusEnum.CONFIRMED } });
            container.status = containerConf > 0 ? FgContainerLocationStatusEnum.CONFIRMED : FgContainerLocationStatusEnum.OPEN;
        }
        return containerBasicInfo ?? [];
    }

    // API
    // TODO API
    async getBasicInfoForLocationIds(companyCode: string, unitCode: string, locationIds: number[]): Promise<LocationDetailsModel[]> {
        // call the API and get the pack list ids for the carton ids
        const location = await this.locationService.getLocationsBasicInfo(companyCode, unitCode, locationIds);
        if (location.length == 0) {
            throw new ErrorResponse(46079, 'Selected location does not exist');
        }
        return location ?? [];
    }

    // API
    // TODO API
    async getAllSpaceFreeContainersInWarehouse(companyCode: string, unitCode: string, whId: number, rackId?: number[], locationId?: number[]): Promise<FgContainersDetailsModel[]> {
        const freeContainers: FgContainersDetailsModel[] = [];
        // call the API and get the pack list ids for the carton ids
        // MUST get the consumed qty of the containers whose confirmed_container_id has some value
        const allContainersInWh = await this.containersService.getAllContainersBasicInfo(companyCode, unitCode, whId, rackId, locationId);
        for (const container of allContainersInWh) {
            // get the allocated qty from the container carton map

            // -----------------     CONFIRMED CARTONS ----------------------
            let currentCartonsInContainer = 0;
            const confirmedCartons = await this.containerCartonMapRepo.find({ select: ['id', 'itemLinesId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: container.containerId, status: FgContainerLocationStatusEnum.CONFIRMED, isActive: true } });
            const confirmedCartonIds = confirmedCartons.map(r => r.itemLinesId);
            const confirmedCartonBasicInfo: CartonBasicInfoModel[] = await this.getBasicInfoForCartonIds(companyCode, unitCode, confirmedCartonIds);
            // const consumedContainerQty = confirmedCartonBasicInfo.reduce((sum, r) => sum + Number(r.leftOverQuantity), 0);
            confirmedCartonBasicInfo.forEach(r => {
                // only if the carton have some qty in the container, then we can consider the carton as a valid one in the container
                if (Number(r.leftOverQuantity) > 0) {
                    currentCartonsInContainer += 1;
                }
            });

            // override the qtys by using the refernece
            // container.confirmedQty = consumedContainerQty;
            container.totalConfirmedCartons = currentCartonsInContainer;
            // container.allocatedQty = allocatedContainerQty;
            // container.totalAllocatedCartons = allocatedCartonsInContainer;
            container.allocatedQty = 0;
            container.totalAllocatedCartons = 0;

            // No calculate the system alloactions
            // decide if the container has some free space
            let canSupportSomeWeight = true;
            let canSupportSomeCartons = false;
            let canSupportSomeCapacity = true;

            // canSupportSomeCartons = (container.maxItems - currentCartonsInContainer + allocatedCartonsInContainer) > 0;
            // canSupportSomeCapacity = (container.containerCapacity - consumedContainerQty + allocatedContainerQty) > 0;
            canSupportSomeCartons = (container.maxItems - currentCartonsInContainer + 0) > 0;
            // canSupportSomeCapacity = (container.containerCapacity - consumedContainerQty + 0) > 0;
            if (canSupportSomeWeight && canSupportSomeCartons && canSupportSomeCapacity) {
                TODO:// need to correct after this
                freeContainers.push(container);
            } else {
                // skip to next container
                continue;
            }
        }
        return freeContainers ?? [];
    }

    // HELPER
    getContainerIdsInfoMap(basicCartonsInfo: ContainerDetailsModel[]): Map<number, ContainerDetailsModel> {
        const cartonBasicInfoMap = new Map<number, ContainerDetailsModel>();
        basicCartonsInfo.forEach(r => {
            cartonBasicInfoMap.set(r.containerId, r);
        });
        return cartonBasicInfoMap;
    }

    // HELPER
    async getAllSpaceFreeLocationsInWarehouse(companyCode: string, unitCode: string, whId: number, rackId?: number[]): Promise<LocationDetailsModel[]> {
        const freeLocations: LocationDetailsModel[] = [];
        const locationDetails = await this.locationService.getAllLocationsBasicInfo(companyCode, unitCode, whId, rackId);
        for (const location of locationDetails) {
            // check if this location has any free space to put the containers
            const containersInLocation = await this.getLocationWithSuggestedAndConfirmedContainers(companyCode, unitCode, location.locationId, null);
            let containersCount = containersInLocation.confirmedContainers + containersInLocation.allocateContainers;
            // override the current containers in the location
            location.totalFilledContainers = containersInLocation.confirmedContainers;
            //TODO: need to change
            // if (containersCount < location.totalSupportedContainers) {
                freeLocations.push(location);
            // }
        }
        return freeLocations;
    }

    // HELPER
    async getLocationWithSuggestedAndConfirmedContainers(companyCode: string, unitCode: string, locationId: number, manager: GenericTransactionManager): Promise<{ confirmedContainers: number, allocateContainers: number }> {
        let confirmedContainers = [];
        let allocateContainers = [];
        if (manager) {
            confirmedContainers = await manager.getRepository(FGContainerLocationMapEntity).find({ select: ['containerId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedLocationId: locationId, status: FgContainerLocationStatusEnum.CONFIRMED, isActive: true } });
            allocateContainers = await manager.getRepository(FGContainerLocationMapEntity).find({ select: ['containerId'], where: { companyCode: companyCode, unitCode: unitCode, suggestedLocationId: locationId, status: FgContainerLocationStatusEnum.OPEN, isActive: true } });
        } else {
            confirmedContainers = await this.containerLocationRepo.find({ select: ['containerId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedLocationId: locationId, status: FgContainerLocationStatusEnum.CONFIRMED, isActive: true } });
            allocateContainers = await this.containerLocationRepo.find({ select: ['containerId'], where: { companyCode: companyCode, unitCode: unitCode, suggestedLocationId: locationId, status: FgContainerLocationStatusEnum.OPEN, isActive: true } });
        }

        return { confirmedContainers: confirmedContainers.length, allocateContainers: allocateContainers.length };
    }

    // HELPER
    async updateContainerLocationState(companyCode: string, unitCode: string, containerIds: number[], locationState: FgCurrentContainerLocationEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        return await this.containersService.updateContainerLocationState(companyCode, unitCode, containerIds, locationState, username, transManager);
    }


    // HELPER
    // WRITER
    async updateContainerLocWorkBehState(companyCode: string, unitCode: string, containerIds: number[], locationState: FgCurrentContainerLocationEnum, behaviorStatus: FgContainerBehaviorEnum, workStatus: FgCurrentContainerStateEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        return await this.containersService.updateContainerLocWorkBehState(companyCode, unitCode, containerIds, locationState, behaviorStatus, workStatus, username, transManager);
    }

    // HELPER
    // WRITER
    async updateGrnCompleteForCartonAndPackListAutomatically(companyCode: string, unitCode: string, cartonId: number, packListId: number, username: string, transManager: GenericTransactionManager): Promise<GlobalResponseObject> {
        return
        // await this.packlistInfoService.updateGrnCompleteForCartonAndPackListAutomatically(companyCode, unitCode, cartonId, packListId, username, transManager);
    }

}