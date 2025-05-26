import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CartonBasicInfoModel, CartonFillingModel, CartonIdsRequest, CartonInfoModel, CommonRequestAttrs, ContainerAndLocationModel, ContainerAndLocationResponse, ContainerCartonsModel, ContainerCartonsResponse, ContainerIdRequest, FgContainerDetailsResponse, FgContainerFilterRequest, FgContainerLocationStatusEnum, FgContainersDetailsModel, FgWarehouseContainerCartonsModel, FgWarehouseContainerCartonsResponse, InspectionContainerCartonsModel, InspectionContainerCartonsResponse, InspectionContainerGroupedCartonsModel, InsInspectionLevelEnum, LocationDetailsModel, PackListContainerCfNcfPendingCartonsModel, PackListContainerCfNcfPfendingCartonsResponse, PackListIdRequest } from '@xpparel/shared-models';
import { In } from 'typeorm';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { ContainerLocationMapRepo } from './repositories/container-location-map.repository';
import { ContainerAndLocationCodeQueryResponse } from './repositories/query-response.ts/container-and-location-data.query.response';
import { InspectionLevelEnum } from 'packages/libs/shared-models/src/wms/enum/inspection-level.enum';


@Injectable()
export class ContainerInfoService {
    constructor(
        private containerLocationMapRepo: ContainerLocationMapRepo,
        private containerCartonMapRepo: ContainerCartonMapRepo,
        @Inject(forwardRef(() => LocationMappingHelperService))
        private locAllocHelper: LocationMappingHelperService,
    ) {

    }

