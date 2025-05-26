import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';

import { LocationMappingHelperService } from './location-mapping-helper.service';
import { LocationRelatedDataQryResp } from './repositories/query-response.ts/location-related-data.response';
import { LocationIdRequest, LocationDetailsResponse, LocationDetailsModel, PackListIdRequest, CartonFillingModel, FgWarehouseContainerCartonsModel, LocationContainerModel, CommonRequestAttrs, FgContainerLocationStatusEnum, RackLocationContainersResponse, RackLocationContainersModel, CartonInfoModel, FgLocationFilterReq } from '@xpparel/shared-models';
import { FgLocationsService } from '../__masters__/location/fg-location.services';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { ContainerLocationMapRepo } from './repositories/container-location-map.repository';
import { FgRacksService } from '../__masters__/racks/fg-racks.service';

@Injectable()
export class LocationInfoService {
    constructor(
        private containerLocationMapRepo: ContainerLocationMapRepo,
        private containerCartonMapRepo: ContainerCartonMapRepo,
        @Inject(forwardRef(() => LocationMappingHelperService)) private locAllocHelper: LocationMappingHelperService,
        @Inject(forwardRef(() => FgLocationsService)) private locationService: FgLocationsService,
        @Inject(forwardRef(() => FgRacksService)) private racksService: FgRacksService,
    ) {

    }

