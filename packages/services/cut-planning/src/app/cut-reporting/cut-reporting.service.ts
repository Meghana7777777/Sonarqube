import { Injectable } from "@nestjs/common";
import { DataSource, In, LessThan, MoreThan, MoreThanOrEqual } from "typeorm";
import { DocketMaterialHelperService } from "../docket-material/docket-material-helper.service";
import { DocketMaterialInfoService } from "../docket-material/docket-material-info.service";
import { BarcodePrefixEnum, CutReportRequest, CutStatusEnum, CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableDocketsResponse, CutTableOpenDocketsResponse, DbCutReportRequest, DocketAttrEnum, GlobalResponseObject, LayIdRequest, LayIdsRequest, LayingStatusEnum, MaterialRequestNoRequest, MaterialRequestToWhRequest, PhysicalEntityTypeEnum, PoDocketNumberRequest, PoItemRefCompProductModel, StockConsumptionModel, StockConsumptionRequest, TaskStatusEnum, WhAckEnum, WhExtReqNoRequest, WhReqByObjectEnum, cutStatusEnumDisplayValues } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutReportingInfoService } from "./cut-reporting-info.service";
import { CutReportingHelperService } from "./cut-reporting-helper.service";
import moment from 'moment';
import { PoAdbRepository } from "./repository/po-adb.repository";
import { PoAdbRollRepository } from "./repository/po-adb-roll.repository";
import { PoAdbEntity } from "./entity/po-adb.entity";
import { PoAdbRollEntity } from "./entity/po-adb-roll.entity";
import { PoActualDocketPanelEntity } from "./entity/po-actual-docket-panel.entity";
import { PoAdbShadeEntity } from "./entity/po-adb-shade.entity";
import { PoAdbShadeRepository } from "./repository/po-adb-shade.repository";
import { PoAdbComponentRepository } from "./repository/po-adb-component.repository";
import { PoAdbComponentEntity } from "./entity/po-adb-component.entity";
import { redlock } from "../../config/redis/redlock.config";

import configuration from '../../config/configuration';
import { PoDocketEntity } from "../docket-generation/entity/po-docket.entity";
import { PoDocketLayShadeRepository } from "../lay-reporting/repository/po-docket-lay-shade.repository";
@Injectable()
export class CutReportingService {
  // private NEED_PANELS = configuration().appSepcific.PANELS_GENERATION;
  private NEED_PANELS = true;
  constructor(
    private dataSource: DataSource,
    private cutRepInfoService: CutReportingInfoService,
    private cutRepHelperService: CutReportingHelperService,
    private adbRepo: PoAdbRepository,
    private adbRollRepo: PoAdbRollRepository,
    private adbShadeRepo: PoAdbShadeRepository,
    private adbCompRepo: PoAdbComponentRepository,
    private layShadePliesRepo: PoDocketLayShadeRepository
  ) {

  }

  /**
   * VALIDATOR and TRIGGERER
   * @param req 
   * @returns 
   */
  async validateAndTriggerReportCutForLay(req: CutReportRequest): Promise<GlobalResponseObject> {
    try {
      // do all the pre validations
      await this.doPreValidationsForCutReporting(req);
      const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
      if (layInfo.cutStatus != CutStatusEnum.OPEN) {
        const text = cutStatusEnumDisplayValues[layInfo.cutStatus];
        throw new ErrorResponse(0, `Cut reporting is already ${text} for this laying`);
      }
      // should make sure lay having rolls are not
      const layItemInfo = await this.cutRepHelperService.getLayingItemRecordsForLayId(req.layId, req.unitCode, req.companyCode);
      if (!layItemInfo.length) {
        throw new ErrorResponse(0, 'Cut reporting with out roll will not be allowed.')
      }
      // move the cut reporting status to progress
      await this.cutRepHelperService.updateCutStatusForLayId(req.layId, layInfo.docketGroup, CutStatusEnum.REP_INPROGRESS, req.companyCode, req.unitCode, null);
      // trigger the job for the cut reporting process
      await this.cutRepHelperService.addJobForProcessingCutReportingForLay(req);
      return new GlobalResponseObject(true, 0, 'Cut reporting triggered successfully');
    } catch (err) {
      throw err;
    }
  }

