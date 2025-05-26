import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { ContainerSubItemReadinessEnum, DSetSubItemContainerMappingRequest, GlobalResponseObject } from "@xpparel/shared-models";
import { DSetItemRepository } from "../dispatch-set/repository/d-set-item-repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DSetSubItemRepository } from "../dispatch-set/repository/d-set-sub-item-repository";
import { DSetContainerRepository } from "./repository/d-set-container-repository";
import { DSetSubItemContainerMapRepository } from "./repository/d-set-sub-item-container-map.repository";
import { DSetSubItemContainerMapEntity } from "./entity/d-set-sub-item-container-map.entity";
import { DSetSubItemEntity } from "../dispatch-set/entity/d-set-sub-item.entity";
import { DSetContainerEntity } from "./entity/d-set-container.entity";

// TODO
// REMOVE the dset sub item repository from here
@Injectable()
export class DispatchReadyService {
  constructor(
    private dataSource: DataSource,
    private dSetSubItemRepository: DSetSubItemRepository,
    private dSetContainerRepository: DSetContainerRepository,
    private dSetSubItemContainerMapRepository: DSetSubItemContainerMapRepository,
  ) {

  }


  async putDSetSubItemInTheContainer(req: DSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);

    /**
     * check if sub items are existed
     * check if containers are existed
     * check if subitems are assigned to containers and those containers are in our provided containers
     * check if all sub items existed in mapper
     * check all containers and subitems are mapped
     * if mapped check if it is override 
     * and then change the active status to false(inActive)
     * and enter a new record
     * if no subitems in mapper then add sub item to containers and then save then record
     */
    try {
      if (!req?.subItemBarcode?.length) {
        throw new ErrorResponse(0, "Barcode's not provided");
      }
      if (!req.containerId) {
        throw new ErrorResponse(0, "Container barcode not provided");
      }
      const { companyCode, unitCode, username } = req;
      // filter all duplicate barcodes
      const barcodeArr = [...new Set(req.subItemBarcode)];
      // const uniqueBarcodes = new Set<string>();
      // req.subItemBarcode.forEach(r => {
      //   uniqueBarcodes.add(r);
      // });
      // const barcodeArr = Array.from(uniqueBarcodes);
      await transManager.startTransaction();
      // validation - 1
      // check if the incoming barcodes exist
      // TODO : Put this in the Dispatch-set services
      const dSetSubItemRecs = await this.dSetSubItemRepository.find({ select: ['id', 'dSetItemId', 'barcode'], where: { barcode: In(barcodeArr), companyCode: companyCode, unitCode: unitCode } });
      if (dSetSubItemRecs.length != barcodeArr.length) {
        throw new ErrorResponse(0, `Few Sub items not found. Provided ${barcodeArr.length}. Existing ${dSetSubItemRecs.length}`);
      }
      // validation - 2
      // check if the incoming container exist
      const dSetContainerRec = await this.dSetContainerRepository.findOne({ select: ['id', 'dSetId', 'dSetItemId'], where: { id: Number(req.containerId), companyCode: companyCode, unitCode: unitCode } });
      if (!dSetContainerRec) {
        throw new ErrorResponse(0, "No containers found");
      }
      const dSetId = dSetContainerRec.dSetId;
      const dSetItemId = dSetContainerRec.dSetItemId;

      // 1 2 -3 4 *5 6
      for (const subItemRec of dSetSubItemRecs) {
        // const dSetItemId = subItemRec.dSetItemId;
        // validation - 3
        // get the containers associated with the ITEM 
        const dSetContainerIdRecs = await this.dSetContainerRepository.find({ select: ['id'], where: { dSetId: dSetId, dSetItemId: dSetItemId, companyCode: companyCode, unitCode: unitCode } });
        // now ensure that , the incoming container id must be a part of the ITEM mapped containers
        const containerIds = dSetContainerIdRecs.map(r => r.id);
        if (!containerIds.includes(Number(req.containerId))) {
          if (req.skipMissingHits) {
            continue;
          }
          throw new ErrorResponse(0, 'The container is not mapped with the current CUT');
        }
        // now check if we are trying to put the sub item in the same container again
        // get the rec from the container sub item map
        const subItemContMapRec = await this.dSetSubItemContainerMapRepository.findOne({ where: { dSetSubItemId: subItemRec.id, barcode: subItemRec.barcode, isActive: true, companyCode: companyCode, unitCode: unitCode } });
        // validation - 4
        if (subItemContMapRec?.dSetContainerId == req.containerId) {
          if (req.skipMissingHits) {
            continue;
          }
          throw new ErrorResponse(0, 'Already Sub Items mapped to the same container');
        }
        if (!subItemContMapRec || req.override) {
          // Else now create the container to sub item mapping record
          const newMapping = new DSetSubItemContainerMapEntity();
          newMapping.dSetId = dSetContainerRec.dSetId;
          newMapping.currentStage = ContainerSubItemReadinessEnum.PUT;
          newMapping.dSetSubItemId = subItemRec.id;
          newMapping.dSetContainerId = req.containerId;
          newMapping.barcode = subItemRec.barcode;
          newMapping.isActive = true;
          newMapping.companyCode = companyCode;
          newMapping.unitCode = unitCode;
          newMapping.dSetItemId = subItemRec.dSetItemId;
          await this.dSetSubItemContainerMapRepository.save(newMapping, { reload: false });
          // de activate the old records
          if (subItemContMapRec) {
            await this.dSetSubItemContainerMapRepository.update({ companyCode: companyCode, unitCode: unitCode, id: subItemContMapRec.id }, { isActive: false, updatedUser: username, currentStage: ContainerSubItemReadinessEnum.REMOVED });
          }
        }
      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 200, 'Sub Item Container Map successfully updated');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async removeDSetSubItemInTheContainer(req: DSetSubItemContainerMappingRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {-
      await transManager.startTransaction();
      if (!req?.subItemBarcode?.length) {
        throw new ErrorResponse(0, "Barcode's not provided");
      }
      const { companyCode, unitCode, username } = req;

      // get the rec from the container sub item map
      const subItemContMapRecs = await transManager.getRepository(DSetSubItemContainerMapEntity).find({ where: { barcode: In(req.subItemBarcode), isActive: true, companyCode: companyCode, unitCode: unitCode, } });
      if (subItemContMapRecs.length == 0) {
        throw new ErrorResponse(0, "None of the barcodes are mapped to any container");
      }
      await transManager.getRepository(DSetSubItemContainerMapEntity).update({ companyCode: companyCode, unitCode: unitCode, barcode: In(req.subItemBarcode), isActive: true }, { isActive: false, updatedUser: username });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 4567, "Sub Item Container Map successfully unmapped");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
}