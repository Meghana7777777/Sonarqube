import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, RackIdRequest, FgTotalRackRes, FgRacksAndLocationModel, FgRackFilterRequest, LocationCartonDetails, FgRackCreationModel, LocationAvailability, LocationContainerCartonInfo, LocationContainerCartonInfoResponse } from "@xpparel/shared-models";
import { DataSource } from "typeorm";

import { FgRacksService } from "../../__masters__/racks/fg-racks.service";
import { FgLocationsService } from "../../__masters__/location/fg-location.services";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class FgRackDashboardService {
    constructor(
        private dataSource: DataSource,
        private rackService: FgRacksService,
        private locationService: FgLocationsService
    ) {

    }
    async getRackAndLocationTotalData(req: CommonRequestAttrs): Promise<FgTotalRackRes> {
        const fgRackFilterReq = new FgRackFilterRequest(
            req?.companyCode,
            req?.unitCode,
            req?.username,
            req?.userId,
            undefined
          );
        const racksData = await this.rackService.getAllRacksData(fgRackFilterReq);
        let rackTotalResult: FgRacksAndLocationModel[] = [];
        for (let rack of racksData.data) {
            const reqObject = new RackIdRequest(req.username, req.unitCode, req.companyCode, req.userId, rack.id, rack.levels, rack.columns);
            const locationData = await this.locationService.getLocationsInRack(reqObject);
            const rackInformation = new FgRacksAndLocationModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, locationData.data);
            rackTotalResult.push(rackInformation);
        }
        return new FgTotalRackRes(true, 967, 'Data Retrieved Successfully', rackTotalResult)
    }

    async getRackAndLocationData(req: RackIdRequest): Promise<FgTotalRackRes> {
        const racksData = await this.rackService.getRacksBasicInfo(req.companyCode, req.unitCode, [req.rackId]);
        let rackTotalResult: FgRacksAndLocationModel[] = [];
        for (let rack of racksData) {
            const reqObject = new RackIdRequest(req.username, req.unitCode, req.companyCode, req.userId, rack.id, rack.levels, rack.columns);
            const locationData = await this.locationService.getLocationsInRack(reqObject);
            const rackInformation = new FgRacksAndLocationModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, locationData.data);
            rackTotalResult.push(rackInformation);
        }
        return new FgTotalRackRes(true, 967, 'Data Retrieved Successfully', rackTotalResult)
    }

    async getLocationsForRackLevelAndColumn(req: RackIdRequest): Promise<FgTotalRackRes> {
        const racksData = await this.rackService.getRacksBasicInfo(req.companyCode, req.unitCode, [req.rackId]);
        const rackTotalResult: FgRacksAndLocationModel[] = [];
        for (const rack of racksData) {
            const locationData = await this.locationService.getLocationsForRackLevelAndColumn(req);
            const rackInfo = new FgRacksAndLocationModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, locationData.data);
            rackTotalResult.push(rackInfo);
        }
        return new FgTotalRackRes(true, 967, 'Data Retrieved Successfully', rackTotalResult)
    }

    async getLocationInfoByRack(rackId: number, unitCode: string, companyCode: string, username: string, userId: number): Promise<LocationContainerCartonInfoResponse> {
        // Need to get the Levels for the given Rack Id
        // Need to get the Locations for the level
        // Need to get the material Info which is in that each Location
        // Need to return the Location Info

        const locationsInRacks: LocationCartonDetails[] = [];
        let warehouseCapacity = 0;
        const availableLocationLocations = [];
        console.log('racksData')
        const racksData: FgRackCreationModel[] = await this.rackService.getRacksBasicInfo(companyCode, unitCode, [rackId]);
        console.log(racksData, 'racksData')
        for (let rack of racksData) {
            const reqObject = new RackIdRequest(username, unitCode, companyCode, userId, rack.id, rack.levels, rack.columns);
            const locationData = await this.locationService.getLocationsInRack(reqObject);
            console.log(locationData, 'locationData')
            if (!locationData) {
                throw new ErrorResponse(locationData.errorCode, locationData.internalMessage);
            }
            const rackInformation = new FgRacksAndLocationModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, locationData.data);
            warehouseCapacity += rackInformation.locationData.length;
            const locationIds = rackInformation.locationData.map(location => location.locationId);
            console.log(locationIds,'locationIds')
            const palletInfoForRack = await this.locationService.getTotalAndEmptyContainerCountForLocationIds(locationIds, companyCode, unitCode);
            console.log(palletInfoForRack,'palletInfoForRack')
            console.log(rackInformation,'rackInformation')
            for (const locationInfo of rackInformation.locationData) {
                const result = palletInfoForRack.find(location => location.id == locationInfo.locationId);
                let materialAllocatedForProduction = false;
                let fabricReqDate = null;
                if (result) {
                    if (Number(result.empty_containers) > 0) {
                        availableLocationLocations.push(locationInfo.locationCode)
                    }
                    if ((Number(result.total_allocatedQty_open) + Number(result.total_allocatedQty_inprogress) + Number(result.total_allocatedQty_completed)) > 0) {
                        const rollIds = result.carton_ids.split(',').map(roll => Number(roll));
                        materialAllocatedForProduction = true;
                        fabricReqDate = null;
                        // await this.whReqInfoService.getLatestFabricRequestedDateByRollIds(rollIds, unitCode, companyCode);
                        // if (!fabricReqDate) {
                        //     fabricReqDate = null;
                        // }
                    }
                    const locationDetails = new LocationCartonDetails(
                        result.id.toString(),  // Convert id to string for locationID
                        '',                    // You might need to fetch or provide locationEnteredDate from somewhere
                        result.no_of_cartons_in_location || 0,  // Rolls in location
                        Number(result.no_of_bails_in_location), //  get bails in the BIN
                        `${(((Number(result.total_containers) - Number(result.empty_containers)) / Number(result.total_containers)) * 100).toFixed(2)}%`, // Calculate location occupancy
                        rack.barcodeId.toString(),                    // Provide locationRackID as needed
                        locationInfo.locationCode,                    // Provide locationLocation as needed
                        result.itemCodes ? result.itemCodes.split(',') : [], // Convert comma-separated item codes to an array
                        result.inspectionStatuses || '', // Ensure this is included in your query
                        Number(result.total_sQuantity_open) + Number(result.total_sQuantity_inprogress) + Number(result.total_sQuantity_completed) || 0, // Total meterage of fabric stock
                        Number(result.total_allocatedQty_open) + Number(result.total_allocatedQty_inprogress) + Number(result.total_allocatedQty_completed) || 0, // Allocated meterage
                        (Number(result.total_sQuantity_open) + Number(result.total_sQuantity_inprogress) + Number(result.total_sQuantity_completed)) -
                        (Number(result.total_allocatedQty_open) + Number(result.total_allocatedQty_inprogress) + Number(result.total_allocatedQty_completed)) || 0, // Non-allocated meterage
                        '', // Provide materialAgeAfterInspection as needed
                        materialAllocatedForProduction, // Set materialAllocatedForProduction based on your logic
                        fabricReqDate, // Provide materialProductionAllocatedDate as needed
                        Number(result.total_sQuantity_completed), // Provide relaxedFabricMeterageStock as needed
                        ((Number(result.total_sQuantity_completed) / (Number(result.total_sQuantity_open) + Number(result.total_sQuantity_inprogress) + Number(result.total_sQuantity_completed))) * 100).toString(), // Provide relaxedFabricPercentage as needed
                        result.empty_containers || 0 // Empty pallets in location
                    );
                    locationsInRacks.push(locationDetails);
                } else {
                    availableLocationLocations.push(locationInfo.locationCode);
                    const locationDetails = new LocationCartonDetails(
                        locationInfo.locationId.toString(),  // Convert id to string for locationID
                        '',                    // You might need to fetch or provide locationEnteredDate from somewhere
                        0,  // Rolls in location
                        0, // TODO : get bails in the BIN
                        `0%`, // Calculate location occupancy
                        rack.barcodeId.toString(),                    // Provide locationRackID as needed
                        locationInfo.locationCode,                    // Provide locationLocation as needed
                        [], // Convert comma-separated item codes to an array
                        '', // Ensure this is included in your query
                        0, // Total meterage of fabric stock
                        0, // Allocated meterage

                        0, // Non-allocated meterage
                        '', // Provide materialAgeAfterInspection as needed
                        materialAllocatedForProduction, // Set materialAllocatedForProduction based on your logic
                        fabricReqDate, // Provide materialProductionAllocatedDate as needed
                        0, // Provide relaxedFabricMeterageStock as needed
                        `0`, // Provide relaxedFabricPercentage as needed
                        0 // Empty pallets in location
                    );
                    locationsInRacks.push(locationDetails);
                }
            }
        }
        let locationsAvailability = new LocationAvailability(availableLocationLocations, availableLocationLocations.length);
        const locationInfo = new LocationContainerCartonInfo(locationsInRacks.length, locationsAvailability, locationsInRacks)
        return new LocationContainerCartonInfoResponse(true, 36091, 'Location Carton Info retrieved Successfully', locationInfo)

    }
}