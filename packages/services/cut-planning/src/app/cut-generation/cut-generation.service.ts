import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { CutGenerationHelperService } from "./cut-generation-helper.service";
import { PoCutRepository } from "./repository/po-cut.repository";
import { PoCutDocketRepository } from "./repository/po-cut-docket.repository";
import { GlobalResponseObject, PoProdutNameRequest, PoSerialRequest } from "@xpparel/shared-models";
import { ErrorResponse, returnException } from "@xpparel/backend-utils";
import { PoCutEntity } from "./entity/po-cut.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoCutDocketEntity } from "./entity/po-cut-docket.entity";
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
const util = require('util');


@Injectable()
export class CutGenerationService {
  constructor(
    private dataSource: DataSource,
    private poCutRepo: PoCutRepository,
    private poCutDocRepo: PoCutDocketRepository,
    @Inject(forwardRef(() => CutGenerationHelperService)) private helperService: CutGenerationHelperService
  ) {

  }

  /**
   * END POINT
   * @param req 
   * @returns 
   */
  async generateCutsOld(req: PoSerialRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * We will get all the main dockets confirmed under the PO serial
       * For each product name  
       *  Get all the dockets under the PO + product name
       *  For each main docket
       *    create a cut job
       *    Now based on the color and size panels of that main docket, get the child docket numbers within the po + product type + color
       *    Now bind those docket numbers under the cut job
       * Keep a track of the consumed dockets.
       * If finally there are any left over trim dockets, create an individual cut job for each of them and repeat the whole above process
       * 
       */
      const docketsForPo = await this.helperService.getDocketRecordsForPoSerial(req.poSerial, req.companyCode, req.unitCode);
      if(docketsForPo.length == 0) {
        throw new ErrorResponse(0, 'Dockets does not exist for the po');
      }
      const consumedDockets = new Set<string>();
      const mainDockets = docketsForPo.filter(r => r.mainDocket == true);
      let maxCutNumber = 0;
      const maxSubCutNumberMap = new Map<string, number>();
      docketsForPo.forEach(r => { maxSubCutNumberMap.set(r.productName, 0) });

      // Get all the existing cut records and identify the max cut number and the max cut sub number
      const cutRecs = await this.poCutRepo.find({ select: ['productName', 'cutNumber', 'cutSubNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, isActive: true }});
      cutRecs.forEach(r => {
        maxCutNumber = Math.max(r.cutNumber, maxCutNumber);
        maxSubCutNumberMap.set(r.productName, r.cutSubNumber);
      });

      // STEP: 1
      await transManager.startTransaction();
      // iterate all the main dockets and create the cut number entity for each docket
      for(const doc of mainDockets) {
        // check if the cut job is already created for the docket
        const cutJob = await this.poCutRepo.findOne({ where: { refDocketNumber: doc.docketNumber, companyCode: doc.companyCode, unitCode: doc.unitCode } });
        if(!cutJob)  {
          maxCutNumber++;
          // create the new cut job
          const cutSubNumber = maxSubCutNumberMap.get(doc.productName) + 1;
          const poCutEnt = this.getPoCutEntity(req.poSerial, doc.productType, doc.productName, maxCutNumber, cutSubNumber, true, doc.docketNumber, req.companyCode, req.unitCode, req.username, doc.color);
          const savedCut = await transManager.getRepository(PoCutEntity).save(poCutEnt);
          maxSubCutNumberMap.set(doc.productName, maxSubCutNumberMap.get(doc.productName) + 1);

          // save the cut doc map of this main docket
          const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, 0, doc.docketNumber, req.companyCode, req.unitCode, req.username);
          await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
          consumedDockets.add(doc.docketNumber);

          // now get the other dockets associated with the panel numbers of this docket
          const otherRelativeDocketsForThisDoc = await this.helperService.getRelatedDocketsMappedForRefDocket(doc.poSerial, doc.docketNumber, req.companyCode, req.unitCode);
          // now map those dockets in here under the cut job
          for(const relativeDoc of otherRelativeDocketsForThisDoc) {
            consumedDockets.add(relativeDoc);
            // skip the main docket here
            if(doc.docketNumber != relativeDoc) {
              // create the po cut docket map entity
              const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, 0, relativeDoc, req.companyCode, req.unitCode, req.username);
              await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
            }
          }
        }
      }
      // SAME DUPLICATED CODE
      // STEP: 2 - for other left over or trim dockets
      const cutConsumedDocRecs = await transManager.getRepository(PoCutDocketEntity).find({select: ['docketNumber'], where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode }});
      cutConsumedDocRecs.forEach(r => consumedDockets.add(r.docketNumber) );
      // after iterating all the main dockets, now iterate for the other docket
      for(const doc of docketsForPo) {
        // if this specific docket is not a part of any of the cut job, then create a new cut job for these dockets
        if(!consumedDockets.has(doc.docketNumber)) {
          maxCutNumber++;
          // create the new cut job
          const cutSubNumber = maxSubCutNumberMap.get(doc.productName) + 1;
          const poCutEnt = this.getPoCutEntity(req.poSerial, doc.productType, doc.productName, maxCutNumber, cutSubNumber, false, doc.docketNumber, req.companyCode, req.unitCode, req.username, doc.color);
          const savedCut = await transManager.getRepository(PoCutEntity).save(poCutEnt);
          maxSubCutNumberMap.set(doc.productName, maxSubCutNumberMap.get(doc.productName) + 1);

          // save the cut doc map of this main docket
          const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, 0, doc.docketNumber, req.companyCode, req.unitCode, req.username);
          await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
          consumedDockets.add(doc.docketNumber);

          // now get the other dockets associated with the panel numbers of this docket
          const otherRelativeDocketsForThisDoc = await this.helperService.getRelatedDocketsMappedForRefDocket(doc.poSerial, doc.docketNumber, req.companyCode, req.unitCode);
          // now map those dockets in here under the cut job
          for(const relativeDoc of otherRelativeDocketsForThisDoc) {
            consumedDockets.add(relativeDoc);
            // skip the main docket here
            if(doc.docketNumber != relativeDoc) {
              // create the po cut docket map entity
              const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, 0, relativeDoc, req.companyCode, req.unitCode, req.username);
              await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
            }
          }
        }
      }
      // update the cut status as done to the PO
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, "Cuts generated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * END POINT
   * @param req 
   * @returns 
   */
  async generateCuts(req: PoProdutNameRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      /**
       * We will get all the main dockets confirmed under the PO serial
       * For each product name  
       *  Get all the dockets under the PO + product name
       *  For each main docket
       *    create a cut job
       *    Now based on the color and size panels of that main docket, get the child docket numbers within the po + product type + color
       *    Now bind those docket numbers under the cut job
       * Keep a track of the consumed dockets.
       * If finally there are any left over trim dockets, create an individual cut job for each of them and repeat the whole above process
       * 
       */
      let docketsForPo: PoDocketEntity[] = [];
      if(req.productName) {
        docketsForPo = await this.helperService.getDocketRecordByPoSerialProdName(req.poSerial, req.productName, req.companyCode, req.unitCode);
      } else {
        docketsForPo = await this.helperService.getDocketRecordsForPoSerial(req.poSerial, req.companyCode, req.unitCode);
      };
      console.log(docketsForPo.length);
      if(docketsForPo.length == 0) {
        throw new ErrorResponse(0, 'Dockets does not exist for the po');
      }
      // add validation that if any dockets are unconfirmed. If so don't create the cuts
      let filteredDockets = docketsForPo.filter((data) => data.docketConfirmation !== 2);
      if (filteredDockets.length > 0) {
        throw new ErrorResponse(0, 'Some dockets are not confirmed for cut generation');
      }
      const consumedDockets = new Set<string>();
      const mainDockets = docketsForPo.filter(r => r.mainDocket == true);
      const mainDocketNumbers: string[] = [];
      docketsForPo.forEach(r => r.mainDocket ? mainDocketNumbers.push(r.docketNumber) : '');
      let maxCutNumber = 0;
      const maxSubCutNumberMap = new Map<string, number>();
      docketsForPo.forEach(r => { maxSubCutNumberMap.set(r.productName, 0) });


      // check if any open dockets are found for creating the cuts
      const alreadyCutMappedDocs = new Set<string>();
      const alreadyCutMappedDocketRecs = await this.poCutDocRepo.find({ select: ['docketNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, docketNumber: In(mainDocketNumbers) } });
      alreadyCutMappedDocketRecs.forEach(d => {
        alreadyCutMappedDocs.add(d.docketNumber);
      });
      if(mainDockets.length == alreadyCutMappedDocs.size) {
        throw new ErrorResponse(0, 'No open main fabric dockets found for cut generation');
      }

      // Get all the existing cut records and identify the max cut number and the max cut sub number
      const cutRecs = await this.poCutRepo.find({ select: ['productName', 'cutNumber', 'cutSubNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, isActive: true }});
      cutRecs.forEach(r => {
        maxCutNumber = Math.max(r.cutNumber, maxCutNumber);
        maxSubCutNumberMap.set(r.productName, r.cutSubNumber);
      });
      // STEP: 1
      await transManager.startTransaction();
      // iterate all the main dockets and create the cut number entity for each docket
      for(const doc of mainDockets) {
        console.log('****************')
        console.log(doc);
        console.log('****************')
        // check if the cut job is already created for the docket
        const cutJob = await this.poCutRepo.findOne({ where: { refDocketNumber: doc.docketNumber, companyCode: doc.companyCode, unitCode: doc.unitCode } });
        if(!cutJob)  {
          maxCutNumber++;
          // create the new cut job
          const cutSubNumber = maxSubCutNumberMap.get(doc.productName) + 1;
          const poCutEnt = this.getPoCutEntity(req.poSerial, doc.productType, doc.productName, maxCutNumber, cutSubNumber, true, doc.docketNumber, req.companyCode, req.unitCode, req.username, doc.color);
          const savedCut = await transManager.getRepository(PoCutEntity).save(poCutEnt);
          maxSubCutNumberMap.set(doc.productName, maxSubCutNumberMap.get(doc.productName) + 1);

          // save the cut doc map of this main docket
          const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, cutSubNumber, doc.docketNumber, req.companyCode, req.unitCode, req.username);
          await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
          consumedDockets.add(doc.docketNumber);

          // now get the other dockets associated with the panel numbers of this docket
          console.log('+++++++++++++++++++++++');
          console.log(doc.poSerial, doc.docketNumber, req.companyCode, req.unitCode)
          const otherRelativeDocketsForThisDoc = await this.helperService.getRelatedDocketsMappedForRefDocket(doc.poSerial, doc.docketNumber, req.companyCode, req.unitCode);
          console.log(otherRelativeDocketsForThisDoc);
          console.log('+++++++++++++++++++++++')
          // now map those dockets in here under the cut job
          for(const relativeDoc of otherRelativeDocketsForThisDoc) {
            consumedDockets.add(relativeDoc);
            // skip the main docket here
            if(doc.docketNumber != relativeDoc) {
              // create the po cut docket map entity
              const poCutDocMap = this.getPoCutDocEntity(req.poSerial, maxCutNumber, cutSubNumber, relativeDoc, req.companyCode, req.unitCode, req.username);
              await transManager.getRepository(PoCutDocketEntity).save(poCutDocMap, { reload: false });
            }
          }
        }
      }
      // update the cut status as done to the PO
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, "Cuts generated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // helper
  getPoCutDocEntity(poSerial: number, cutNumber: number, cutSubNumber: number, doc: string, companyCode: string, unitCode: string, username: string): PoCutDocketEntity {
    const poCutDocMap = new PoCutDocketEntity();
    poCutDocMap.companyCode = companyCode;
    poCutDocMap.unitCode = unitCode;
    poCutDocMap.poSerial = poSerial;
    poCutDocMap.createdUser = username;
    poCutDocMap.cutNumber = cutNumber;
    poCutDocMap.cutSubNumber = cutSubNumber;
    poCutDocMap.docketNumber = doc;
    return poCutDocMap
  }

  // helper
  getPoCutEntity(poSerial: number, productType: string, productName: string, cutNumber: number, cutSubNumber: number, isMainCut: boolean, doc: string, companyCode: string, unitCode: string, username: string, fgColor: string): PoCutEntity {
    const cutJobEnt = new PoCutEntity();
    cutJobEnt.companyCode =companyCode;
    cutJobEnt.unitCode = unitCode;
    cutJobEnt.createdUser = username;
    cutJobEnt.poSerial = poSerial;
    cutJobEnt.isMainCut = isMainCut;
    cutJobEnt.productName = productName;
    cutJobEnt.productType = productType;
    cutJobEnt.refDocketNumber = doc;
    cutJobEnt.cutNumber = cutNumber;
    cutJobEnt.cutSubNumber = cutSubNumber;
    cutJobEnt.fgColor = fgColor;
    return cutJobEnt
  }

  /**
   * End point
   * @param req 
   * @returns 
   */
  async deleteCuts(req: PoProdutNameRequest, incomingTransManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager = incomingTransManager ? incomingTransManager : new GenericTransactionManager(this.dataSource);
    try {
      if(!req.poSerial) {
        throw new ErrorResponse(0, 'PoSerial is not provided for deleting the cuts');
      }
      if(!incomingTransManager) {
        await transManager.startTransaction();
      }

      let cutsForPo: PoCutEntity[] = [];
      // check if any of the cuts are already dispatched
      if(req.productName) {
        cutsForPo = await this.poCutRepo.find({ select: ['cutNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, productName: req.productName } });
      } else {
        cutsForPo = await this.poCutRepo.find({ select: ['cutNumber'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial } });
      }
      const cutNumbers: number[] = cutsForPo.map(r => r.cutNumber);
      if(cutNumbers.length == 0) {
        throw new ErrorResponse(0, 'No cuts found to delete');
      }

      const randomCutDispatchReq = await this.helperService.getCutDrRequestHeaderRecordForPoSerialCutNumbers(req.poSerial, cutNumbers, req.companyCode, req.unitCode);
      if(randomCutDispatchReq) {
        throw new ErrorResponse(0, `Cut dispatch is already created for the cut numbers under the cut order `);
      }
      await transManager.getRepository(PoCutEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, cutNumber: In(cutNumbers) });
      await transManager.getRepository(PoCutDocketEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, cutNumber: In(cutNumbers) });
      if(!incomingTransManager) {
        await transManager.completeTransaction();
      }
      return new GlobalResponseObject(true, 0, 'Cuts deleted successfully');
    } catch (error) {
      if(!incomingTransManager) {
        await transManager.releaseTransaction();
      }
      throw error;
    }
  }

}