  /**
   * HELPER
   * @param req 
   */
  async doPreValidationsForCutReporting(req: CutReportRequest): Promise<boolean> {
    // check if the lay is valid
    const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
    if (!layInfo) {
      throw new ErrorResponse(0, 'Laying record does not exist');
    }
    if (layInfo.layingStatus != LayingStatusEnum.COMPLETED) {
      throw new ErrorResponse(0, `Laying is not confirmed for this lay`);
    }
    // Any previous lay in the docket should not be in progress state for cut reporting
    const layRecordsForDocket = await this.cutRepHelperService.getLayingRecordsForDocketGroups([layInfo.docketGroup], req.companyCode, req.unitCode);
    if (layRecordsForDocket.length == 0) {
      throw new ErrorResponse(0, 'Laying records does not exist for the docket');
    }
    for (const rec of layRecordsForDocket) {
      // skip the incoming lay id
      if (rec.id != req.layId) {
        if (rec.cutStatus != CutStatusEnum.COMPLETED) {
          throw new ErrorResponse(0, `Cut is in progress for this docket : ${rec.docketGroup} for laying no : ${rec.id}`);
        }
      }
    }
    // TODO 
    // Ensure no other docket is being reported under the fabric
    /** COMMENTING START */
    // const docketRec = await this.cutRepHelperService.getDocketRecordsByDocGroup(layInfo.docketGroup, req.companyCode, req.unitCode);
    // const ranomDoc = docketRec[0];
    // const docketsForPo = await this.cutRepHelperService.getDocketRecordsByPoAndItemCode(ranomDoc.poSerial, ranomDoc.itemCode, req.companyCode, req.unitCode);
    // const docketsForItem = docketsForPo.map(r => r.docketNumber);
    // const layingRecs = await this.cutRepHelperService.getLayingRecordsForDocketGroups(docketsForItem, req.companyCode, req.unitCode);
    /** COMMENTING END */
    const layingRecs = await this.cutRepHelperService.getLayingRecordsForDocketGroups([layInfo.docketGroup], req.companyCode, req.unitCode);
    // now check if any lay is cut in progress
    layingRecs.forEach(r => {
      // skip this validation for the current lay id
      if (r.id != req.layId) {
        if (r.cutStatus != CutStatusEnum.OPEN && r.cutStatus != CutStatusEnum.COMPLETED) {
          throw new ErrorResponse(0, `The docket ${r.docketGroup} under the current PO is being reported, current status: ${r.cutStatus}. You cannot proceed until it is completed`);
        }
      }
    })
    return true;
  }