    async getContainerInfoAndItsCartonIds(companyCode: string, unitCode: string, containerId: number, needLocationsInfo: boolean): Promise<FgContainersDetailsModel> {
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(companyCode, unitCode, [containerId]);
        const currContainerInfo = containersInfo[0];
        if (!currContainerInfo) {
            throw new ErrorResponse(46055, 'Container does not exist');
        }
        // get the total allocated cartons and the confirmed cartons in the container
        const confirmedCartonsForContainer = await this.containerCartonMapRepo.find({
            select: ['suggestedContainerId', 'confirmedContainerId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: containerId, isActive: true, status: In([FgContainerLocationStatusEnum.CONFIRMED]) }
        });
        const allocatedCartonsForContainer = await this.containerCartonMapRepo.find({
            select: ['suggestedContainerId', 'confirmedContainerId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: containerId, isActive: true, status: In([FgContainerLocationStatusEnum.OPEN]) }
        });

        const locationInfo = needLocationsInfo ? await this.getSuggestedAndConfirmedInfoForContainerId(companyCode, unitCode, containerId) : { s: null, c: null };
        const containerDetails = new FgContainersDetailsModel('', unitCode, companyCode, 0, currContainerInfo.barcode, containerId, currContainerInfo.containerCode, currContainerInfo.containerCapacity, currContainerInfo.uom, currContainerInfo.maxItems, currContainerInfo.status, currContainerInfo.containerCurrentLoc, currContainerInfo.containerCureentState, confirmedCartonsForContainer.length, currContainerInfo.confirmedQty, allocatedCartonsForContainer.length, currContainerInfo.allocatedQty, locationInfo.s, locationInfo.s);
        return containerDetails;
    }

    // END POINT
    // RETRIEVAL
    async getContainerMappingInfoWithoutCartons(req: ContainerIdRequest): Promise<FgContainerDetailsResponse> {
        // get the container header info
        const containersDetails: FgContainersDetailsModel[] = [];
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [req.containerId]);
        const containerConsumedQtyInfo = await this.getContainerConsumedQty(req.companyCode, req.unitCode, req.containerId, [FgContainerLocationStatusEnum.CONFIRMED, FgContainerLocationStatusEnum.OPEN]);
        const currentContainerInfo = containersInfo[0];
        const locationInfo = await this.getSuggestedAndConfirmedInfoForContainerId(req.companyCode, req.unitCode, currentContainerInfo.containerId);
        const containerDetails = new FgContainersDetailsModel(req.username, req.unitCode, req.companyCode, req.userId, currentContainerInfo.barcode, req.containerId, currentContainerInfo.containerCode, currentContainerInfo.containerCapacity, currentContainerInfo.uom, currentContainerInfo.maxItems, currentContainerInfo.status, currentContainerInfo.containerCurrentLoc, currentContainerInfo.containerCureentState, containerConsumedQtyInfo.confirmedCartons, containerConsumedQtyInfo.confirmedQty, containerConsumedQtyInfo.allocatedCartons, containerConsumedQtyInfo.allocatedQty, locationInfo.s, locationInfo.c);
        containersDetails.push(containerDetails);
        return new FgContainerDetailsResponse(true,46091,'Container info retrieved successfully',containersDetails);
    }


    async getSuggestedAndConfirmedInfoForContainerId(companyCode: string, unitCode: string, containerId: number): Promise<{ s: LocationDetailsModel, c: LocationDetailsModel }> {
        const rec = await this.containerLocationMapRepo.findOne({ select: ['confirmedLocationId', 'suggestedLocationId', 'status'], where: { companyCode: companyCode, unitCode: unitCode, containerId: containerId, isActive: true } });
        if (!rec) {
            return { s: null, c: null };
        }
        const suggestedLocationId = rec.suggestedLocationId;
        const confirmedLocationId = rec.confirmedLocationId;
        // if the container is not confirmed to any location, then only get the suggested location info
        if (rec.status == FgContainerLocationStatusEnum.OPEN) {
            const locationInfo = await this.locAllocHelper.getBasicInfoForLocationIds(companyCode, unitCode, [suggestedLocationId]);
            return { s: locationInfo[0], c: null };
        } else {
            const locationInfo = await this.locAllocHelper.getBasicInfoForLocationIds(companyCode, unitCode, [suggestedLocationId, confirmedLocationId]);
            const sLocationInfo = locationInfo.filter(r => r.locationId == suggestedLocationId);
            const cLocationInfo = locationInfo.filter(r => r.locationId == confirmedLocationId);

            return { s: sLocationInfo[0], c: cLocationInfo[0] };
        }
    }

    // HELPER 
    // getting the confirmed, allocated cartons for a given container id
    async getContainerConsumedQty(companyCode: string, unitCode: string, containerId: number, cartonMapStatus: FgContainerLocationStatusEnum[]): Promise<{ allocatedCartons: number, allocatedQty: number, confirmedCartons: number, confirmedQty: number }> {
        const allocatedCartonsForContainer = await this.containerCartonMapRepo.find({
            select: ['suggestedContainerId', 'confirmedContainerId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedContainerId: containerId, isActive: true, status: In(cartonMapStatus) }
        });
        // all the cartons in the container
        const allocatedCartonIds = allocatedCartonsForContainer.map(r => r.itemLinesId);

        // get the carton quantities for the cartons
        const cartonsBasicInfo: CartonBasicInfoModel[] = await this.locAllocHelper.getBasicInfoForCartonIds(companyCode, unitCode, allocatedCartonIds);
        const cartonInfoMap: Map<number, CartonBasicInfoModel> = await this.locAllocHelper.getCartonIdsInfoMap(cartonsBasicInfo);
        // just a cross check that all the cartons are a part of the items table
        // calculate the conumed qty of the container
        let allocatedCartons = 0;
        let allocatedQty = 0;
        let confirmedCartons = 0;
        let confirmedQty = 0;
        allocatedCartonsForContainer.forEach(rec => {
            const cartonId = rec.itemLinesId;
            const cartonLeftOverQty = cartonInfoMap.get(cartonId)?.leftOverQuantity;
            if (cartonLeftOverQty > 0) {
                // seggregate the confirmed cartons and confirmed qty
                if (rec.status == FgContainerLocationStatusEnum.OPEN) {
                    allocatedQty += Number(cartonLeftOverQty);
                    allocatedCartons += 1;

                    // seggregate the allocated cartons and allocated qty
                } else if (rec.status == FgContainerLocationStatusEnum.CONFIRMED) {
                    confirmedQty += Number(cartonLeftOverQty);
                    confirmedCartons += 1;
                }
            }
        });
        return { allocatedCartons: allocatedCartons, allocatedQty: allocatedQty, confirmedCartons: confirmedCartons, confirmedQty: confirmedQty };
    }

    // END POINT
    // RETRIEVAL
    // get the containers mapped for a given packing list
    async getContainersMappedForPackingList(req: PackListIdRequest): Promise<FgContainerDetailsResponse> {
        const confirmedContainerIdsForPackList = await this.containerCartonMapRepo.getConfirmedContainerIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const suggestedContainerIdsForPackList = await this.containerCartonMapRepo.getSuggestedContainerIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        if (confirmedContainerIdsForPackList.length == 0 && suggestedContainerIdsForPackList.length == 0) {
            throw new ErrorResponse(46056, 'No containers mapped for the packing list');
        }
        const containerIds = new Set<number>();
        confirmedContainerIdsForPackList.forEach(r => containerIds.add(r));
        suggestedContainerIdsForPackList.forEach(r => containerIds.add(r));
        const finalContainerIds = Array.from(containerIds);
        // get all the container basic info
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, finalContainerIds);
        const containersDetails: FgContainersDetailsModel[] = [];
        for (const container of containersInfo) {

            const locationInfo = await this.getSuggestedAndConfirmedInfoForContainerId(req.companyCode, req.unitCode, container.containerId);

            const totalCartonsInContainer = await this.locAllocHelper.getCartonIdsForContainer(req.companyCode, req.unitCode, container.containerId, [FgContainerLocationStatusEnum.CONFIRMED]);
            const containerDetails = new FgContainersDetailsModel(req.username, req.unitCode, req.companyCode, req.userId, container.barcode, container.containerId, container.containerCode, container.containerCapacity, container.uom, container.maxItems, container.status, container.containerCurrentLoc, container.containerCureentState, totalCartonsInContainer?.length, 0, 0, 0, locationInfo.s, locationInfo.c);
            containersDetails.push(containerDetails);
        }
        return new FgContainerDetailsResponse(true,46091,'Container info retrieved successfully',containersDetails);
    }

    // END POINT
    // RETRIEVAL
    async getInspectionContainerMappingInfoWithCartons(req: ContainerIdRequest): Promise<InspectionContainerCartonsResponse> {
        // get the container header info
        const containerDetails: InspectionContainerCartonsModel[] = [];

        const packListIds = await this.containerCartonMapRepo.getPacklistIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
        if (packListIds.length == 0) {
            throw new ErrorResponse(46092,'No cartons mapped to the container');
        }
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [req.containerId]);
        const currentContainerInfo = containersInfo[0];

        // for(const phId of packListIds) {
        // get the cartons under the packing lists
        const insWiseCartonsDetails: InspectionContainerGroupedCartonsModel[] = [];

        // const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerIdAndPhId(req.companyCode, req.unitCode, req.containerId, phId);
        const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
        const cartonIds = new Set<number>();
        cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));
        // seggregate the cartons based on the inpsection category .i.e BATCH / LOT / ROLL
        const seggregatedCartons = await this.seggregateCartonsBasedOnInspectionType(req.companyCode, req.unitCode, Array.from(cartonIds));

        for (const [cartonType, addDetail] of seggregatedCartons) {
            const currCartonIds = addDetail.cartonIds;
            const cartonInfoModels: CartonInfoModel[] = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, currCartonIds, true)
            // get the cartons info for all the cartons
            // const insTypeCartonsModel = new InspectionContainerGroupedCartonsModel(cartonType, addDetail.objDesc, addDetail.objNumber, cartonInfoModels);
            // insWiseCartonsDetails.push(insTypeCartonsModel);
        }
        const containerPhDetail = new InspectionContainerCartonsModel(0, currentContainerInfo.containerId, currentContainerInfo.containerCode, currentContainerInfo.containerCapacity, currentContainerInfo.uom, currentContainerInfo.maxItems,
            //TODO://
            // currentContainerInfo.containerCurrentLoc,
            undefined,
            undefined,
            // currentContainerInfo.containerCureentState, 
            insWiseCartonsDetails);
        containerDetails.push(containerPhDetail);
        // }
        return new InspectionContainerCartonsResponse(true,46092,'Container info retrieved successfully',containerDetails);
    }

    // HELPER
    async seggregateCartonsBasedOnInspectionType(companyCode: string, unitCode: string, cartonIds: number[]): Promise<Map<InsInspectionLevelEnum, { cartonIds: number[], objNumber: string, objDesc: string }>> {
        const inspectionLevelCartonsMap = new Map<InsInspectionLevelEnum, { cartonIds: number[], objNumber: string, objDesc: string }>();
        inspectionLevelCartonsMap.set(InsInspectionLevelEnum.PACKING_LIST, { cartonIds: cartonIds, objDesc: 'Packlist', objNumber: '1' })
        return inspectionLevelCartonsMap
    }

    // END POINT
    // RETRIEVAL
    async getWarehouseContainerMappingInfoWithCartons(req: ContainerIdRequest): Promise<FgWarehouseContainerCartonsResponse> {
        // get the container header info
        const containerDetails: FgWarehouseContainerCartonsModel[] = [];

        const packListIds = await this.containerCartonMapRepo.getPacklistIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
        if (packListIds.length == 0) {
            throw new ErrorResponse(46091,'No cartons mapped to the container');
        }
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [req.containerId]);
        const currentContainerInfo = containersInfo[0];

        // for(const phId of packListIds) {
        // get the cartons under the packing lists
        // const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerIdAndPhId(req.companyCode, req.unitCode, req.containerId, phId);
        const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
        const cartonIds = new Set<number>();
        cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));

        const currCartonIds = Array.from(cartonIds);
        let cartonInfoModels: CartonInfoModel[] = [];
        if (currCartonIds.length > 0) {
            cartonInfoModels = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, currCartonIds, false)
        }
        const containerPhDetail = new FgWarehouseContainerCartonsModel(null, 0, currentContainerInfo.containerId, currentContainerInfo.containerCode, currentContainerInfo.containerCapacity, currentContainerInfo.uom, currentContainerInfo.maxItems, currentContainerInfo.containerCurrentLoc, currentContainerInfo.containerCureentState, currentContainerInfo.status, cartonInfoModels.length, cartonInfoModels);
        containerDetails.push(containerPhDetail);
        // }
        return new FgWarehouseContainerCartonsResponse(true,46091,'Container info retrieved successfully',containerDetails);
    }

    // END POINT
    // RETRIEVAL
    async getAllSpaceFreeContainersInWarehouse(req: FgContainerFilterRequest): Promise<FgContainerDetailsResponse> {
        const containerDetails = await this.locAllocHelper.getAllSpaceFreeContainersInWarehouse(req.companyCode, req.unitCode,req.whId,req.rackId,req.locationId);
        return new FgContainerDetailsResponse(true,46091,'Container info retrieved successfully',containerDetails);
    }

    // END POINT
    // RETRIEVAL
    async getAllPendingToContainerConfirmationCartonsInPackingList(req: PackListIdRequest): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
        const insCartonsInPackList = await this.locAllocHelper.getInspectionCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const whCartonsInPackList = await this.locAllocHelper.getWarehouseCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const packListCartonIds: number[] = [];
        insCartonsInPackList.forEach(r => packListCartonIds.push(r));
        whCartonsInPackList.forEach(r => packListCartonIds.push(r));
        // get all the carton ids to which the container is already confirmed
        const confirmedCartons = await this.containerCartonMapRepo.getConfirmedCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId, null);
        const diffCartons = [];
        packListCartonIds.forEach(r => {
            if (!confirmedCartons.includes(r)) {
                diffCartons.push(r);
            }
        });
        // get all the pending cartons info
        const cartonsInfo = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, diffCartons, false);
        //TODO://
        const packListCartonsModel = new PackListContainerCfNcfPendingCartonsModel(req.packListId, null, [], []);
        return new PackListContainerCfNcfPfendingCartonsResponse(true, 46093, 'Cartons for packing list retrieved', [packListCartonsModel]);
    }z

    // END POINT
    // RETRIEVAL
    async getAllContainerConfirmationCartonsInPackingList(req: PackListIdRequest): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
        // get all the carton ids to which the container is already confirmed
        const confirmedCartons = await this.containerCartonMapRepo.getConfirmedCartonIdsForPackList(req.companyCode, req.unitCode, req.packListId, null);
        // get all the pending cartons info
        const cartonsInfo = await this.locAllocHelper.getCartonInfoForCartonIds(req.companyCode, req.unitCode, confirmedCartons, false);
        //TODO://
        const packListCartonsModel = new PackListContainerCfNcfPendingCartonsModel(req.packListId, null, [], []);
        return new PackListContainerCfNcfPfendingCartonsResponse(true, 46093, 'Cartons for packing list retrieved', [packListCartonsModel]);
    }


    async getAllOccupiedContainersInWarehouse(req: CommonRequestAttrs): Promise<FgContainerDetailsResponse> {
        return null;
    }

    /**
    * Gets the cartons and its badic info mapped for the container. Any container.
    * RETRIEVER
    * @param req 
    * @returns 
    */
    async getContainerMappingInfoWithCartons(req: ContainerIdRequest): Promise<ContainerCartonsResponse> {
        // get the container basic info 
        const containersInfo = await this.locAllocHelper.getBasicInfoForContainerIds(req.companyCode, req.unitCode, [req.containerId]);
        const currentContainerInfo = containersInfo[0];
        // get all the cartons in the container
        const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
        const cartonIds = new Set<number>();
        cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));
        const currCartonIds = Array.from(cartonIds);
        let cartonInfoModels: CartonBasicInfoModel[] = [];
        if (currCartonIds.length > 0) {
            cartonInfoModels = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, currCartonIds)
        } else {
            throw new ErrorResponse(46057, 'There are no cartons mapped to this container');
        }
        const containerCartons = new ContainerCartonsModel(currentContainerInfo.containerId, currentContainerInfo.containerCode, cartonInfoModels);
        return new ContainerCartonsResponse(true, 46058, 'Cartons for container retrieved', [containerCartons]);
    }

    /**
     * Gets the cartons and its badic info mapped for the container. Any container.
     * RETRIEVER
     * @param req 
     * @returns 
     */
    async getContainerAndLocationByCartonIdData(req: CartonIdsRequest): Promise<ContainerAndLocationResponse> {
        const containersInfo: ContainerAndLocationCodeQueryResponse[] = await this.containerCartonMapRepo.getContainerAndLocationCodeforCartonsIds(req.companyCode, req.unitCode, (req.cartonIds));
        const containerAndLocationResult: ContainerAndLocationModel[] = [];
        if (containersInfo.length == 0) {
            throw new ErrorResponse(46059, 'Container and Location information not found');
        }
        for (const cartonInfo of containersInfo) {
            const containerAndLocationInfo = new ContainerAndLocationModel();
            containerAndLocationInfo.cartonId = cartonInfo.item_lines_id;
            containerAndLocationInfo.containerId = cartonInfo.container_id;
            containerAndLocationInfo.containerName = cartonInfo.container_name;
            containerAndLocationInfo.containerCode = cartonInfo.container_code;
            containerAndLocationInfo.containerBarcode = cartonInfo.container_barcode;
            containerAndLocationInfo.locationId = cartonInfo.location_id;
            containerAndLocationInfo.locationCode = cartonInfo.location_code;
            containerAndLocationInfo.locationName = cartonInfo.location_name;
            containerAndLocationInfo.locationBarcode = cartonInfo.location_barcode;
            containerAndLocationResult.push(containerAndLocationInfo);
        }
        return new ContainerAndLocationResponse(true, 46060, 'Tray and tcartonesys rretrieved successfully', containerAndLocationResult);

    }



}