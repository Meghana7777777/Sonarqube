import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { SRequestItemRepository } from "./repository/s-request-item-repository";
import { SRequestItemTruckMapRepository } from "./repository/s-request-item-truck-map.repository";
import { SRequestTruckRepository } from "./repository/s-request-truck-repository";
import { GlobalResponseObject, PkShippingRequestIdRequest, PkShippingRequestItemLevelEnum, PkTruckItemsMapRequest, ShippingRequestIdRequest, PkSrFinalItemsResponse, PkTruckItemsResponse, PkSrFinalItemsModel, PkDSetSubItemsModel, PkDSetSubItemAttrEnum, PkTruckItemsModel, PkShippingRequestTruckIdRequest, PkTruckLoadingStatusEnum } from "@xpparel/shared-models";
import { PkShippingRequestHelperService } from "./pk-shipping-request-helper.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { DSetSubItemEntity } from "../dispatch-set/entity/d-set-sub-item.entity";
import { PkDispatchSetInfoService } from "../dispatch-set/pk-dispatch-set-info.service";

@Injectable()
export class PkTruckItemsService {
  constructor(
    private dataSource: DataSource,
    private sRequestItemRepository: SRequestItemRepository,
    private sRequestItemTruckMapRepository: SRequestItemTruckMapRepository,
    private sRequestTruckRepository: SRequestTruckRepository,
    private helperService: PkShippingRequestHelperService,
    private dispatchInfoservice: PkDispatchSetInfoService
  ) {

  }

  // END POINT // 
  async mapDSetSubItemsToTruck(req: PkTruckItemsMapRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, username, userId } = req;
      // Check if the Shipping Request ID exists
      const shippingRequest = await this.sRequestItemRepository.findOne({ where: { id: req.srId, companyCode, unitCode } });

      if (!shippingRequest) {
        throw new Error(`Shipping Request ID ${req.srId} does not exist.`);
      }

      // Check if the truck exists
      const truck = await this.sRequestTruckRepository.findOne({ where: { id: req.truckId, companyCode, unitCode } });

      if (!truck) {
        throw new Error(`Truck with ID ${req.truckId} does not exist.`);
      }

      // Fetch all valid barcodes for this Shipping Request
      const barcodeResponse = await this.getDSetSubItemsForSrId({
        srIds: [req.srId], companyCode, unitCode, remarks: "", iNeedVendorInfoAlso: true, iNeedTruckInfoAlso: true,
        iNeedSrItemsAlso: true, iNeedSrItemsAttrAlso: true, username, userId
      });

      if (!barcodeResponse || !barcodeResponse.data) {
        throw new Error("Failed to fetch barcode data.");
      }

      const validBarcodes = new Set(barcodeResponse.data.flatMap(item => item.dSetSubItems.map(subItem => subItem.barcode)));

      // Check if all requested barcodes exist in the valid list
      const invalidBarcodes = req.cartonsBarcodes.filter(barcode => !validBarcodes.has(barcode));

      if (invalidBarcodes.length > 0) {
        throw new Error(`Invalid cartons: ${invalidBarcodes.join(", ")}`);
      }

      // Check if the cartons are already mapped
      const existingMappings = await this.sRequestItemTruckMapRepository.find({ where: { refNo: In(req.cartonsBarcodes) } });

      if (existingMappings.length > 0) {
        throw new Error(`Some cartons are already mapped to another truck: ${existingMappings.map(e => e.refNo).join(", ")}`);
      }

      await transManager.startTransaction();

      // Save the data in s_request_item_truck_map
      const truckMappings = req.cartonsBarcodes.map((barcode, index) =>
        this.sRequestItemTruckMapRepository.create({
          sRequestTruckId: req.truckId,
          srId: req.srId,
          itemLevel: PkShippingRequestItemLevelEnum.SUB_ITEM,
          refNo: barcode,
          truckNo: req.truckNo,
          companyCode: req.companyCode,
          unitCode: req.unitCode,
          refId: Number(req.cartoonIds[index] || req.cartoonIds[0]),
          createdUser: req.username
        })
      );
      await this.sRequestItemTruckMapRepository.save(truckMappings);
      await transManager.completeTransaction();