    // END POINT
    async getLocationInfoWithoutContainers(req: LocationIdRequest): Promise<LocationDetailsResponse> {
        // get the location info
        const locationInfo = await this.locationService.getLocationsBasicInfo(req.companyCode, req.unitCode, [req.locationId]);
        const currentLocationIno = locationInfo[0];
        const totalContainersInLocationCurrently = await this.containerLocationMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, confirmedLocationId: currentLocationIno.locationId, status: FgContainerLocationStatusEnum.CONFIRMED } });
        let emptyContainerIds: number[] = await this.getEmptyContainersInLocation(req.companyCode, req.unitCode, req.locationId);
        const location = new LocationDetailsModel(currentLocationIno.locationId, currentLocationIno.locationCode, currentLocationIno.locationBarCode, currentLocationIno.locationDesc, currentLocationIno.totalSupportedContainers, totalContainersInLocationCurrently, emptyContainerIds.length, currentLocationIno.rackId, currentLocationIno.rackCode, currentLocationIno.level, currentLocationIno.column, currentLocationIno.tcartoneyIds);
        return new LocationDetailsResponse(true, 46072, 'Location info retrieved successfully', [location]);
    }

    // HELPER
    async getEmptyContainersInLocation(companyCode: string, unitCode: string, locationId: number): Promise<number[]> {
        const emptyContainerIds: number[] = [];
        const totalContainersInLocationCurrently = await this.containerLocationMapRepo.find({ select: ['id', 'containerId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedLocationId: locationId, status: FgContainerLocationStatusEnum.CONFIRMED } });
        for (const container of totalContainersInLocationCurrently) {
            const containersInLocation = await this.containerCartonMapRepo.find({ select: ['itemLinesId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: container.containerId, status: FgContainerLocationStatusEnum.CONFIRMED, isActive: true } });
            if (containersInLocation.length == 0) {
                emptyContainerIds.push(container.containerId);
            }
        }
        return emptyContainerIds;
    }

    // END POINT
    // RETRIEVAL
    async getLocationsMappedForPackingList(req: PackListIdRequest): Promise<LocationDetailsResponse> {
        // get the location mapped to the packing list
        /**
         * First get all the container ids mapped for the packing list
         * then based on those containers get the location ids for those containers
         * now get the location info for those location ids
         */
        const confirmedContainerIdsForPackList = await this.containerCartonMapRepo.getConfirmedContainerIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const suggestedContainerIdsForPackList = await this.containerCartonMapRepo.getConfirmedContainerIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        if (confirmedContainerIdsForPackList.length == 0 && suggestedContainerIdsForPackList.length == 0) {
            throw new ErrorResponse(46073, 'No containers mapped for the packing list');
        }
        const containerIds = new Set<number>();
        confirmedContainerIdsForPackList.forEach(r => containerIds.add(r));
        suggestedContainerIdsForPackList.forEach(r => containerIds.add(r));
        const finalContainerIds = Array.from(containerIds);
        // get the location ids for the container ids
        const confirmedLocationsMappedToContainers = await this.containerLocationMapRepo.getConfirmedLocationIdsForContainerIds(req.companyCode, req.unitCode, finalContainerIds);
        const suggestedLocationsMappedToContainers = await this.containerLocationMapRepo.getSuggestedLocationIdsForContainerIds(req.companyCode, req.unitCode, finalContainerIds);
        if (confirmedLocationsMappedToContainers.length == 0 && suggestedLocationsMappedToContainers.length == 0) {
            throw new ErrorResponse(46074, 'No location mapped for the packing list');
        }
        const locationIds = new Set<number>();
        confirmedLocationsMappedToContainers.forEach(r => locationIds.add(r));
        suggestedLocationsMappedToContainers.forEach(r => locationIds.add(r));
        const finalLocationIds = Array.from(locationIds);
        const locations: LocationDetailsModel[] = [];
        const locationInfo = await this.locationService.getLocationsBasicInfo(req.companyCode, req.unitCode, finalLocationIds);
        for (const currentLocationIno of locationInfo) {
            const totalContainersInLocationCurrently = await this.containerLocationMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, confirmedLocationId: currentLocationIno.locationId, status: FgContainerLocationStatusEnum.CONFIRMED } });
            let emptyContainerIds: number[] = await this.getEmptyContainersInLocation(req.companyCode, req.unitCode, currentLocationIno.locationId)
            const location = new LocationDetailsModel(currentLocationIno.locationId, currentLocationIno.locationCode, currentLocationIno.locationBarCode, currentLocationIno.locationDesc, currentLocationIno.totalSupportedContainers, totalContainersInLocationCurrently, emptyContainerIds.length, currentLocationIno.rackId, currentLocationIno.rackCode, currentLocationIno.level, currentLocationIno.column, currentLocationIno.tcartoneyIds);
            locations.push(location);
        }
        return new LocationDetailsResponse(true, 46072, 'Location info retrieved successfully', locations);
    }

    // END POINT
    // RETRIEVAL
    async getLocationContainersWithCartons(req: LocationIdRequest): Promise<RackLocationContainersResponse> {
        // get the location info
        const locationInfo = await this.locationService.getLocationsBasicInfo(req.companyCode, req.unitCode, [req.locationId]);
        const currentLocationIno = locationInfo[0];

        const rackInfo = await this.racksService.getRacksBasicInfo(req.companyCode, req.unitCode, [currentLocationIno.rackId]);
        const currentRackInfo = rackInfo[0];

        const confirmedContainerIds = await this.containerLocationMapRepo.getConfirmedContainerIdsForLocationIds(req.companyCode, req.unitCode, [currentLocationIno.locationId]);
        const suggestedContainerIds = await this.containerLocationMapRepo.getSuggestedContainerIdsForLocationIds(req.companyCode, req.unitCode, [currentLocationIno.locationId]);
        const containerIds = new Set<number>();
        confirmedContainerIds.forEach(r => containerIds.add(r));
        suggestedContainerIds.forEach(r => containerIds.add(r));
        const finalContainerIds = Array.from(containerIds);

        // get the container info
        //TODO://
        const containerDetails: any[] = [];
        for (const containerId of finalContainerIds) {
            const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [containerId]);
            const currentContainerInfo = containersInfo[0];

            const packListIds = await this.containerCartonMapRepo.getPacklistIdsForContainerId(req.companyCode, req.unitCode, containerId);

            for (const phId of packListIds) {
                // get the cartons under the packing lists
                const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerIdAndPhId(req.companyCode, req.unitCode, containerId, phId);
                const cartonIds = new Set<number>();
                cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));

                const currCartonIds = Array.from(cartonIds);
                const cartonInfoModels: CartonInfoModel[] = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, currCartonIds, false)

                const containerPhDetail = new FgWarehouseContainerCartonsModel(null, phId, containerId, currentContainerInfo.containerCode, currentContainerInfo.containerCapacity, currentContainerInfo.uom, currentContainerInfo.maxItems, currentContainerInfo.containerCurrentLoc, currentContainerInfo.containerCureentState, currentContainerInfo.status, cartonInfoModels.length, cartonInfoModels);
                containerDetails.push(containerPhDetail);
            }
        }

        const locationDetails = new LocationContainerModel(currentLocationIno.locationId, currentLocationIno.locationCode, currentLocationIno.locationDesc, currentLocationIno.totalSupportedContainers, currentLocationIno.totalFilledContainers, 0, containerDetails);
        const rackDetails = new RackLocationContainersModel(currentRackInfo.id, currentRackInfo.code, currentRackInfo.code, currentRackInfo.levels, [locationDetails]);

        return new RackLocationContainersResponse(true, 46097,'Location containers and cartons retrieved successfully',[rackDetails]);
    }

    // END POINT
    // RETRIEVAL
    async getLocationContainersWithoutCartons(req: LocationIdRequest): Promise<RackLocationContainersResponse> {
        // get the location info
        const locationInfo = await this.locationService.getLocationsBasicInfo(req.companyCode, req.unitCode, [req.locationId]);
        const currentLocationIno = locationInfo[0];

        const rackInfo = await this.racksService.getRacksBasicInfo(req.companyCode, req.unitCode, [currentLocationIno.rackId]);
        const currentRackInfo = rackInfo[0];
        const confirmedContainerIds = await this.containerLocationMapRepo.getConfirmedContainerIdsForLocationIds(req.companyCode, req.unitCode, [currentLocationIno.locationId]);
        const suggestedContainerIds = await this.containerLocationMapRepo.getSuggestedContainerIdsForLocationIds(req.companyCode, req.unitCode, [currentLocationIno.locationId]);
        const containerIds = new Set<number>();
        confirmedContainerIds.forEach(r => containerIds.add(r));
        suggestedContainerIds.forEach(r => containerIds.add(r));
        const finalContainerIds = Array.from(containerIds);

        // get the container info
        const containerDetails: any[] = [];
        for (const containerId of finalContainerIds) {
            const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [containerId]);
            const currentContainerInfo = containersInfo[0];
            // get the total confirmed cartons for the container
            const totalCartons = await this.containerCartonMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, confirmedContainerId: currentContainerInfo.containerId, isActive: true } });
            const cartonIdForContainer = await this.locAllocHelper.getCartonIdsForContainer(req.companyCode, req.unitCode, containerId, [FgContainerLocationStatusEnum.CONFIRMED]);
            const cartonsBasicInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, cartonIdForContainer);
            const containerPhDetail = new FgWarehouseContainerCartonsModel(null, 0, containerId, currentContainerInfo.containerCode, currentContainerInfo.containerCapacity, currentContainerInfo.uom, currentContainerInfo.maxItems, currentContainerInfo.containerCurrentLoc, currentContainerInfo.containerCureentState, currentContainerInfo.status, totalCartons, []);
            containerDetails.push(containerPhDetail);
        }

        const locationDetails = new LocationContainerModel(currentLocationIno.locationId, currentLocationIno.locationCode, currentLocationIno.locationDesc, currentLocationIno.totalSupportedContainers, currentLocationIno.totalFilledContainers, 0, containerDetails);
        const rackDetails = new RackLocationContainersModel(currentRackInfo.id, currentRackInfo.code, currentRackInfo.code, currentRackInfo.levels, [locationDetails]);

        return new RackLocationContainersResponse(true, 46097,'Location containers and cartons retrieved successfully',[rackDetails]);
    }

    // END POINT
    // RETRIEVAL
    async getAllSpaceFreeLocationsInWarehouse(req: FgLocationFilterReq): Promise<LocationDetailsResponse> {
        const location = await this.locAllocHelper.getAllSpaceFreeLocationsInWarehouse(req.companyCode, req.unitCode, req.whId, req.rackId);
        return new LocationDetailsResponse(true, 96555555, 'Locations retrieved successfully', location);
    }


    // HELPER
    async getContainerIdsInLocation(locationId: number, companyCode: string, unitCode: string): Promise<number[]> {
        const containerRecs = await this.containerLocationMapRepo.find({ select: ['containerId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedLocationId: locationId, isActive: true } });
        return containerRecs.map(r => r.containerId);
    }

    async getContainersCountByLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        return await this.containerLocationMapRepo.getContainersCountByLocationIds(locationIds, companyCode, unitCode);
    }


    async getTotalAndEmptyContainerCountForLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<LocationRelatedDataQryResp[]> {
        return await this.containerLocationMapRepo.getTotalAndEmptyContainerCountForLocationIds(locationIds, companyCode, unitCode);
    }


}