  /**
   * WRITER and TRIGGERER
   * This will 
   *  1. update the lay status for the laying record and the docket bundle records 
   *  2. creates the ADBs with start and the end panel numbers 
   *  3. updates the panel numbers for the actual panels
   *  4. and will trigger cut reporting job for every doc bundle
   * @param req 
   * @returns 
   */
  async processCutReportingForLay(req: CutReportRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // do all the pre validations
      await this.doPreValidationsForCutReporting(req);
      // get the lay info record 
      const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
      if (layInfo.cutStatus != CutStatusEnum.REP_INPROGRESS) {
        throw new ErrorResponse(0, `Cut reporting is not triggered for this laying`);
      }
      const layedRolls = await this.cutRepHelperService.getLayingRollRecordsForLayId(req.layId, req.unitCode, req.companyCode);
      let layedPlies = 0;
      // calcaulate the layed plies
      layedRolls.forEach(r => { layedPlies += r.layedPlies });


      const docketsForDocGroup = await this.cutRepHelperService.getDocketRecordsByDocGroup(layInfo.docketGroup, req.companyCode, req.unitCode);
      if (docketsForDocGroup.length == 0) {
        throw new ErrorResponse(0, `Dockets not found for the docket group ${layInfo.docketGroup}`);
      }
      let randomDoc: PoDocketEntity = docketsForDocGroup[0];
      await transManager.startTransaction();
      for (const docket of docketsForDocGroup) {
        // get the docket record and the components associated for it
        const docketRecord = await this.cutRepHelperService.getDocketRecordByDocNumber(docket.docketNumber, req.companyCode, req.unitCode);
        // const docAttrs = await this.cutRepHelperService.getDocketAttrByDocNumber(docket.docketNumber, req.companyCode, req.unitCode);
        // const comps = docAttrs[DocketAttrEnum.COMPS].split(',');
        // const actRandomComp = comps[0];
        const prodName = docketRecord.productName;
        // const reqOfComp = new PoItemRefCompProductModel(null, req.unitCode, req.companyCode, null, docketRecord.poSerial, undefined, prodName, docketRecord.color, undefined)
        // const compsForPo = await this.cutRepHelperService.getRefComponentsForPoAndProduct(reqOfComp);
        // if (!compsForPo.status) {
        //   throw new ErrorResponse(0, `OES Says ${compsForPo.internalMessage}`)
        // }
        // const components = new Set<string>();
        // for (const eachActComp of compsForPo.data.actComponents) {
        //   if (eachActComp == actRandomComp) {
        //     components.add()
        //   }
        // }
        // compsForPo.data.refComponent.split(',').forEach(r => {
        //   components.add(r);
        // });
        // console.log(components);
        const randomComp = docketRecord.refComponent;
        const components = [randomComp];
        let poColorSizePanelNumbersMap = new Map<string, Map<string, Map<string, Map<string, number>>>>(); // prod name => color => size => comp => panel number
        const sizeWiseConsumedPanels = new Map<string, number>(); // size => panels count
        poColorSizePanelNumbersMap = await this.getActualColorSizePanelNumbersMap(layInfo.poSerial, req.companyCode, req.unitCode, transManager);
        const poPanelNumbersMap: Map<string, Map<string, number>> = await this.getPoPanelNumbersMap(layInfo.poSerial, req.companyCode, req.unitCode, transManager); // // prod name => comp => panel number

        // get tha max ADB number for the docket bundle. Usually since all the docket bundles will have the same no of ADBs, any random pick should be sufficient
        // INDEX_MODIFICATION
        const getMaxADBNumberForDoc = await this.adbRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, docketNumber: docket.docketNumber, poDocketLayId: req.layId }, order: { poAdbNumber: 'DESC' } });
        const maxAdbNo = getMaxADBNumberForDoc ? getMaxADBNumberForDoc.poAdbNumber : 0;
        // get only random component related bundles
        console.log('--------------')
        console.log(randomComp);
        const specificCompDocBundles = await this.cutRepHelperService.getDocketBundleRecordsByDocNumber(docket.docketNumber, req.companyCode, req.unitCode, randomComp);

        console.log('***************');
        console.log(specificCompDocBundles)
        console.log('***************')
        const underLayAdbNumberForCompMap = new Map<string, number>(); // map of the comp => underlay adb auto inc. At one instance after all the doc bundles are iterated, the value for all entries in the MAP must have the same value
        components.forEach(c => { underLayAdbNumberForCompMap.set(c, 1) });
        console.log(underLayAdbNumberForCompMap)
        const isBinding = docketRecord.isBinding;
        // If binding, then dont even generate the ADBs
        if (!isBinding) {
          // NOTE: This loop will be iterated only for 1 random component under a docket. Since we dont maintain ADBs w.r.t component names
          for (const bundle of specificCompDocBundles) {
            const size = bundle.size;
            const fgColor = bundle.color;

            // NOTE: Save the ADB for the docket bundle. We dont maintain the component names in the ADB
            const underLayAdbCompNum = underLayAdbNumberForCompMap.get(randomComp);
            const adbEntity = new PoAdbEntity();
            adbEntity.docketNumber = docketRecord.docketNumber,
              // TODO
              adbEntity.poDbNumber = bundle.bundleNumber;
            adbEntity.size = bundle.size;
            adbEntity.poAdbNumber = maxAdbNo + 1;
            adbEntity.underLayAdbNumber = underLayAdbCompNum; // the auto inc number under a laying + component
            adbEntity.actBundleqty = layedPlies;
            adbEntity.poDocketLayId = req.layId;
            adbEntity.companyCode = req.companyCode;
            adbEntity.unitCode = req.unitCode;
            adbEntity.poSerial = layInfo.poSerial;
            // increment the under lay ADB number of the component
            underLayAdbNumberForCompMap.set(randomComp, underLayAdbCompNum + 1);

            // Keep a track of total size wise consumed panel count for the random component. So we will sum these values against the po-comp-serials entity to keep the last panel numbers
            if (!sizeWiseConsumedPanels.has(size)) {
              sizeWiseConsumedPanels.set(size, 0);
            }
            sizeWiseConsumedPanels.set(size, sizeWiseConsumedPanels.get(size) + layedPlies);

            // save the ADB
            const savedAdb = await transManager.getRepository(PoAdbEntity).save(adbEntity);

            // Now iterate all the components in the docket to create the adb component mappings
            const adbComps: PoAdbComponentEntity[] = [];
            // now construct the PO ADB component level panel and fg numbers for all the components in the docket
            // NOTE: ADB component must be constructed for all the components. To keep a track of what component have what panel numbers
            for (const comp of components) {
              let lastPanel = poColorSizePanelNumbersMap?.get(prodName)?.get(fgColor)?.get(size)?.get(comp);
              let fgLastNumber = poPanelNumbersMap.get(prodName).get(comp);
              if (isNaN(lastPanel) || isNaN(fgLastNumber)) {
                throw new ErrorResponse(0, `Last panel is not found for : ${prodName} : ${fgColor} : ${size} : ${comp}`);
              }
              const adbComp = new PoAdbComponentEntity();
              adbComp.poDocketLayId = req.layId;
              adbComp.poSerial = layInfo.poSerial;
              adbComp.adbId = savedAdb.id;
              adbComp.component = comp;
              adbComp.panelStartNumber = lastPanel + 1;
              adbComp.panelEndNumber = lastPanel + layedPlies;
              adbComp.fgStartNumber = fgLastNumber + 1;
              adbComp.fgEndNumber = fgLastNumber + layedPlies;
              adbComps.push(adbComp);

              // increment the consumed panel count for each and every component for all bundles
              poColorSizePanelNumbersMap?.get(prodName)?.get(fgColor)?.get(size)?.set(comp, lastPanel + layedPlies);
              poPanelNumbersMap?.get(prodName)?.set(comp, fgLastNumber + layedPlies);
            }
            await transManager.getRepository(PoAdbComponentEntity).save(adbComps, { reload: false });
          }
        }

        // now move the docket bundle cut progress status to inprogress
        await this.cutRepHelperService.updateCutStatusForDocBundlesByDocNumber(docket.docketNumber, CutStatusEnum.REP_INPROGRESS, req.companyCode, req.unitCode, transManager);

        // after all update the last panel numbers for the actual panels in the po serials.
        // Since this update is an incremental update of the existing db value, we can simply pass the layed qty size wise + components involved. So the consumed panel count will be updated accordingly
        for (const [size, consumedPanels] of sizeWiseConsumedPanels) {
          // update the panel numbers against the po + prod type + color + size level
          await this.cutRepHelperService.updatePanelNumberForPoProdNameColorSizeComp(PhysicalEntityTypeEnum.ACTUAL, layInfo.poSerial, prodName, docketRecord.color, size, Array.from(components), consumedPanels, req.companyCode, req.unitCode, transManager);
          // update the panel numbers against the po + prod type + component
          await this.cutRepHelperService.updatePanelNumberForPoProdNameComp(PhysicalEntityTypeEnum.ACTUAL, layInfo.poSerial, prodName, Array.from(components), consumedPanels, req.companyCode, req.unitCode, transManager);
        }
        // TODO: If the docket is a binding docket, then we dont need to report the cut for the docket bundles
        if (isBinding) {
          // Then we do not need to generate the ADBs. Just directly update the cut status as done for the entire LAY
          await this.cutRepHelperService.updateCutStatusForDocBundlesByDocNumber(docketRecord.docketNumber, CutStatusEnum.OPEN, req.companyCode, req.unitCode, transManager);
        }
      } // docket loop ends

      // After all the dockets are iterated, now we have to check and update the cut status for the docket in the cut-table so as ro remove from dashboard
      const totalLayedRollsForDocket = await this.cutRepHelperService.getLayingRollRecordsForDocketGroups([layInfo.docketGroup], req.unitCode, req.companyCode);
      let totalLayedPlies = totalLayedRollsForDocket.reduce((sum, rec) => Number(rec.layedPlies) + sum, 0) ?? 0;
      // update the task status to completed in the cut table plan if all the plies of the docket are reported
      if (Number(randomDoc.plies) == Number(totalLayedPlies)) {
        // If a docket has more than 1 request, then we have to move all those requests to completed. For the docket to be removed from the dashboard
        await this.cutRepHelperService.updateTaskStatusForDocketGroup(layInfo.poSerial, layInfo.docketGroup, req.companyCode, req.unitCode, TaskStatusEnum.COMPLETED, transManager);
      }
      if (randomDoc.isBinding) {
        await this.cutRepHelperService.updateCutStatusForLayId(req.layId, layInfo.docketGroup.toString(), CutStatusEnum.COMPLETED, req.companyCode, req.unitCode, transManager);
      }
      await transManager.completeTransaction();


      // REWORK - Can be optimized in future
      // ADB PUBLISHING START
      // After the ADBs created for all the dockets under the docket group, then trigger jobs to create the ADB components and cut reporting to DCPs
      for (const docket of docketsForDocGroup) {
        if (!docket.isBinding) {
          // const docAttrs = await this.cutRepHelperService.getDocketAttrByDocNumber(docket.docketNumber, req.companyCode, req.unitCode);
          // const comps = docAttrs[DocketAttrEnum.COMPS].split(',');
          const randomComp = docket.refComponent;
          const specificCompDocBundles = await this.cutRepHelperService.getDocketBundleRecordsByDocNumber(docket.docketNumber, req.companyCode, req.unitCode, randomComp);
          // trigger the bull job for each and every bundle
          for (const rec of specificCompDocBundles) {
            // Here we have only 1 doc bundle for all the components in the docket
            const docBundlCutRepReq = new DbCutReportRequest(req.username, req.unitCode, req.companyCode, req.userId, req.layId, docket.docketNumber, rec.bundleNumber?.toString(), rec.size)
            await this.cutRepHelperService.addJobForProcessingCutReportingForDocBundle(docBundlCutRepReq);
          }
        }
      }
      // ADB PUBLISHING END

      // trigger the job for releasing all the rolls to the onfloor
      const layIdReq = new LayIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.layId, false, false);
      // to release the locked rolls and move them to onfloor
      await this.cutRepHelperService.addJobForProcessingPendingRollsToOnFloor(layIdReq);
      // to update the consumed rolls to the WH. for tracking purpose who consumed what
      await this.cutRepHelperService.addJobForUpdatingConsumedFabToExtSystem(layIdReq);
      // // add a job to create the emb jobs
      // await this.cutRepHelperService.addEmbRequestGenJob(layInfo.poSerial, layInfo.docketNumber, req.companyCode, req.unitCode, req.username);
      return new GlobalResponseObject(true, 0, 'Cut reporting triggered for all the bundles successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  // HELPER
  async getActualColorSizePanelNumbersMap(poSerial: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<Map<string, Map<string, Map<string, Map<string, number>>>>> {
    const panelNumbersMap = new Map<string, Map<string, Map<string, Map<string, number>>>>(); // prod name => color => size => comp => panel number
    // get the last panel numbers for the size and component name
    const panelNumbers = await this.cutRepHelperService.getPoColorSizePanelSerialNumbers(poSerial, PhysicalEntityTypeEnum.ACTUAL, companyCode, unitCode, transManager);
    if (panelNumbers.length == 0) {
      throw new ErrorResponse(0, 'Actual panel numbers not found');
    }
    panelNumbers.forEach(r => {
      if (!panelNumbersMap.has(r.productName)) {
        panelNumbersMap.set(r.productName, new Map<string, Map<string, Map<string, number>>>());
      }
      if (!panelNumbersMap.get(r.productName).has(r.color)) {
        panelNumbersMap.get(r.productName).set(r.color, new Map<string, Map<string, number>>());
      }
      if (!panelNumbersMap.get(r.productName).get(r.color).has(r.size)) {
        panelNumbersMap.get(r.productName).get(r.color).set(r.size, new Map<string, number>());
      }
      panelNumbersMap.get(r.productName).get(r.color).get(r.size).set(r.component, r.lastPanelNumber);
    })
    return panelNumbersMap;
  }


  // HELPER
  async getPoPanelNumbersMap(poSerial: number, companyCode: string, unitCode: string, transManager: GenericTransactionManager): Promise<Map<string, Map<string, number>>> {
    const panelNumbersMap = new Map<string, Map<string, number>>(); // prod name => comp => panel number
    // get the last panel numbers for the size and component name
    const panelNumbers = await this.cutRepHelperService.getPoPanelSerialNumbers(poSerial, PhysicalEntityTypeEnum.ACTUAL, companyCode, unitCode, transManager);
    if (panelNumbers.length == 0) {
      throw new ErrorResponse(0, 'Po panel numbers not found');
    }
    panelNumbers.forEach(r => {
      if (!panelNumbersMap.has(r.productName)) {
        panelNumbersMap.set(r.productName, new Map<string, number>());
      }
      if (!panelNumbersMap.get(r.productName).has(r.component)) {
        panelNumbersMap.get(r.productName).set(r.component, 0);
      }
      panelNumbersMap.get(r.productName).set(r.component, r.lastPanelNumber);
    });
    return panelNumbersMap;
  }



  /**
   * WRITER
   * BULL JOB: CPS_DB_CUT_REP
   * Reports the cut for a docket bundle based on the layed plies.
   * This function will take the docket bundle number as input. Then all the components under that bundle will be reported by considering the components in the docket
   * @param req 
   * @returns 
   */
  async processCutReportingForDocBundle(req: DbCutReportRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      // NOTE: This bundle will only have 1 component
      // Validations
      //  1. check if the cut is already reported for the docket bundle in po-docket-bundle as well as in the po-actual-docket-bundle. if reported return as cut already reported for the doc bundle woth the same laying id
      //  2. cut_progress for that doc bundle should be 1 in the po-docket-bundle
      //  3. check if the given lay id is valid in po-docket-lay for the laying id. if not valid then throw error "Laying id is not valid"
      // Process
      //  1. get the layed rolls for the laying id from po-docket-lay-item
      //  2. get the max ADB number for the incoming DB number
      //  start transaction
      //  3. insert the record into the ADB shade 
      //  4. based on the rolls insert the records into adb-rolls
      //  5. update the cut_status , adb_id, adb_roll_id to the po-docket-panel against to the docket bundle number based on the roll qty
      //  6. finally update the cut_progress in po-docket-bundle to 0
      //  complete transaction

      const layRec = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
      if (!layRec) {
        throw new ErrorResponse(0, 'Laying Record Does Not Exists')
      }
      if (layRec.cutStatus != CutStatusEnum.REP_INPROGRESS) {
        throw new ErrorResponse(0, `Cut reporting is not triggered for this laying`);
      }
      const docketRecord = await this.cutRepHelperService.getDocketRecordByDocNumber(req.docketNumber, req.companyCode, req.unitCode);
      // get the adb info. There will be only 1 ADB present for DOCKET + LAY + DOC BUNDLE combination 
      const adbRec = await this.adbRepo.findOne({ where: { docketNumber: req.docketNumber, poDbNumber: Number(req.docBundleNumber), poDocketLayId: req.layId, size: req.size, companyCode: req.companyCode, unitCode: req.unitCode } });
      if (!adbRec) {
        throw new ErrorResponse(0, 'ADB does not exist');
      }
      // check if the ADB is already cut reported
      const adbShadeRec = await this.adbShadeRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, poSerial: layRec.poSerial, underLayAdbNumber: adbRec.underLayAdbNumber, poDocketLayId: layRec.id, docketNumber: req.docketNumber } });
      if (adbShadeRec) {
        throw new ErrorResponse(0, 'The bundle is already cut reported');
      }
      // INDEX_MODIFICATION
      const adbComps = await this.adbCompRepo.find({ where: { adbId: adbRec.id, poSerial: layRec.poSerial, poDocketLayId: layRec.id } });
      // CORRECT
      // const docAttrs = await this.cutRepHelperService.getDocketAttrByDocNumber(docketRecord.docketNumber, req.companyCode, req.unitCode);
      // const compsInDocket = docAttrs[DocketAttrEnum.COMPS].split(',');
      const prodName = docketRecord.productName;
      // const reqOfComp = new PoItemRefCompProductModel(null, req.unitCode, req.companyCode, null, docketRecord.poSerial, undefined, prodName, docketRecord.color, undefined)
      // const compsForPo = await this.cutRepHelperService.getRefComponentsForPoAndProduct(reqOfComp);
      // if (!compsForPo.status) {
      //   throw new ErrorResponse(0, `OES Says ${compsForPo.internalMessage}`)
      // }
      // const components = new Set<string>();
      // compsForPo.data.refComponent.split(',').forEach(r => {
      //   components.add(r);
      // });
      // console.log(components);
      const compsInDocket = [docketRecord.refComponent];

      const layedRolls = await this.cutRepHelperService.getLayingRollRecordsForLayId(req.layId, req.unitCode, req.companyCode);

      const shadeQtyMap = new Map<string, number>(); // a map of the shade => sum(plies) accross all rolls in the shade
      const rollShadeMap = new Map<number, string>(); // a map of rollId => shade of the roll
      // construct the adb roll entities for granular handling of roll level bundle under an ADB
      const adbRollEntitys: PoAdbRollEntity[] = [];
      let rollseqId = 0;

      const shadePlies = await this.layShadePliesRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, poDocketLayId: req.layId }, });

      if (!shadePlies) {
        throw new ErrorResponse(0, 'shade plies not avilable')
      }

      shadePlies.forEach((shade) => {
        const shadeName = shade.shade;
        const plies = Number(shade.plies) || 0;
        shadeQtyMap.set(shadeName, plies);
      });

      layedRolls.forEach(roll => {
        if (Number(roll.layedPlies) > 0) {
          rollseqId++;
          const adbRollEntity = new PoAdbRollEntity();
          adbRollEntity.adbId = adbRec.id;
          adbRollEntity.rollId = roll.rollId;
          adbRollEntity.plies = roll.layedPlies;
          adbRollEntity.rollSeq = rollseqId;
          adbRollEntity.companyCode = req.companyCode;
          adbRollEntity.unitCode = req.unitCode;
          adbRollEntity.poDocketLayId = req.layId;
          adbRollEntity.shade = roll.shade;
          adbRollEntity.poSerial = layRec.poSerial;

          adbRollEntitys.push(adbRollEntity);

          rollShadeMap.set(roll.rollId, roll.shade);


          // if(!shadeQtyMap.get(roll.shade)) {
          //   shadeQtyMap.set(roll.shade, 0);
          // }
          // // sum up the plies per shade within the bundle
          // shadeQtyMap.set(roll.shade, roll.layedPlies + shadeQtyMap.get(roll.shade) );

        }
      });

      await manager.startTransaction();
      let tempAdbSavedRolls: PoAdbRollEntity[] = [];
      if (this.NEED_PANELS) {
        // since we need the saved rolls info for furher panel generation, we have to reload the saved info
        tempAdbSavedRolls = await manager.getRepository(PoAdbRollEntity).save(adbRollEntitys); // dont put {reload: false}
      } else {
        tempAdbSavedRolls = await manager.getRepository(PoAdbRollEntity).save(adbRollEntitys, { reload: false }); // put {reload: false}
      }

      let shadeBundleCount = 1;
      const shadeToAdbShadeIdMap = new Map<string, number>(); // map of the shade => adb shade bundle PK. a ref map to update the adb shade id the actual panel
      // now based on the shade, we have to create the ADB shade bundles
      for (const [shade, shadePlies] of shadeQtyMap) {
        const adbShadeEnt = new PoAdbShadeEntity();
        adbShadeEnt.companyCode = req.companyCode;
        adbShadeEnt.unitCode = req.unitCode;
        adbShadeEnt.createdUser = req.username;
        adbShadeEnt.shade = shade;
        adbShadeEnt.actBundleqty = shadePlies;
        adbShadeEnt.poSerial = adbRec.poSerial;
        adbShadeEnt.poAdbsNumber = shadeBundleCount;
        adbShadeEnt.poDocketLayId = adbRec.poDocketLayId;
        adbShadeEnt.underLayAdbNumber = adbRec.underLayAdbNumber;
        adbShadeEnt.docketNumber = adbRec.docketNumber;
        adbShadeEnt.barcode = this.getAdbBarcode(layRec.id, adbRec.underLayAdbNumber, shade, shadeBundleCount);
        // adbShadeEnt.poAdbId = adbRec.id;
        const savedAdbShade = await manager.getRepository(PoAdbShadeEntity).save(adbShadeEnt); // dont put {reload: false}
        shadeToAdbShadeIdMap.set(shade, savedAdbShade.id);
        shadeBundleCount += 1;
      }

      // the ADB actual panels has to be created only if NEED_PANELS is configured by the business
      if (this.NEED_PANELS) {
        const actualPanels: PoActualDocketPanelEntity[] = [];
        // save the actual panels
        for (const adbRoll of tempAdbSavedRolls) {
          let plies = adbRoll.plies;
          while (plies > 0) {
            // duplicate the panels * no of components with all same values
            adbComps.forEach(comp => {
              const panel = new PoActualDocketPanelEntity();
              panel.poSerial = layRec.poSerial;
              panel.companyCode = req.companyCode;
              panel.unitCode = req.unitCode;
              panel.docketNumber = req.docketNumber;
              panel.bundleNumber = adbRec.poDbNumber;
              panel.adbNumber = adbRec.poAdbNumber;
              panel.adbRollId = adbRoll.id;
              panel.component = comp.component;
              panel.underDoclayNumber = layRec.underDocLayNumber;
              panel.size = adbRec.size;
              // object reference will already have the values added
              panel.panelNumber = comp.panelStartNumber;
              panel.fgNumber = comp.fgStartNumber;
              panel.createdUser = req.username;
              panel.pslId = 1
              panel.adbShadeId = shadeToAdbShadeIdMap.get(adbRoll.shade); // assign the PK of the ADB shade bundle based on the shade associated with the roll
              actualPanels.push(panel);
              // incremant the panel and the fg number. The same object reference is used
              comp.panelStartNumber++;
              comp.fgStartNumber++;
            });
            plies--;
          }
        }
        // for a cross validation, just ensure that all the panel numbers are properly consumed for all the components
        adbComps.forEach(comp => {
          if (comp.fgStartNumber != comp.fgEndNumber + 1) {
            throw new ErrorResponse(0, 'Color and size panel mismatch issue while creating the actual panels');
          }
          if (comp.panelStartNumber != comp.panelEndNumber + 1) {
            throw new ErrorResponse(0, 'Fg number mismatch issue while creating the actual panels');
          }
        });

        await manager.getRepository(PoActualDocketPanelEntity).save(actualPanels, { reload: false });
        // update the cut reporting status in the dcp and the doc bundle for all the components in the doc bundle

        console.log('***********************');

        console.log(tempAdbSavedRolls);

        console.log('***********************')
        for (const roll of tempAdbSavedRolls) {
          await this.cutRepHelperService.mappingAdbToPanels(req.docketNumber, compsInDocket, layRec.underDocLayNumber, Number(req.docBundleNumber), req.size, adbRec.id, roll.id, roll.plies, req.companyCode, req.unitCode, manager);
        }
      } else {
        // We have to update the cut reporting progress for the docket bundle to OPEN once the cut reporting is completed for this specific docket bundle
        await this.cutRepHelperService.updateCutStatusForDocBundleByDocNumber(req.docketNumber, Number(req.docBundleNumber), CutStatusEnum.OPEN, req.companyCode, req.unitCode, manager);
      }
      await manager.completeTransaction();
      // now if all the bundles are cut reported, then update the cut status of the Laying entity
      await this.checkAndUpdateCutStatusForLay(layRec.poSerial, layRec.requestNumber, req.layId, layRec.docketGroup, CutStatusEnum.COMPLETED, req.companyCode, req.unitCode, req.username);
      return new GlobalResponseObject(true, 0, 'Cut Reported Successfully');
    } catch (error) {
      await manager.releaseTransaction();
      throw error;
    }
  }

  getAdbBarcode(layId: number, underLayAdb: number, shade: string, shadeBundleNo: number): string {
    if (shade) {
      return BarcodePrefixEnum.ACT_DOC_BUNDLE + ':' + Number(layId).toString(16) + '-' + Number(underLayAdb) + '-' + shadeBundleNo;
    } else {
      return BarcodePrefixEnum.ACT_DOC_BUNDLE + ':' + Number(layId).toString(16) + '-' + Number(underLayAdb);
    }
  }

  /**
   * WRITER
   * Called after every bundle cut reporting. If all bundles are cut reported, then this will update the cut status to DONE
   */
  async checkAndUpdateCutStatusForLay(poSerial: number, reqNo: string, layId: number, docketGroup: string, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    let lock;
    try {

      const docketsForDocGroup = await this.cutRepHelperService.getDocketRecordsByDocGroup(docketGroup, companyCode, unitCode);
      const dockets = docketsForDocGroup.map(r => r.docketNumber);
      // begin the red lock
      const lockKey = `LOCK_CUT_REP:${docketGroup}`;
      var ttl = 120000;
      lock = await redlock.lock(lockKey, ttl);
      const docBundlesWithNoCutRep = await this.cutRepHelperService.getDocBundleRecordsCountByDocketNumberAndCutStatus(dockets, CutStatusEnum.REP_INPROGRESS, companyCode, unitCode);
      if (docBundlesWithNoCutRep == 0) {
        await this.cutRepHelperService.updateCutStatusForLayId(layId, docketGroup, cutStatus, companyCode, unitCode, null);
        // add a job to create the emb jobs for each docket
        for (const docket of dockets) {
          await this.cutRepHelperService.addEmbRequestGenJob(poSerial, docket, companyCode, unitCode, username);
        }
      }
      await lock.unlock();
      return true;
    } catch (error) {
      // release the lock
      if (lock) {
        await lock.unlock();
      }
      return false;
    }
  }

  /**
   * HELPER
   * @param req 
   */
  async doPreValidationsForCutReportingReversal(req: LayIdRequest): Promise<boolean> {
    // check if the lay is valid
    const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
    const currentLayId = layInfo.id; // the pk of the current laying record
    if (!layInfo) {
      throw new ErrorResponse(0, 'Laying record does not exist');
    }
    // CORRECT
    // The cut reversal has to be done in the order of how it was Layed. i.e the last cut must be reversed before reversing the first one
    const layRecordsForDocket = await this.cutRepHelperService.getLayingRecordsForDocketGroups([layInfo.docketGroup], req.companyCode, req.unitCode);
    if (layRecordsForDocket.length == 0) {
      throw new ErrorResponse(0, 'Laying records does not exist for the docket');
    }
    for (const rec of layRecordsForDocket) {
      // checking if there are any layings after this laying request that are already cut reported.If so they must be reversed first
      if (rec.id > currentLayId && rec.cutStatus == CutStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, 'Cut must be reversed in the desc order of how it was reported. i.e the latest reported cut must be reversed first');
      }
    }
    // TODO: any furthur validations for the next processes

    // Any previous lay in the docket should not be in progress state for cut reporting or cut reversal
    for (const rec of layRecordsForDocket) {
      if (rec.id < currentLayId && rec.cutStatus != CutStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, `Cut is in progress for this docket : ${rec.docketGroup} for laying no : ${rec.id}`);
      }
    }
    return true;
  }

  /**
   * VALIDATOR and TRIGGERER
   * Validates and triggers the job for cut reversing
   * @param req 
   * @returns 
   */
  async validateAndTriggerReverseCutForLay(req: LayIdRequest): Promise<GlobalResponseObject> {
    try {
      // do all the pre validations
      await this.doPreValidationsForCutReportingReversal(req);
      const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
      if (layInfo.cutStatus != CutStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, `Cut reporting is not completed for this laying`);
      }
      // move the cut reporting status to progress
      await this.cutRepHelperService.updateCutStatusForLayId(req.layId, layInfo.docketGroup, CutStatusEnum.REV_INPROGRESS, req.companyCode, req.unitCode, null);
      // now trigger the job for doing the cut reversal
      await this.cutRepHelperService.addJobForProcessingCutReversingForLay(req);
      return new GlobalResponseObject(true, 0, 'Cut reversing triggered successfully');
    } catch (err) {
      throw err;
    }
  }

  /**
   * WRITER
   * deletes all the adb and reverses the cut status for the panels
   * @param req 
   * @returns 
   */
  async processCutReversalForLay(req: LayIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (!req.layId) {
        throw new ErrorResponse(0, 'Provide tha laying id');
      }
      // do all the pre validations
      await this.doPreValidationsForCutReportingReversal(req);
      const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
      if (layInfo.cutStatus != CutStatusEnum.REV_INPROGRESS) {
        throw new ErrorResponse(0, `Cut reporting reversal is not triggered for this laying`);
      }
      const docketsForDocGroup = await this.cutRepHelperService.getDocketRecordsByDocGroup(layInfo.docketGroup, req.companyCode, req.unitCode);
      const dockets = docketsForDocGroup.map(r => r.docketNumber);
      // delete the adb and adb rolls
      // INDEX_MODIFICATION
      await transManager.startTransaction();
      await transManager.getRepository(PoAdbComponentEntity).delete({ poSerial: layInfo.poSerial, poDocketLayId: req.layId });
      await transManager.getRepository(PoAdbEntity).delete({ poSerial: layInfo.poSerial, poDocketLayId: req.layId, companyCode: req.companyCode, unitCode: req.unitCode });
      await transManager.getRepository(PoAdbShadeEntity).delete({ poSerial: layInfo.poSerial, poDocketLayId: req.layId, companyCode: req.companyCode, unitCode: req.unitCode });
      await transManager.getRepository(PoAdbRollEntity).delete({ poSerial: layInfo.poSerial, poDocketLayId: req.layId, companyCode: req.companyCode, unitCode: req.unitCode });
      if (this.NEED_PANELS) {
        await transManager.getRepository(PoActualDocketPanelEntity).delete({ poSerial: layInfo.poSerial, docketNumber: In(dockets), underDoclayNumber: layInfo.underDocLayNumber, companyCode: req.companyCode, unitCode: req.unitCode });
        // now revert the cut status of the panels
        for (const docket of dockets) {
          await this.cutRepHelperService.unMappingAdbToPanels(docket, layInfo.underDocLayNumber, req.companyCode, req.unitCode, transManager);
        }
      }
      await transManager.completeTransaction();
      // trigger the job for deleting the emb jobs
      const layIdsReq = new LayIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.layId], false, false, null);
      await this.cutRepHelperService.addEmbLineDelJob(layIdsReq);
      return new GlobalResponseObject(true, 0, 'Cut reversed successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }



  /**
   * BULL JOB CONSUMER
   * EXTERNAL TRIGGERER
   * Triggers the WMS to create the consumed stock in there
   * @param req 
   */
  async updateTheConsumedStockToExternalSystem(req: LayIdRequest): Promise<GlobalResponseObject> {
    if (!req.layId) {
      throw new ErrorResponse(0, 'Provide tha laying id');
    }
    const layInfo = await this.cutRepHelperService.getLayingRecordForLayId(req.layId, req.unitCode, req.companyCode);
    if (layInfo.cutStatus != CutStatusEnum.COMPLETED) {
      throw new ErrorResponse(0, `Cut reporting is not done for this laying`);
    }

    const conStockModels: StockConsumptionModel[] = [];
    // get all the layed rolls and send the consumption info to the WMS
    const layedRolls = await this.cutRepHelperService.getLayingRollRecordsForLayId(req.layId, req.unitCode, req.companyCode);
    const docketAllocRolls = await this.cutRepHelperService.getPoDocketMaterialRecordsByDocNumber(layInfo.docketGroup, req.companyCode, req.unitCode);
    const rollIdConsQtyMap = new Map<string, number>();
    docketAllocRolls.forEach(r => {
      if (!rollIdConsQtyMap.has(r.rollId.toString())) {
        rollIdConsQtyMap.set(r.rollId.toString(), 0);
      }
      const preQty = rollIdConsQtyMap.get(r.rollId.toString());
      rollIdConsQtyMap.set(r.rollId.toString(), Number(r.requestedQuantity) + preQty);
    });
    for (const roll of layedRolls) {
      // TODO: Formula has to be incorporated
      let consumedQty = rollIdConsQtyMap.get(roll.rollId.toString()) ?? 0;
      const consumedOn = moment(roll.createdAt).format('YYYY-MM-DD HH:MM');
      const itemConsReq = new StockConsumptionModel(roll.rollId, roll.rollBarcode, layInfo.docketGroup, layInfo.id.toString(), consumedQty, consumedOn, roll.id);
      conStockModels.push(itemConsReq);
    }
    const stockConsReq = new StockConsumptionRequest(req.username, req.unitCode, req.companyCode, req.userId, conStockModels);
    await this.cutRepHelperService.updateTheConsumedStockToWms(stockConsReq);
    return new GlobalResponseObject(true, 0, 'Consumed stock updated successfully');
  }
}


// info     - info retrieving (gets)
// service  - processing / create / delete / update
// helper   - to call other modules functions