      return new GlobalResponseObject(true, 0, "Cartons successfully mapped to truck.");
    } catch (err) {
      await transManager.releaseTransaction();
      return new GlobalResponseObject(false, 500, err.message);
    }
  }

  async unMapDSetSubItemsToTruck(req: PkTruckItemsMapRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();

      //  Validate input
      if (!req.cartonsBarcodes.length) {
        throw new Error("No cartons provided for unmapping.");
      }

      // Check if mappings exist
      const existingMappings = await this.sRequestItemTruckMapRepository.find({ where: { refNo: In(req.cartonsBarcodes), sRequestTruckId: req.truckId } });

      if (existingMappings.length === 0) {
        throw new Error("No valid mappings found for the provided cartons.");
      }

      // Delete mappings
      await this.sRequestItemTruckMapRepository.delete({ refNo: In(req.cartonsBarcodes), sRequestTruckId: req.truckId });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, "Cartons successfully unmapped from truck.");
    } catch (err) {
      return new GlobalResponseObject(false, 500, err.message || "An error occurred.");
    } finally {
      await transManager.releaseTransaction(); // Release resources
    }
  }

  async getTruckMappedItemsForSrId(req: ShippingRequestIdRequest): Promise<PkTruckItemsResponse> {
    try {
      const { companyCode, unitCode, srIds } = req;
      //  Get all trucks for the given shipping request IDs
      const trucks = await this.sRequestTruckRepository.find({ where: { sRequestId: In(srIds), companyCode, unitCode } });

      if (!trucks.length) {
        return new PkTruckItemsResponse(true, 0, "No trucks found for the given Shipping Request IDs.", []);
      }

      const truckData: PkTruckItemsModel[] = [];

      for (const truck of trucks) {
        // Get all barcodes & carton IDs mapped to this truck using truckNo
        const truckMappings = await this.sRequestItemTruckMapRepository.find({ where: { truckNo: truck.truckNo }, select: ["refNo"] });

        if (!truckMappings.length) {
          continue;
        }
        const barcodes = truckMappings.map(mapping => mapping.refNo);
        if (barcodes.length === 0) {
          continue;
        }

        // Fetch carton info for mapped barcodes
        const cartonsInfo = await this.dispatchInfoservice.getSubItemRefIdsForRefBarcodes(barcodes, companyCode, unitCode);
        const items = cartonsInfo?.map(carton =>
          new PkDSetSubItemsModel(carton.id, String(carton.cartonId), carton.barcode, carton.qty, null));
        // Construct the truck response object
        truckData.push(new PkTruckItemsModel(truck.id, truck.truckNo, truck.driverName, truck.contact, items.length, items));
      }
      return new PkTruckItemsResponse(true, 0, "Successfully fetched truck-mapped items.", truckData);
    } catch (err) {
      console.error("Error in getTruckMappedItemsForSrId:", err);
      return new PkTruckItemsResponse(false, 500, err.message || "An error occurred while fetching truck-mapped items.");
    }
  }

  async getDSetSubItemsForSrId(req: PkShippingRequestIdRequest): Promise<PkSrFinalItemsResponse> {
    try {
      const { srIds, companyCode, unitCode } = req;
      // Fetch ref_id values for given srIds from s_request_item table
      const refIds = await this.sRequestItemRepository.find({ where: { sRequestId: In(srIds) }, select: ['refId'] });
      // Extract refId values from query result
      const dSetIds = refIds.map(item => item.refId);

      if (dSetIds.length === 0) {
        return new PkSrFinalItemsResponse(true, 200, "No DSet IDs found for given Shipping Request IDs", []);
      }

      // Fetch DSet Sub Items using the retrieved refId values
      const dSetSubItems: DSetSubItemEntity[] = await this.helperService.getDSetSubItemsByDSetId(dSetIds, companyCode, unitCode);
      // Transform DSetSubItemEntity[] to PkDSetSubItemsModel[]
      const transformedDSetSubItems: PkDSetSubItemsModel[] = dSetSubItems.map(item => ({
        id: item.id,
        ctnNo: item.deRefId,
        barcode: item.barcode,
        qty: item.itemQuantity,
        dispatchEntity: item.dispatchEntity,
        dSetSubItemAttr: {} as { [k in PkDSetSubItemAttrEnum]: string }
      }));

      // Construct the response
      const finalItems = new PkSrFinalItemsModel(transformedDSetSubItems, null);
      return new PkSrFinalItemsResponse(true, 200, "Success", [finalItems]);
    } catch (error) {
      console.error("Error in getDSetSubItemsForSrId:", error);
      return new PkSrFinalItemsResponse(false, 500, "Internal Server Error");
    }
  }

  async updateTruckLoadingComplete(req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
    try {
      // Fetch trucks that match the given IDs and shipping request ID
      const trucks = await this.sRequestTruckRepository.find({ where: { sRequestId: req.sRequestId, id: In(req.truckIds), loadingStatus: PkTruckLoadingStatusEnum.LOADING_PROGRESS } });

      if (trucks.length === 0) {
        return new GlobalResponseObject(false, 404, "No trucks found with loading status 1");
      }

      // Update trucks to mark loading as completed
      await this.sRequestTruckRepository.update({ sRequestId: req.sRequestId, id: In(req.truckIds) },
        { loadingStatus: PkTruckLoadingStatusEnum.LOADING_COMPLETE, loadEndAt: new Date().toISOString(), unitCode: req.unitCode, companyCode: req.companyCode }
      );

      return new GlobalResponseObject(true, 200, "Truck loading completed successfully");
    } catch (error) {
      return new GlobalResponseObject(false, 500, "Internal Server Error: " + error.message);
    }
  }

  async updateTruckLoadingProgress(req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
    try {
      // Fetch trucks that match the given IDs and shipping request ID
      const trucks = await this.sRequestTruckRepository.find({ where: { sRequestId: req.sRequestId, id: In(req.truckIds), loadingStatus: PkTruckLoadingStatusEnum.OPEN }, });

      if (trucks.length === 0) {
        return new GlobalResponseObject(false, 404, "No trucks found with loading status 0");
      }

      // Update trucks to mark loading as in progress
      await this.sRequestTruckRepository.update(
        { sRequestId: req.sRequestId, id: In(req.truckIds) },
        { loadingStatus: PkTruckLoadingStatusEnum.LOADING_PROGRESS, loadStartAt: new Date().toISOString(), unitCode: req.unitCode, companyCode: req.companyCode }
      );

      return new GlobalResponseObject(true, 200, "Truck loading started successfully");
    } catch (error) {
      return new GlobalResponseObject(false, 500, "Internal Server Error: " + error.message);
    }
  }
}




