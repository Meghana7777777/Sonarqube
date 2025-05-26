import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In, Not, UpdateResult } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoDocketRepository } from "./repository/po-docket.repository";
import { PoDocketBundleRepository } from "./repository/po-docket-bundle.repository";
import { PoDocketPanelRepository } from "./repository/po-docket-panel.repository";
import { PoDocketGroupRepository } from "./repository/po-docket-group.repository";
import { PoRatioAttrRepository } from "../common/repository/po-ratio-attr.repository";
import { CutRmModel, CutStatusEnum, DocBundleGenerationStatusEnum, DocBundlePanelsRequest, DocConfirmationStatusEnum, DocGenStatusEnum, DocPanelGenStatusEnum, DocketAttrEnum, GlobalResponseObject, MO_R_OslBundlesModel, MO_R_OslProcTypeBundlesModel, PO_C_PoSerialPslIdsRequest, PhysicalEntityTypeEnum, PoDocketNumberRequest, PoItemProductModel, PoProdutNameRequest, PoRatioIdRequest, PoRatioModel, PoSerialRequest, RatioDocGenStatusRequest, RemarkDocketGroupResponse, RemarksDocketGroupRequest, SizeCompPanelInfo } from "@xpparel/shared-models";
import { redlock } from '../../config/redis/redlock.config';
import { dynamicRedlock } from '../../config/redis/redlock.config';
import { DocketGenerationHelperService } from "./docket-generation-helper.service";
import { PoDocketGroupEntity } from "./entity/po-docket-group.entity";
import { PoDocketEntity } from "./entity/po-docket.entity";
import { PoDocketBundleEntity } from "./entity/po-docket-bundle.entity";
import { PoDocketSerialsEntity } from "./entity/po-docket-serials.entity";
import { PoDocketSerialRepository } from "./repository/po-docket-serial.repository";
import { PoDocketPanelEntity } from "./entity/po-docket-panel.entity";
import { PoDocketAttrEntity } from "./entity/po-docket-attr.entity";
import { PoRatioAttrEntity } from "../common/entity/po-ratio-attr.entity";
import { PoComponentSerialsEntity } from "./entity/po-component-serials.entity";
import { PoComponentSerialsRepository } from "./repository/po-component-serial.repository";
const util = require('util');
import configuration from '../../config/configuration';
import { RemarksPoDocketRepository } from "./repository/remarks-po docket.repository";
import { PoMaterialService } from "@xpparel/shared-services";
import { PslInfoRepository } from "../common/repository/psl-info.repository";
import { PoDocketPslRepository } from "./repository/po-docket-psl.repository";
import { PoDocketPslEntity } from "./entity/po-docket-psl.entity";
import { PoDocketBundlePslEntity } from "./entity/po-docket-bundle-psl.entity";
import { PslInfoEntity } from "../common/entity/psl-info.entity";
import { PoDocketBundlePslRepository } from "./repository/po-docket-bundle-psl.repository";

@Injectable()
export class DocketGenerationService {
  // private NEED_PANELS = configuration().appSepcific.PANELS_GENERATION;
  private NEED_PANELS = true;
  constructor(
    private dataSource: DataSource,
    private poDocketRepo: PoDocketRepository,
    private poDocBundleRepo: PoDocketBundleRepository,
    private poDocPanelRepo: PoDocketPanelRepository,
    private poDocGroupRepo: PoDocketGroupRepository,
    private ratioAttrRepo: PoRatioAttrRepository,
    private poPanelSerialRepo: PoComponentSerialsRepository,
    @Inject(forwardRef(() => DocketGenerationHelperService)) private helperService: DocketGenerationHelperService,
    private poDocketSerialRepo: PoDocketSerialRepository,
    private remarksDocketGroupRepo: RemarksPoDocketRepository,
    private poMaterialService: PoMaterialService,
    private pslRepo: PslInfoRepository,
    private docPslRepo: PoDocketPslRepository,
    private docBundlePslRepo: PoDocketBundlePslRepository
  ) {
    console.log('***************');
    console.log(this.NEED_PANELS)
    console.log('***************')
  }

  /**
   * Service to generate dockets for given Ratio After validating again
   * Direct API
   * @param req 
   * @returns 
  */
  async generateDockets(req: PoRatioIdRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    const unitCode = req.unitCode; const companyCode = req.companyCode;
    let lock = null;
    let checkFlag = false;
    try {
      // Need to check po docket serial  having data for the po or not
      const docketSerialData: PoDocketSerialsEntity[] = await this.poDocketSerialRepo.find({ where: { poSerial: req.poSerial, unitCode, companyCode, entityType: PhysicalEntityTypeEnum.PLANNED } });
      if (docketSerialData.length == 0) {
        throw new ErrorResponse(0, 'PO Docket serial does not have data. Please check and try again.')
      };
      // Need to check Dockets are already there for ration Id or not
      const docketsInfo = await this.poDocketRepo.find({ where: { poRatioId: req.poRatioId, isActive: true, unitCode, companyCode } });
      if (docketsInfo.length > 0) {
        throw new ErrorResponse(0, 'Dockets are already generated for this ratio. Please check and try again.')
      }
      // check if any of the dockets in the PO has doc_confirmation != OPEN
      const inprogressDockets = await this.poDocketRepo.find({ where: { docketConfirmation: DocConfirmationStatusEnum.INPROGRESS, unitCode, companyCode, poSerial: req.poSerial } });
      if (inprogressDockets.length > 0) {
        throw new ErrorResponse(0, 'Dockets Confirmation is in progress please check and try again.');
      }
      // Need tp get the ratio info from the OES and generate the dockets
      const docketDetailsForPo = await this.poDocketRepo.find({ select: ['id'], where: { poSerial: req.poSerial, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.INPROGRESS } });
      if (docketDetailsForPo.length > 0) {
        throw new ErrorResponse(0, 'Docket confirmation is still in progress. Please wait and try again');
      }
      const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(req);

      const currentRatio: PoRatioModel = ratioInfo[0];
      if (currentRatio.docGenStatus != DocGenStatusEnum.OPEN) {
        throw new ErrorResponse(0, 'Docket generation already completed / In progress for the given ratio. Please check')
      };
      if (!currentRatio.markerInfo) {
        throw new ErrorResponse(0, 'Please assign markers to the ratio before generating the dockets.')
      }
      const updateReq = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.INPROGRESS);
      await this.helperService.updateDocGenStatusByRatioId(updateReq);
      checkFlag = true;
      // Need to lock the PO SERIAL HERE for synchronization and the consistency of docket generation / confirmation / deletion for a particular PO 
      // Have to lock the sub po  to update the lay gen status against to the sub Po
      const lockPoSerial = `LOCK_PO_SERIAL:${req.poSerial}-${req.unitCode}-${req.companyCode}`;
      const ttl = 120000;
      // Apply a lock for the sub po to ensure the creation of serial number for the Master PO 
      lock = await dynamicRedlock.lock(lockPoSerial, ttl).catch(error => {
        throw new ErrorResponse(0, 'Someone already triggered Docket generation / deletion / confirmation. Please try again');
      });
      // GETTING ATTRIBUTES INFO FOR PO SERIAL
      const summaryReq = new PoSerialRequest(req.username, unitCode, companyCode, req.userId, req.poSerial, null, true, false);
      const poSummaryInfo = await this.helperService.getPoSummary(summaryReq);
      const coInfo = new Set<string>();
      const soInfo = new Set<string>();
      const soLines = new Set<string>();
      const destinations = new Set<string>();
      const vpoInfo = new Set<string>();
      soInfo.add(poSummaryInfo.orderRefNo);
      poSummaryInfo.poLines.forEach((eachPoLine) => {
        eachPoLine.subLines.forEach((subLine) => {
          coInfo.add(subLine.co);
          soLines.add(eachPoLine.orderLineNo);
          vpoInfo.add(subLine.vpo);
        })
      });

      // LOGIC TO GENERATE DOCKETS
      await manager.startTransaction();
      // IN THE CASE OF SANDWICH CUT ONE RATIO LINE WILL HAVE MULTIPLE FABRICS AND HAVING SAME MAX PLIES MO WE CAN CONSIDER MAX PLIES OF ANY ONE OF THE RATIO FABRIC FOR THE RATIO LINE
      const consideredMaxPlies = currentRatio.rLines[0].ratioFabric[0].maxPlies;
      // THESE MANY DOCKETS WE NEED TO GENERATE
      // IN THE CASE OS SANDWICH WE NEED TO CAPTURE A REFERENCE NUMBER WHICH IS SAME ACROSS ALL THE FABRICS TO GENERATE THAT REFERENCE NUMBER WE ARE INSERTING A ROW IN DOCKET GROUP WHICH GIVES A COMMON REFERENCE NUMBER
      let remainingPlies = currentRatio.rLines[0].ratioPlies;
      let currentDocNumber = 0;
      while (remainingPlies > 0) {
        // the current docket number sequence within the ratio
        const docketPlies = Math.min(remainingPlies, consideredMaxPlies);
        remainingPlies -= docketPlies;
        const docGroupEntity = new PoDocketGroupEntity();
        docGroupEntity.companyCode = companyCode;
        docGroupEntity.createdUser = req.username;
        // docGroupEntity.docketGroup = `${req.poRatioId} - ${++currentDocNumber}`;
        docGroupEntity.docketGroup = '';
        docGroupEntity.poRatioId = req.poRatioId;
        docGroupEntity.poSerial = req.poSerial;
        docGroupEntity.unitCode = unitCode;
        const docGroup: PoDocketGroupEntity = await manager.getRepository(PoDocketGroupEntity).save(docGroupEntity);
        // update the docket group
        await manager.getRepository(PoDocketGroupEntity).update({ id: docGroup.id }, { docketGroup: docGroup.id.toString() });
        for (const eachRatioLine of currentRatio.rLines) {
          const totalRatio = eachRatioLine.sizeRatios.reduce((sum, model) => sum + model.ratio, 0);
          for (const eachFabric of eachRatioLine.ratioFabric) {
            const refCompReq = new PoItemProductModel(req.username, unitCode, req.companyCode, req.userId, req.poSerial, eachRatioLine.ratioFabric[0].iCode, eachRatioLine.productName, eachRatioLine.color)
            const refCompInfo = await this.poMaterialService.getRefComponentForPoAndFabric(refCompReq);
            if (!refCompInfo.status) {
              throw new ErrorResponse(0, `Ref Component details not found for ` + eachRatioLine.ratioFabric[0].iCode + "-" + eachRatioLine.productName + "-" + eachRatioLine.color)
            };
            const refComp = refCompInfo.data;
            // const currentCount: number = await manager.getRepository(PoDocketEntity).count({ where: { poSerial: req.poSerial, poRatioId: req.poRatioId, unitCode, companyCode, isActive: true, itemCode: eachFabric.iCode, productName: eachRatioLine.productName } });
            const docketEntity = new PoDocketEntity();
            docketEntity.bundleGenStatus = DocBundleGenerationStatusEnum.INPROGRESS;
            docketEntity.cgName = null; // TODO : NEED TO GET THIS FROM API
            docketEntity.companyCode = companyCode;
            docketEntity.createdUser = req.username;
            // docketEntity.cutNumber = currentCount + 1;
            docketEntity.docketConfirmation = DocConfirmationStatusEnum.OPEN;
            docketEntity.itemCode = eachFabric.iCode;
            // docketEntity.materialRequirement = (Number(currentRatio.markerInfo.mLength) * docketPlies);
            docketEntity.plannedBundles = totalRatio;
            docketEntity.plies = docketPlies;
            docketEntity.poRatioId = req.poRatioId;
            docketEntity.poSerial = req.poSerial;
            docketEntity.productName = eachRatioLine.productName;
            docketEntity.poRatioFabricId = eachFabric.id;
            docketEntity.productType = eachRatioLine.productType;
            docketEntity.unitCode = unitCode;
            docketEntity.color = eachRatioLine.color;
            docketEntity.docketNumber = '0';
            docketEntity.poMarkerId = currentRatio.markerInfo.id;
            docketEntity.isBinding = eachFabric.isBinding;
            docketEntity.refComponent = refComp.refComponent;
            docketEntity.docketGroup = docGroup.id.toString();

            // TODO: Binding requirement
            // docketEntity.bindingRequirement = Number((Number(currentRatio.markerInfo.mLength) * docketPlies * eachFabric.bindingCons).toFixed(2));
            docketEntity.mainDocket = eachFabric.mainFabric;
            const docketSaveEntity: PoDocketEntity = await manager.getRepository(PoDocketEntity).save(docketEntity);
            const docketNumber = docketSaveEntity.id.toString();
            await manager.getRepository(PoDocketEntity).update({ id: docketSaveEntity.id, poRatioId: req.poRatioId, companyCode: companyCode, unitCode: unitCode }, { docketNumber: docketNumber });
            // NEED TO INSERT DOCKET ATTRIBUTES
            const allDocketAttributes: PoDocketAttrEntity[] = [];
            const currentAttributes: string[] = Object.keys(DocketAttrEnum);
            for (const eachAttribute of currentAttributes) {
              if (eachAttribute == DocketAttrEnum.BUYER) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = '';
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.CO) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = [...coInfo].toString();
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.MO) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = [...soInfo].toString();;
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.MOLINES) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = [...soLines].toString();;
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.COMPS) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = eachRatioLine.components.toString();
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.DESTINATION) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = '';
                allDocketAttributes.push(docketAttributes);
              }
              else if (eachAttribute == DocketAttrEnum.VPO) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = [...vpoInfo].toString();
                allDocketAttributes.push(docketAttributes);
              } else if (eachAttribute == DocketAttrEnum.PLANT_STYLE_REF) {
                const docketAttributes = new PoDocketAttrEntity();
                docketAttributes.docketNumber = docketNumber;
                docketAttributes.name = eachAttribute;
                docketAttributes.value = poSummaryInfo.poLines[0]?.plantStyle;
                allDocketAttributes.push(docketAttributes);
              }
            };
            await manager.getRepository(PoDocketAttrEntity).save(allDocketAttributes);
          }
        }
      }
      // NEED TO INSERT RATIO ATTRIBUTES
      const ratioAttributes = new PoRatioAttrEntity();
      ratioAttributes.poRatioId = currentRatio.id;
      ratioAttributes.poSerial = req.poSerial;
      ratioAttributes.ratioCode = currentRatio.rCode.toString();
      ratioAttributes.ratioDesc = currentRatio.rDesc;
      ratioAttributes.ratioName = currentRatio.rName;
      await manager.getRepository(PoRatioAttrEntity).save(ratioAttributes);
      await manager.completeTransaction();
      await lock.unlock();
      const updateReq1 = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.COMPLETED);
      await this.helperService.updateDocGenStatusByRatioId(updateReq1);
      return new GlobalResponseObject(true, 0, 'Dockets Generated Successfully');
    } catch (err) {
      if (lock) {
        lock.unlock();
      }
      if (checkFlag) {
        const updateReq = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.OPEN);
        await this.helperService.updateDocGenStatusByRatioId(updateReq);
      }
      await manager.releaseTransaction();
      throw err;
    }
    // THIS ONLY SAVES THE DOCKET RECORDS INCLUDING DOCKET GROUP AS WELL 
    // getRatioDetailedInfoForRatioId
    // check if any of the dockets in the PO has doc_confirmation != OPEN
    // lock the whole PO for docket generation / docket confirmation / docket deletion
    // get the ratio info from the OES and generate the dockets
    // PO docket group => po docket
    // Once generated, then updte the doc gen status in the OES against to the ratio accordingly.
  }

  /**
   * BULL JOB: CPS_DOC_BUN_GEN
   * This service is called from docketConfirmation()
   * Service to generate docket bundles for given docket
   * after completion of all the bundles need to trigger a job for each and every docket bundle to generate panels with start number and end number
   * @param req 
   * @returns 
  */
  async generateDocketBundles(req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
    const unitCode = req.unitCode; const companyCode = req.companyCode;
    const manager = new GenericTransactionManager(this.dataSource);
    let lock = null;
    let checkFlag = false;
    try {
      // read the docket record and getr ratio id
      // getRatioDetailedInfoForRatioId by using the docket record
      const docketDetails = await this.poDocketRepo.findOne({ where: { docketNumber: req.docketNumber, unitCode, companyCode, isActive: true } });
      if (!docketDetails) {
        throw new ErrorResponse(0, 'Docket details not found for the given docket number. Please check and try again.')
      }
      const docketBundles = await this.poDocBundleRepo.findOne({ select: ['id'], where: { docketNumber: req.docketNumber, unitCode, companyCode, isActive: true } });
      if (docketBundles) {
        throw new ErrorResponse(0, 'Docket Bundles already generated for the given docket number. Please check and try again')
      }
      if (docketDetails.docketConfirmation != DocConfirmationStatusEnum.INPROGRESS) {
        throw new ErrorResponse(0, 'Docket Bundles already generated for the given docket number. Please check and try again')
      };
      await this.updateDocketBundleGenStatus(req.docketNumber, unitCode, companyCode, DocBundleGenerationStatusEnum.INPROGRESS);
      checkFlag = true;
      const ratioId = docketDetails.poRatioId;
      // Need tp get the ratio info from the OES and generate the docketsC
      const ratioReq: PoRatioIdRequest = new PoRatioIdRequest(req.username, unitCode, companyCode, req.userId, req.poSerial, ratioId)
      const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(ratioReq);
      const currentRatio: PoRatioModel = ratioInfo[0];
      const productName = currentRatio.rLines[0].productName;

      // MAP: PRODUCT_NAME -> FG_COLOR -> SIZE -> COMPONENT -> QTY
      const sizeComponentReqQtyMap = new Map<string, Map<string, Map<string, Map<string, number[]>>>>();
      for (const sizeInfo of req.sizeCompPanelInfo) {
        if (!sizeComponentReqQtyMap.has(sizeInfo.productName)) {
          sizeComponentReqQtyMap.set(sizeInfo.productName, new Map<string, Map<string, Map<string, number[]>>>());
        }
        if (!sizeComponentReqQtyMap.get(sizeInfo.productName).has(sizeInfo.fgColor)) {
          sizeComponentReqQtyMap.get(sizeInfo.productName).set(sizeInfo.fgColor, new Map<string, Map<string, number[]>>());
        }
        if (!sizeComponentReqQtyMap.get(sizeInfo.productName).get(sizeInfo.fgColor).has(sizeInfo.size)) {
          sizeComponentReqQtyMap.get(sizeInfo.productName).get(sizeInfo.fgColor).set(sizeInfo.size, new Map<string, number[]>())
        }
        if (!sizeComponentReqQtyMap.get(sizeInfo.productName).get(sizeInfo.fgColor).get(sizeInfo.size).has(sizeInfo.componentName)) {
          sizeComponentReqQtyMap.get(sizeInfo.productName).get(sizeInfo.fgColor).get(sizeInfo.size).set(sizeInfo.componentName, [sizeInfo.panelStartNumber, sizeInfo.panelEndNumber]);
        }
      };
      await manager.startTransaction();
      // Need to generate the docket bundles now
      const compWiseCount = new Map<string, number>();
      let bundleNumber = 0;
      for (const eachRatioLine of currentRatio.rLines) {
        if (eachRatioLine.productName != docketDetails.productName || eachRatioLine.color != docketDetails.color) {
          continue;
        };
        const refCompReq = new PoItemProductModel(req.username, unitCode, req.companyCode, req.userId, req.poSerial, eachRatioLine.ratioFabric[0].iCode, docketDetails.productName, eachRatioLine.color)
        const refCompInfo = await this.poMaterialService.getRefComponentForPoAndFabric(refCompReq);
        if (!refCompInfo.status) {
          throw new ErrorResponse(0, `Ref Component details not found for ` + eachRatioLine.ratioFabric[0].iCode + "-" + docketDetails.productName + "-" + eachRatioLine.color)
        }
        let docBundleEntities: PoDocketBundleEntity[] = [];
        const sizeRatios = eachRatioLine.sizeRatios;
        const refComp = refCompInfo.data;
        for (const eachSize of sizeRatios) {
          // EACH RATIO IS A EACH BUNDLE
          for (let bundle = 0; bundle < eachSize.ratio; bundle++) {
            // Need to get the components for the fabric
            for (const eachComponent of [refComp]) {
              if (!compWiseCount.has(eachComponent.refComponent)) {
                compWiseCount.set(eachComponent.refComponent, 0);
              }
              const preCount = compWiseCount.get(eachComponent.refComponent);
              compWiseCount.set(eachComponent.refComponent, preCount + 1);
              const docketBundleEntity = new PoDocketBundleEntity();
              docketBundleEntity.bundleNumber = compWiseCount.get(eachComponent.refComponent);
              docketBundleEntity.color = eachRatioLine.color;
              docketBundleEntity.companyCode = companyCode;
              docketBundleEntity.component = eachComponent.refComponent;
              // If the panels are not required then, we are directly putting the panel gen status as COMPLETED
              docketBundleEntity.createdUser = req.username;
              docketBundleEntity.panelGenStatus = this.NEED_PANELS ? DocPanelGenStatusEnum.INPROGRESS : DocPanelGenStatusEnum.COMPLETED;
              const startNumber = sizeComponentReqQtyMap.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).get(eachComponent.refComponent)[0];
              const endNumber = startNumber + (docketDetails.plies - 1);
              docketBundleEntity.panelStartNumber = startNumber;
              docketBundleEntity.panelEndNumber = endNumber;
              sizeComponentReqQtyMap.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).get(eachComponent.refComponent)[0] = endNumber + 1;
              docketBundleEntity.poSerial = req.poSerial;
              docketBundleEntity.quantity = docketDetails.plies;
              docketBundleEntity.size = eachSize.size;
              docketBundleEntity.unitCode = unitCode;
              docketBundleEntity.docketNumber = req.docketNumber;
              docketBundleEntity.productName = eachRatioLine.productName;
              docBundleEntities.push(docketBundleEntity);
              // await manager.getRepository(PoDocketBundleEntity).update({id: bundleDetails.id}, {bundleNumber: bundleDetails.id})
            }
          }
        }
        const bundleDetails = await manager.getRepository(PoDocketBundleEntity).save(docBundleEntities, { reload: false });
        // free the memory for last iteration
        docBundleEntities = null;
      }
      if (this.NEED_PANELS) {
        // Do not update the docket confirmation status. We need to update it after panel generation
        await manager.getRepository(PoDocketEntity).update({ docketNumber: req.docketNumber, unitCode, companyCode }, { bundleGenStatus: DocBundleGenerationStatusEnum.COMPLETED });
      } else {
        // Now since we no longer generate the bundles for the docket, move the cut confirmation status for the docket to DONE
        await manager.getRepository(PoDocketEntity).update({ docketNumber: req.docketNumber, unitCode, companyCode }, { bundleGenStatus: DocBundleGenerationStatusEnum.COMPLETED, docketConfirmation: DocConfirmationStatusEnum.CONFIRMED });
      };
      await this.assignProductSubLineQtyToDocketBundles(req.docketNumber, unitCode, companyCode, req.username, manager);
      await manager.completeTransaction();
      await lock ? lock.unlock() : null;
      // Callsthe panels generation only if the PANELS_GENERATION is configured by the business
      if (this.NEED_PANELS) {
        const docketBundleDetails = await this.poDocBundleRepo.find({ where: { docketNumber: req.docketNumber, unitCode, companyCode, isActive: true } });
        for (const eachBundle of docketBundleDetails) {
          const jobReq = new DocBundlePanelsRequest(eachBundle.createdUser, unitCode, companyCode, req.userId, eachBundle.id, eachBundle.poSerial, eachBundle.component, eachBundle.docketNumber, null, eachBundle.color, productName, eachBundle.bundleNumber?.toString(), [eachBundle.panelStartNumber, eachBundle.panelEndNumber]);
          await this.helperService.addDocketPanelGeneration(jobReq);
        }
      }
      // now trigger the job for the cut number generation for the po serial
      const poSerialReq = new PoSerialRequest(req.username, req.unitCode, req.companyCode, req.userId, req.poSerial, 0, false, false);
      // await this.helperService.addJobForCutNumberGeneration(poSerialReq);
      return new GlobalResponseObject(true, 0, 'Docket bundles has been generated successfully');
    } catch (err) {
      if (lock) {
        await lock.unlock();
      }
      checkFlag ? await this.updateDocketBundleGenStatus(req.docketNumber, unitCode, companyCode, DocBundleGenerationStatusEnum.OPEN) : null;
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
  * Service to update the docket bundle generation status
   * @param docketNumber 
   * @param unitCode 
   * @param companyCode 
   * @param bundleGenStatus 
   * @returns 
  */
  async updateDocketBundleGenStatus(docketNumber: string, unitCode: string, companyCode: string, bundleGenStatus: DocBundleGenerationStatusEnum) {
    return await this.poDocketRepo.update({ docketNumber: docketNumber, unitCode, companyCode }, { bundleGenStatus })
  }

  /**
   * BULL JOB: CPS_PO_DOC_SER_GEN
   * Service to create po docket serial details for given product name, fg color, sizes and those components  
   * @returns 
  */
  async createPoDocketSerialDetails(req: PoSerialRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource)
    try {
      // check if the serial numbers were alreay generated for the po_serial
      const poDocSerialRec = await this.poDocketSerialRepo.findOne({ select: ['id'], where: { poSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode, entityType: PhysicalEntityTypeEnum.PLANNED } });
      if (poDocSerialRec) {
        throw new ErrorResponse(0, 'Po docket serials are already created');
      }
      const fabricAnsSizeDetailsOfPo = await this.helperService.getPoProdTypeAndFabricsAndItsSizes(req);
      const productFgColorMap = new Map<string, Map<string, CutRmModel[]>>();
      for (const eachProductName of fabricAnsSizeDetailsOfPo.data) {
        if (!productFgColorMap.has(eachProductName.productName)) {
          productFgColorMap.set(eachProductName.productName, new Map<string, CutRmModel[]>());
        };
        if (!productFgColorMap.get(eachProductName.productName).has(eachProductName.color)) {
          productFgColorMap.get(eachProductName.productName).set(eachProductName.color, []);
        };
        productFgColorMap.get(eachProductName.productName).get(eachProductName.color).push(...eachProductName.iCodes);
      }
      await manager.startTransaction();
      for (const [eachProductName, fgColorDetails] of productFgColorMap) {
        for (const [fgColor, iCodes] of fgColorDetails) {
          const componentNames = new Set<string>();
          iCodes.forEach((eachICode) => {
            componentNames.add(eachICode.refComponent);
            // return eachICode.components.forEach((component) => {
            //   componentNames.add(component);
            // });
          });
          const docketSerialEnts: PoDocketSerialsEntity[] = [];
          // for (const eachColor of fgColors) {
          const sizes = new Set<string>();
          iCodes.forEach((eachICode) => {
            return eachICode.sizeWiseRmProps.forEach((size) => {
              sizes.add(size.size);
            });
          });
          for (const eachSize of sizes) {
            for (const eachComponent of componentNames) {
              const poSerialEntity = new PoDocketSerialsEntity();
              poSerialEntity.color = fgColor;
              poSerialEntity.companyCode = req.companyCode;
              poSerialEntity.component = eachComponent;
              poSerialEntity.createdUser = req.username;
              poSerialEntity.lastPanelNumber = 0;
              poSerialEntity.poSerial = req.poSerial;
              poSerialEntity.productName = eachProductName;
              poSerialEntity.size = eachSize;
              poSerialEntity.unitCode = req.unitCode;
              poSerialEntity.entityType = PhysicalEntityTypeEnum.PLANNED;
              docketSerialEnts.push(poSerialEntity);
            }
            // }
          }
          await manager.getRepository(PoDocketSerialsEntity).save(docketSerialEnts, { reload: false });
          // now change the entity type to Actual and save it again
          docketSerialEnts.forEach(r => r.entityType = PhysicalEntityTypeEnum.ACTUAL);
          await manager.getRepository(PoDocketSerialsEntity).save(docketSerialEnts, { reload: false });
          // now save the po component serials for the product name and the component name
          const poCompSerials: PoComponentSerialsEntity[] = [];
          for (const eachComponent of componentNames) {
            const poSerialEntity = new PoComponentSerialsEntity();
            poSerialEntity.companyCode = req.companyCode;
            poSerialEntity.unitCode = req.unitCode;
            poSerialEntity.poSerial = req.poSerial;
            poSerialEntity.productName = eachProductName;
            poSerialEntity.lastPanelNumber = 0;
            poSerialEntity.component = eachComponent;
            poSerialEntity.entityType = PhysicalEntityTypeEnum.PLANNED;
            poSerialEntity.fgColor = fgColor;
            poCompSerials.push(poSerialEntity);
          }
          await manager.getRepository(PoComponentSerialsEntity).save(poCompSerials, { reload: false });
          // now change the entity type to Actual and save it again
          poCompSerials.forEach(r => r.entityType = PhysicalEntityTypeEnum.ACTUAL);
          await manager.getRepository(PoComponentSerialsEntity).save(poCompSerials, { reload: false });
        }

      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'PO Docket Serial numbers saved successfully.')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * CURRENTLY NOT CALLED FOR NORLANKA
   * Will be called only if the **PANELS_GENERATION** is configured in the app config for the business
   * MODIFICATION: To be modified to genrate the panels for all the compoents under a single DB
   * This is called from generateDocketBundles()
   * BULL JOB: CPS_DOC_BUN_PANEL_GEN
   * @param req 
   * @returns 
  */
  async generatePanelsForDocBundle(req: DocBundlePanelsRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource)
    const unitCode = req.unitCode; const companyCode = req.companyCode;
    let lock = null;
    try {
      // simply create the panels for the docket bundle based on the panel numbers provided in the request
      // after panels are created, update the panel_gen_status to COMPLETED
      // Once if all the docket bundles under a docket are panel_gen_status COMPLETED, then update the doc_confirmation = COMPLETED for the docket
      const docketBundleDetails = await this.poDocBundleRepo.findOne({ where: { id: req.bundleId, unitCode, companyCode, poSerial: req.poSerial, isActive: true } });
      if (!docketBundleDetails) {
        throw new ErrorResponse(0, 'DOcket bundle details not found for the given details. Please check and try again')
      }
      if (docketBundleDetails.panelGenStatus != DocPanelGenStatusEnum.INPROGRESS) {
        throw new ErrorResponse(0, 'Docket panels are already generated / not yet triggered. Please check and try again')
      }
      const docketPanelsInfo = await this.poDocPanelRepo.find({ where: { bundleNumber: Number(req.bundleNumber), unitCode, companyCode, isActive: true, poSerial: req.poSerial, component: req.componentName, docketNumber: req.docketNumber } });
      if (docketPanelsInfo.length > 0) {
        throw new ErrorResponse(0, 'Docket panels are already generated for given docket bundle. Please check and try again');
      }
      //  generate the panels only if configured for the business
      if (this.NEED_PANELS) {
        const docketBundlePslDetails: PoDocketBundlePslEntity[] = await this.docBundlePslRepo.find({ where: { bundleNumber: docketBundleDetails.bundleNumber, docketNumber: req.docketNumber, unitCode, companyCode } });
        const dcpEntities: PoDocketPanelEntity[] = [];
        await manager.startTransaction();
        for (let eachPanel = req.panelNumbers[0]; eachPanel <= req.panelNumbers[1]; eachPanel++) {
          const panelEntity = new PoDocketPanelEntity();
          panelEntity.bundleNumber = Number(req.bundleNumber);
          panelEntity.companyCode = companyCode;
          panelEntity.component = req.componentName;
          panelEntity.createdUser = req.username;
          panelEntity.cutReported = false;
          panelEntity.docketNumber = req.docketNumber;
          panelEntity.panelNumber = eachPanel;
          panelEntity.poSerial = req.poSerial;
          panelEntity.unitCode = unitCode;
          panelEntity.size = docketBundleDetails.size;
          panelEntity.pslId = null;
          dcpEntities.push(panelEntity);
        };
        for (const eachPslMap of docketBundlePslDetails) {
          let remainingQty = eachPslMap.quantity;
          while (remainingQty > 0) {
            for (const eachPanelEntity of dcpEntities) {
              if (!eachPanelEntity.pslId && remainingQty > 0) {
                eachPanelEntity.pslId = eachPslMap.pslId;
                remainingQty--;
              }
            };
            if (remainingQty > 0) {
              throw new ErrorResponse(0, `Doc bundle PLS Qty does not match with panels generated. Please check and try again remaining Qty is ${remainingQty}`)
            }
          }

        }
        await manager.getRepository(PoDocketPanelEntity).save(dcpEntities, { reload: false });
      }
      await manager.getRepository(PoDocketBundleEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, poSerial: req.poSerial, id: docketBundleDetails.id }, { panelGenStatus: DocPanelGenStatusEnum.COMPLETED });
      await manager.completeTransaction();
      // NEED TO CHECK ALL THE DOCKET BUNDLES FOR THE GIVEN DOCKET NUMBER HAS BEEN PROCESSED MEANS PANELS GENERATED.
      const lockPoSerial = `LOCK_DOC_CONFIRM:${req.docketNumber}-${req.unitCode}-${req.companyCode}`;
      var ttl = 120000;
      lock = await redlock.lock(lockPoSerial, ttl);
      const pendingDocBundles = await this.poDocBundleRepo.count({ where: { docketNumber: req.docketNumber, unitCode, companyCode, panelGenStatus: Not(DocPanelGenStatusEnum.COMPLETED) } });
      if (pendingDocBundles == 0) {
        await this.poDocketRepo.update({ docketNumber: req.docketNumber, unitCode, companyCode }, { docketConfirmation: DocConfirmationStatusEnum.CONFIRMED });
      }
      await lock.unlock();

      return new GlobalResponseObject(true, 0, 'Docket Panels Generated Successfully.');
    } catch (err) {
      lock ? await lock.unlock() : null;
      await manager.releaseTransaction();
      throw err;
    }
  }

  async deleteDockets(req: PoRatioIdRequest): Promise<GlobalResponseObject> {
    const unitCode = req.unitCode; const companyCode = req.companyCode;
    const manager = new GenericTransactionManager(this.dataSource);
    let checkFlag = false;
    try {
      // check if any of the dockets in the RATIO has doc_confirmation != OPEN
      // lock the whole PO for docket generation / docket confirmation / docket deletion
      // delete the dockets only if the panelGenStatus is OPEN for all bundles for the dockets in the ratio
      // Once deleted, then updte the doc gen status in the OES against to the ratio accordingly.
      // check if any of the dockets in the PO has doc_confirmation != OPEN
      const docketDetailsForPo = await this.poDocketRepo.find({ select: ['id'], where: { poSerial: req.poSerial, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.INPROGRESS } });
      if (docketDetailsForPo.length > 0) {
        throw new ErrorResponse(0, 'Docket confirmation is still in progress. Please wait and try again');
      }
      const compOrInprogressDockets = await this.poDocketRepo.find({ where: { docketConfirmation: Not(DocConfirmationStatusEnum.OPEN), unitCode, companyCode, poSerial: req.poSerial, poRatioId: req.poRatioId } });
      if (compOrInprogressDockets.length > 0) {
        throw new ErrorResponse(0, 'Dockets are already confirmed.Please un confirm and try again.');
      }
      const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(req);
      const currentRatio: PoRatioModel = ratioInfo[0];
      if (currentRatio.docGenStatus != DocGenStatusEnum.COMPLETED) {
        throw new ErrorResponse(0, 'Docket generation not yet generated for the given ratio. Please check')
      };
      const updateReq1 = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.INPROGRESS);
      await this.helperService.updateDocGenStatusByRatioId(updateReq1);
      checkFlag = true;
      await manager.startTransaction();
      const docketInfo = await this.poDocketRepo.find({ select: ['docketNumber'], where: { poRatioId: req.poRatioId, unitCode, companyCode } });
      const docketNumbers = docketInfo.map(doc => doc.docketNumber);
      await manager.getRepository(PoDocketAttrEntity).delete({ docketNumber: In([...docketNumbers]) });
      await manager.getRepository(PoDocketGroupEntity).delete({ poRatioId: req.poRatioId, unitCode, companyCode });
      await manager.getRepository(PoDocketEntity).delete({ poRatioId: req.poRatioId, unitCode, companyCode });
      await manager.getRepository(PoRatioAttrEntity).delete({ poRatioId: req.poRatioId });
      await manager.completeTransaction();
      const updateReq = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.OPEN);
      await this.helperService.updateDocGenStatusByRatioId(updateReq);
      return new GlobalResponseObject(true, 0, 'Dockets has been deleted successfully')
    } catch (err) {
      await manager.releaseTransaction();
      if (checkFlag) {
        const updateReq = new RatioDocGenStatusRequest(req.username, req.unitCode, companyCode, req.userId, req.poSerial, req.poRatioId, DocGenStatusEnum.COMPLETED);
        await this.helperService.updateDocGenStatusByRatioId(updateReq);
      }
      throw err;
    }
  }

  /**
   * This will be directly called from the UI
   * Service to confirm the dockets
   * @param req 
  */
  async confirmDockets(req: PoProdutNameRequest): Promise<GlobalResponseObject> {
    const unitCode = req.unitCode;
    const companyCode = req.companyCode;
    const docketIds = new Set<number>();
    let checkFlag = false;
    try {
      // Ensure no docket generation/ docket deletion is in progress
      // lock the whole PO for docket generation / docket confirmation / docket deletion
      // change the status of all dockets to confirmationStatus in progress
      // claculate the panel numbers of the docket => docket bundle
      // updtae the po serial table
      // update the panel_gen_status for all docket bundles to IN_PROGRESS
      // trigger a seperate job for every bundle to create the panels
      const docketDetailsForPo = await this.poDocketRepo.find({ select: ['id'], where: { poSerial: req.poSerial, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.INPROGRESS } });
      if (docketDetailsForPo.length > 0) {
        throw new ErrorResponse(0, 'Docket confirmation is still in progress. Please wait and try again');
      }
      // check if the op version is saved for the po
      await this.helperService.getOpVersionsForPo(req.poSerial, req.productName, req.styleName, req.fgColor, companyCode, unitCode);

      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.OPEN } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      const dockets = new Set<string>();
      for (const docketInfo of docketDetailsByPoProd) {
        if (docketInfo.docketConfirmation != DocConfirmationStatusEnum.OPEN) {
          throw new ErrorResponse(0, 'Dockets already already confirmed for the given po and product name. Please check and try again')
        }
        docketIds.add(docketInfo.id);
        dockets.add(docketInfo.docketNumber);
      }
      const ratioIds = new Set<number>();
      docketDetailsByPoProd.forEach((eachDoc) => {
        ratioIds.add(eachDoc.poRatioId);
      });
      for (const ratioId of ratioIds) {
        const reqObj = new PoRatioIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.poSerial, ratioId);
        const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
        const currentRatio = ratioInfo[0];
        if (currentRatio.docGenStatus != DocGenStatusEnum.COMPLETED) {
          throw new ErrorResponse(0, 'Docket generation not completed for some of the ratios. Please check and try again')
        }
      }
      // Need to update the dockets confirmation status to confirm before generating bundles / panels
      await this.poDocketRepo.update({ id: In([...docketIds]) }, { docketConfirmation: DocConfirmationStatusEnum.INPROGRESS });
      checkFlag = true;
      // NEED TO TRIGGER A JOB FOR DOCKET CONFIRMATION
      await this.helperService.addDocketConfirmation(req);
      // trigger the job for emb job generation
      for (const docket of dockets) {
        await this.helperService.addEmbRequestGenJob(req.poSerial, docket, req.companyCode, req.unitCode, req.username);
      }
      return new GlobalResponseObject(true, 0, 'Dockets Confirmed successfully');
    } catch (err) {
      throw err;
    }
  }

  /**
   * This method will ve called after the user click the docketConfirmation and once we validate all the requirements then this will be triggered
   * BULL JOB: CPS_DOC_CON
   * triggered by confirmDockets()
   * Confirms the dockets
   * @param req 
   * @returns 
   */
  async docketConfirmation(req: PoProdutNameRequest): Promise<GlobalResponseObject> {
    const unitCode = req.unitCode;
    const companyCode = req.companyCode;
    let lock = null;
    const manager = new GenericTransactionManager(this.dataSource);
    try {
      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.INPROGRESS } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      for (const docketInfo of docketDetailsByPoProd) {
        if (docketInfo.docketConfirmation != DocConfirmationStatusEnum.INPROGRESS) {
          throw new ErrorResponse(0, 'Should validate all the requirements. Please check and try again')
        }
      }
      // NEED TO TRIGGER A JOB FOR EACH DOCKET TO GENERATE DOCKET BUNDLES
      // MAP: PRODUCT_NAME -> FG_COLOR -> SIZE -> COMPONENT -> QTY
      const sizeComponentReqQtyMap = new Map<number, Map<string, Map<string, Map<string, number>>>>();
      const ratioCompMap = new Map<number, Map<string, Map<string, Set<string>>>>();
      const ratioIds = new Set<number>();
      docketDetailsByPoProd.forEach((eachDoc) => {
        ratioIds.add(eachDoc.poRatioId);
      });
      // product -> fg color -> size -> fabric code -> qty
      const productFgColor = new Map<string, Map<string, Map<string, Map<string, number>>>>();
      const productFgColorSizePslbMap = new Map<string, Map<string, Map<string, Set<number>>>>();
      const itemCodesInvolved = new Map<string, Map<string, Set<string>>>();
      const allItemCodes = new Set<string>();
      for (const ratioId of ratioIds) {
        if (!ratioCompMap.has(ratioId)) {
          ratioCompMap.set(ratioId, new Map<string, Map<string, Set<string>>>());
        }
        if (!sizeComponentReqQtyMap.has(ratioId)) {
          sizeComponentReqQtyMap.set(ratioId, new Map<string, Map<string, Map<string, number>>>());
        }
        const reqObj = new PoRatioIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.poSerial, ratioId);
        const ratioInfo = await this.helperService.getRatioDetailedInfoForRatioId(reqObj);
        const currentRatio = ratioInfo[0];
        if (currentRatio.docGenStatus != DocGenStatusEnum.COMPLETED) {
          throw new ErrorResponse(0, 'Docket generation not completed for some of the ratios. Please check and try again')
        }
        for (const eachRatioLine of currentRatio.rLines) {
          if (!ratioCompMap.get(ratioId).has(eachRatioLine.productName)) {
            ratioCompMap.get(ratioId).set(eachRatioLine.productName, new Map<string, Set<string>>())
          };
          if (!ratioCompMap.get(ratioId).get(eachRatioLine.productName).has(eachRatioLine.color)) {
            ratioCompMap.get(ratioId).get(eachRatioLine.productName).set(eachRatioLine.color, new Set<string>());
            for (const eachFab of eachRatioLine.ratioFabric) {
              const poItemFabricReq = new PoItemProductModel(req.username, unitCode, companyCode, req.userId, req.poSerial, eachFab.iCode, eachRatioLine.productName, eachRatioLine.color)
              const refCompInfo = await this.poMaterialService.getRefComponentForPoAndFabric(poItemFabricReq);
              if (!refCompInfo.status) {
                throw new ErrorResponse(0, `OES Says ${refCompInfo.internalMessage}`)
              };
              ratioCompMap.get(ratioId).get(eachRatioLine.productName).get(eachRatioLine.color).add(refCompInfo.data.refComponent);
            }
          }
          if (!sizeComponentReqQtyMap.get(ratioId).has(eachRatioLine.productName)) {
            sizeComponentReqQtyMap.get(ratioId).set(eachRatioLine.productName, new Map<string, Map<string, number>>());
          }
          if (!sizeComponentReqQtyMap.get(ratioId).get(eachRatioLine.productName).has(eachRatioLine.color)) {
            sizeComponentReqQtyMap.get(ratioId).get(eachRatioLine.productName).set(eachRatioLine.color, new Map<string, number>());
          }
          for (const eachSize of eachRatioLine.sizeRatios) {
            if (!productFgColor.has(eachRatioLine.productName)) {
              productFgColor.set(eachRatioLine.productName, new Map<string, Map<string, Map<string, number>>>());
              productFgColorSizePslbMap.set(eachRatioLine.productName, new Map<string, Map<string, Set<number>>>());
              itemCodesInvolved.set(eachRatioLine.productName, new Map<string, Set<string>>());
            }
            if (!productFgColor.get(eachRatioLine.productName).has(eachRatioLine.color)) {
              productFgColor.get(eachRatioLine.productName).set(eachRatioLine.color, new Map<string, Map<string, number>>());
              productFgColorSizePslbMap.get(eachRatioLine.productName).set(eachRatioLine.color, new Map<string, Set<number>>());
              itemCodesInvolved.get(eachRatioLine.productName).set(eachRatioLine.color, new Set<string>())
            }
            if (!productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).has(eachSize.size)) {
              productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).set(eachSize.size, new Map<string, number>());
              productFgColorSizePslbMap.get(eachRatioLine.productName).get(eachRatioLine.color).set(eachSize.size, new Set<number>());
            }

            for (const eachFab of eachRatioLine.ratioFabric) {
              itemCodesInvolved.get(eachRatioLine.productName).get(eachRatioLine.color).add(eachFab.iCode);
              allItemCodes.add(eachFab.iCode);
              if (!productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).has(eachFab.iCode)) {
                productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).set(eachFab.iCode, 0);
              };
              const preQty = productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).get(eachFab.iCode);
              productFgColor.get(eachRatioLine.productName).get(eachRatioLine.color).get(eachSize.size).set(eachFab.iCode, preQty + (eachSize.ratio * eachRatioLine.ratioPlies));
            }
            if (!sizeComponentReqQtyMap.get(ratioId).get(eachRatioLine.productName).get(eachRatioLine.color).has(eachSize.size)) {
              sizeComponentReqQtyMap.get(ratioId).get(eachRatioLine.productName).get(eachRatioLine.color).set(eachSize.size, eachSize.ratio)
            }
          }
        }
      };

      const pslbIdsSet = new Set<number>();
      for (const [productName, fgColorInfo] of productFgColor) {
        for (const [fgColor, sizeInfo] of fgColorInfo) {
          for (const [size, qty] of sizeInfo) {
            // Need to get the PSL info for that PO serials for that one need to have mo number + fg color + size
            const pslInfo = await this.pslRepo.find({ where: { productName, color: fgColor, size, unitCode, companyCode }, select: ['pslId'] });
            for (const psl of pslInfo) {
              pslbIdsSet.add(psl.pslId);
              // productFgColorSizePslbMap.get(productName).get(fgColor).get(size).add(psl.pslId);
            }
          }
        }
      };
      // console.log(util.inspect(productFgColorSizePslbMap, false, null, true));
      const poReqPslReq = new PO_C_PoSerialPslIdsRequest(null, unitCode, companyCode, null, req.poSerial, Array.from(pslbIdsSet));
      const pslbBundlesInfo = await this.helperService.getPslBundlesForPoSerial(poReqPslReq);
      if (!pslbBundlesInfo.status) {
        throw new ErrorResponse(0, `OES Says ${pslbBundlesInfo.internalMessage}`)
      };
      const pslbBundleActInfo = pslbBundlesInfo.data;
      const docPslEntities: PoDocketPslEntity[] = [];

      // Actual quantities map
      const pslQtyMap = new Map<number, number>();
      for (const eachBundleInfo of pslbBundleActInfo) {
        for (const eachBundle of eachBundleInfo.bundles) {
          if (!pslQtyMap.has(eachBundle.pslId)) {
            pslQtyMap.set(eachBundle.pslId, 0)
          };
          const preQty = pslQtyMap.get(eachBundle.pslId);
          pslQtyMap.set(eachBundle.pslId, preQty + eachBundle.bundleQty);
          const pslInfo = await this.pslRepo.findOne({ where: { pslId: eachBundle.pslId, unitCode, companyCode } });
          if (productFgColorSizePslbMap.has(pslInfo.productName)) {
            if (productFgColorSizePslbMap.get(pslInfo.productName).has(pslInfo.color)) {
              if (productFgColorSizePslbMap.get(pslInfo.productName).get(pslInfo.color).has(pslInfo.size)) {
                productFgColorSizePslbMap.get(pslInfo.productName).get(pslInfo.color).get(pslInfo.size).add(pslInfo.pslId);
              }
            }
          }
        }
      };

      // MAP: product_name -> fg_color -> size -> component -> panel numbers
      // TODO: OPTIMIZE
      const docketDetailsToGenerateBundles: PoDocketNumberRequest[] = [];
      const lockPoSerial = `LOCK_PO_DOC_SERIAL_UPDATE:${req.poSerial}-${req.unitCode}-${req.companyCode}`;
      var ttl = 300000;
      lock = await redlock.lock(lockPoSerial, ttl);
      // occupied qty of map
      // PSLB ID -> ITEM CODE -> QTY
      const pslbIdOccupiedQtyMap = new Map<number, Map<string, number>>();
      for (const eachPslb of pslbIdsSet) {
        if (!pslbIdOccupiedQtyMap.has(eachPslb)) {
          pslbIdOccupiedQtyMap.set(eachPslb, new Map<string, number>())
        }
        for (const itemCode of allItemCodes) {
          const docPslbInfo = await this.docPslRepo.find({ where: { pslId: eachPslb, unitCode, companyCode, subProcessName: itemCode } });
          const occupiedQty = docPslbInfo.reduce((pre, cur) => {
            return pre + Number(cur.quantity);
          }, 0);
          pslbIdOccupiedQtyMap.get(eachPslb).set(itemCode, occupiedQty);
        }

      };

      // available qty map 
      // PSLB ID -> ITEM CODE -> QTY
      const pslbIdAvailableQtyMap = new Map<number, Map<string, number>>();
      for (const [pslb, actQty] of pslQtyMap) {
        if (!pslbIdAvailableQtyMap.has(pslb)) {
          pslbIdAvailableQtyMap.set(pslb, new Map<string, number>())
        }
        const pslbOccupiedQtyInfo = pslbIdOccupiedQtyMap.get(pslb);
        for (const [itemCode, qty] of pslbOccupiedQtyInfo) {
          if (!pslbIdAvailableQtyMap.get(pslb).has(itemCode)) {
            pslbIdAvailableQtyMap.get(pslb).set(itemCode, (actQty - qty));
          }
        }
      };

      // validating docket generating quantities with the sub line quantities
      for (const [productName, fgColorInfo] of productFgColorSizePslbMap) {
        for (const [fgColor, sizeInfo] of fgColorInfo) {
          for (const [size, pslbIds] of sizeInfo) {
            for (const eachItemCode of itemCodesInvolved.get(productName).get(fgColor)) {
              let totalPslbAvilableQty = 0;
              // console.log(pslbIds, eachItemCode);
              for (const eachPslb of pslbIds) {
                totalPslbAvilableQty += pslbIdAvailableQtyMap.get(eachPslb)?.get(eachItemCode) ?? 0;
              };
              const totalReqQty = productFgColor.get(productName).get(fgColor).get(size).get(eachItemCode);
              if (totalReqQty > totalPslbAvilableQty) {
                // throw new ErrorResponse(0, `No available PSLB Qty found for the Product ${productName} AND FG Color ${fgColor} AND Size ${size}; Total Required Qty is ${totalReqQty} But Total Available qty is ${totalPslbAvilableQty}`);
              }
            }

          }
        }
      };

      await manager.startTransaction();
      for (const eachDocket of docketDetailsByPoProd) {
        const sizeCompInfo: SizeCompPanelInfo[] = [];
        const ratioId = eachDocket.poRatioId;
        const sizeRatioDetails: Map<string, number> = sizeComponentReqQtyMap.get(ratioId).get(eachDocket.productName).get(eachDocket.color);
        const components = ratioCompMap.get(ratioId).get(eachDocket.productName).get(eachDocket.color);
        for (const [size, ratio] of sizeRatioDetails) {
          for (const eachComp of components) {
            // INDEX MODIFICATION
            // Need to get size and component wise panel start number and end number for each and every docket 
            const sizeCompSerialData = await manager.getRepository(PoDocketSerialsEntity).findOne({ where: { poSerial: req.poSerial, productName: eachDocket.productName, size: size, color: eachDocket.color, component: eachComp, entityType: PhysicalEntityTypeEnum.PLANNED } });
            if (!sizeCompSerialData) {
              throw new ErrorResponse(0, `PO docket component serial data not found for the details ${req.poSerial} - ${eachDocket.productName} -  ${size} - ${eachDocket.color} - ${eachComp}`)
            }
            const qty = ratio * eachDocket.plies;
            const startPanelNumber = sizeCompSerialData.lastPanelNumber + 1;
            const endPanelNumber = startPanelNumber + (qty - 1);
            const sizeCompDetails = new SizeCompPanelInfo(eachDocket.productName, eachDocket.color, size, eachComp, startPanelNumber, endPanelNumber);
            sizeCompInfo.push(sizeCompDetails);
            await manager.getRepository(PoDocketSerialsEntity).update({ id: sizeCompSerialData.id }, { lastPanelNumber: endPanelNumber });
          };
          // Need to populate PoDocketPslEntity based on filling logic 
          // Need to get the pslb details for that product + fg color + each size 
          // Need to get already assigned qty of that pslb id
          // Need to get the available bundles to assign to docket 
          // Need to assign Product sub lines to these dockets
          const pslbDetails = productFgColorSizePslbMap.get(eachDocket.productName).get(eachDocket.color).get(size);
          let sizeQty = ratio * eachDocket.plies;
          while (sizeQty > 0) {
            let allocated = false;

            for (const eachPslb of pslbDetails) {
              const remainingQtyOfPslb = pslbIdAvailableQtyMap.get(eachPslb)?.get(eachDocket.itemCode) ?? 0;

              if (remainingQtyOfPslb > 0 && sizeQty > 0) {
                const allowableQty = Math.min(remainingQtyOfPslb, sizeQty);
                const docPslEntity = new PoDocketPslEntity();
                docPslEntity.bundleQuantity = allowableQty;
                docPslEntity.companyCode = companyCode;
                docPslEntity.createdUser = req.username;
                docPslEntity.docketNumber = eachDocket.docketNumber;
                docPslEntity.poSerial = req.poSerial;
                docPslEntity.pslId = eachPslb;
                docPslEntity.quantity = allowableQty;
                docPslEntity.unitCode = unitCode;
                docPslEntity.subProcessName = eachDocket.itemCode;

                docPslEntities.push(docPslEntity);
                pslbIdAvailableQtyMap.get(eachPslb)?.set(eachDocket.itemCode, remainingQtyOfPslb - allowableQty);
                sizeQty -= allowableQty;
                allocated = true;

                if (sizeQty <= 0) break; // Allocation complete
              }
            }
            // If not allocated in the loop, assign remaining to the last PSLB
            if (!allocated && sizeQty > 0) {
              const lastPslbId = Array.from(pslbDetails)[pslbDetails.size - 1];
              const docPslEntity = new PoDocketPslEntity();
              docPslEntity.bundleQuantity = sizeQty;
              docPslEntity.companyCode = companyCode;
              docPslEntity.createdUser = req.username;
              docPslEntity.docketNumber = eachDocket.docketNumber;
              docPslEntity.poSerial = req.poSerial;
              docPslEntity.pslId = lastPslbId;
              docPslEntity.quantity = sizeQty;
              docPslEntity.unitCode = unitCode;
              docPslEntity.subProcessName = eachDocket.itemCode;

              docPslEntities.push(docPslEntity);

              const existingQty = pslbIdAvailableQtyMap.get(lastPslbId)?.get(eachDocket.itemCode) ?? 0;
              pslbIdAvailableQtyMap.get(lastPslbId)?.set(eachDocket.itemCode, existingQty - sizeQty);

              sizeQty = 0;
            }
          }
        }
        const jobReq = new PoDocketNumberRequest(req.username, unitCode, companyCode, req.userId, req.poSerial, eachDocket.docketNumber, false, false, sizeCompInfo);
        docketDetailsToGenerateBundles.push(jobReq);
      }
      await manager.getRepository(PoDocketPslEntity).save(docPslEntities);
      await manager.completeTransaction();
      if (lock) {
        await lock.unlock();
      }
      for (const eachDocketInfo of docketDetailsToGenerateBundles) {
        await this.helperService.addDocketBundleGeneration(eachDocketInfo);
      }
      return new GlobalResponseObject(true, 0, 'Dockets Confirmed successfully');
    } catch (err) {
      if (lock) {
        await lock.unlock()
      }
      await manager.releaseTransaction();
      throw err;
    }
  };

  /**
   * Service to assign bundles to docket 
   * Usually calls after the dockets has been confirmed in the system
   * Its stand by function not using now
   * @param docketNumber 
   * @param unitCode 
   * @param companyCode 
   * @param userName 
   * @returns 
  */
  async assignProductSubLineQtyToDocket(docketNumber: string, unitCode: string, companyCode: string, userName: string): Promise<GlobalResponseObject> {
    let lock = null;
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const docketDetails = await this.poDocketRepo.findOne({ where: { docketNumber, unitCode, companyCode }, select: ['id', 'docketConfirmation', 'poSerial', 'createdUser', 'docketNumber'] });
      if (!docketDetails) {
        throw new ErrorResponse(0, 'Docket Details not found. Please check and try again')
      };
      if (!docketDetails.docketConfirmation) {
        throw new ErrorResponse(0, 'Docket Not Yet Confirmed. Please check and try again');
      };
      const poSerial = docketDetails.poSerial;
      // product -> fg color -> qty
      const productFgColor = new Map<string, Map<string, Map<string, number>>>();
      const productFgColorSizePslbMap = new Map<string, Map<string, Map<string, Set<number>>>>();
      const productFgColorSizeDocBundleMap = new Map<string, Map<string, Map<string, PoDocketBundleEntity[]>>>()
      const docketBundleInfo = await this.poDocBundleRepo.find({ where: { docketNumber: docketDetails.docketNumber, unitCode, companyCode } });
      for (const eachBundle of docketBundleInfo) {
        if (!productFgColor.has(eachBundle.productName)) {
          productFgColor.set(eachBundle.productName, new Map<string, Map<string, number>>());
          productFgColorSizePslbMap.set(eachBundle.productName, new Map<string, Map<string, Set<number>>>());
          productFgColorSizeDocBundleMap.set(eachBundle.productName, new Map<string, Map<string, PoDocketBundleEntity[]>>())
        }
        if (!productFgColor.get(eachBundle.productName).has(eachBundle.color)) {
          productFgColor.get(eachBundle.productName).set(eachBundle.color, new Map<string, number>());
          productFgColorSizePslbMap.get(eachBundle.productName).set(eachBundle.color, new Map<string, Set<number>>());
          productFgColorSizeDocBundleMap.get(eachBundle.productName).set(eachBundle.color, new Map<string, PoDocketBundleEntity[]>())
        }
        if (!productFgColor.get(eachBundle.productName).get(eachBundle.color).has(eachBundle.size)) {
          productFgColor.get(eachBundle.productName).get(eachBundle.color).set(eachBundle.size, 0);
          productFgColorSizePslbMap.get(eachBundle.productName).get(eachBundle.color).set(eachBundle.size, new Set<number>());
          productFgColorSizeDocBundleMap.get(eachBundle.productName).get(eachBundle.color).set(eachBundle.size, [])
        }
        const preQty = productFgColor.get(eachBundle.productName).get(eachBundle.color).get(eachBundle.size);
        productFgColor.get(eachBundle.productName).get(eachBundle.color).set(eachBundle.size, preQty + eachBundle.quantity);
        productFgColorSizeDocBundleMap.get(eachBundle.productName).get(eachBundle.color).get(eachBundle.size).push(eachBundle);
      };
      const pslbIdsSet = new Set<number>();
      for (const [productName, fgColorInfo] of productFgColor) {
        for (const [fgColor, sizeInfo] of fgColorInfo) {
          for (const [size, qty] of sizeInfo) {
            const pslInfo = await this.pslRepo.find({ where: { productName, color: fgColor, size, unitCode, companyCode }, select: ['pslId'] });
            for (const psl of pslInfo) {
              pslbIdsSet.add(psl.pslId);
              productFgColorSizePslbMap.get(productName).get(fgColor).get(size).add(psl.pslId);
            }
          }
        }
      };
      const poReqPslReq = new PO_C_PoSerialPslIdsRequest(docketDetails.createdUser, unitCode, companyCode, null, poSerial, Array.from(pslbIdsSet));
      const pslbBundlesInfo = await this.helperService.getPslBundlesForPoSerial(poReqPslReq);
      if (!pslbBundlesInfo.status) {
        throw new ErrorResponse(0, `OES Says ${pslbBundlesInfo.internalMessage}`)
      };
      const pslbBundleActInfo = pslbBundlesInfo.data;
      // Actual quantities map
      const pslQtyMap = new Map<number, number>();
      for (const eachBundleInfo of pslbBundleActInfo) {
        for (const eachBundle of eachBundleInfo.bundles) {
          if (!pslQtyMap.has(eachBundle.pslId)) {
            pslQtyMap.set(eachBundle.pslId, 0)
          };
          const preQty = pslQtyMap.get(eachBundle.pslId);
          pslQtyMap.set(eachBundle.pslId, preQty + eachBundle.bundleQty);
        }
      };
      // occupied qty of map
      const pslbIdOccupiedQtyMap = new Map<number, number>();
      for (const eachPslb of pslbIdsSet) {
        const docPslbInfo = await this.docPslRepo.find({ where: { pslId: eachPslb, unitCode, companyCode } });
        const occupiedQty = docPslbInfo.reduce((pre, cur) => {
          return pre + Number(cur.bundleQuantity);
        }, 0);
        pslbIdOccupiedQtyMap.set(eachPslb, occupiedQty);
      };
      // available qty map
      const pslbIdAvailableQtyMap = new Map<number, number>();
      for (const [pslb, actQty] of pslQtyMap) {
        const alreadyOccupiedQty = pslbIdOccupiedQtyMap.get(pslb);
        pslbIdAvailableQtyMap.set(pslb, actQty - (alreadyOccupiedQty ?? 0));
      }
      const docPslEntities: PoDocketPslEntity[] = [];
      const docBundlePslEntities: PoDocketBundlePslEntity[] = [];
      const lockPoSerial = `LOCK_PO_DOC_BUN_ASSIGN:${poSerial}-${unitCode}-${companyCode}`;
      var ttl = 300000;
      lock = await redlock.lock(lockPoSerial, ttl);
      for (const [productName, fgColorInfo] of productFgColor) {
        for (const [fgColor, sizeInfo] of fgColorInfo) {
          for (const [size, qty] of sizeInfo) {
            const pslbDetails = productFgColorSizePslbMap.get(productName).get(fgColor).get(size);
            let sizeQty = qty;
            while (sizeQty > 0) {
              for (const eachPslb of pslbDetails) {
                const remainingQtyOfPslb = pslbIdAvailableQtyMap.get(eachPslb);
                if (remainingQtyOfPslb > 0) {
                  const allowableQty = Math.min(remainingQtyOfPslb, sizeQty);
                  const docPslEntity = new PoDocketPslEntity()
                  docPslEntity.bundleQuantity = allowableQty;
                  docPslEntity.companyCode = companyCode;
                  docPslEntity.createdUser = userName;
                  docPslEntity.docketNumber = docketNumber;
                  docPslEntity.poSerial = poSerial;
                  docPslEntity.pslId = eachPslb;
                  docPslEntity.quantity = allowableQty;
                  docPslEntity.unitCode = unitCode;
                  docPslEntities.push(docPslEntity);
                  pslbIdAvailableQtyMap.set(eachPslb, remainingQtyOfPslb - allowableQty);
                  sizeQty -= allowableQty;
                  // Distributing this qty among the related bundles of the same docket + product + fg color + size;
                  const docBundles = productFgColorSizeDocBundleMap.get(productName)?.get(fgColor)?.get(size);
                  if (!docBundles) {
                    throw new ErrorResponse(0, `Docket bundles not found for the given product ${productName} AND FG Color ${fgColor} AND size ${size}`);
                  };
                  let totalDocPslbQty = allowableQty;
                  while (totalDocPslbQty > 0) {
                    for (const eachBundle of docBundles) {
                      const bundleAllowableQty = Math.min(totalDocPslbQty, eachBundle.quantity);
                      const docketBundlePslEntity = new PoDocketBundlePslEntity();
                      docketBundlePslEntity.bundleNumber = eachBundle.bundleNumber;
                      docketBundlePslEntity.companyCode = companyCode;
                      docketBundlePslEntity.createdUser = userName;
                      docketBundlePslEntity.docketNumber = docketNumber;
                      docketBundlePslEntity.poSerial = poSerial;
                      docketBundlePslEntity.pslId = eachPslb;
                      docketBundlePslEntity.quantity = bundleAllowableQty;
                      docketBundlePslEntity.unitCode = unitCode;
                      totalDocPslbQty -= bundleAllowableQty;
                      eachBundle.quantity -= bundleAllowableQty;
                      docBundlePslEntities.push(docketBundlePslEntity);
                    }
                    if (totalDocPslbQty > 0) {
                      throw new ErrorResponse(0, `Docket quantity not matches for the Product ${productName} AND FG Color ${fgColor} AND Size ${size} AND docket ${docketNumber} insufficient qty is ${totalDocPslbQty}`);
                    }
                  }
                }
                if (sizeQty > 0) {
                  break;
                  // throw new ErrorResponse(0, `No available PSLB Qty found for the Product ${productName} AND FG Color ${fgColor} AND Size ${size} AND docket ${docketNumber} insufficient qty is ${sizeQty}`)
                }
              }
            }
          }
        }
      }
      if (lock) {
        await lock.unlock();
      };
      await transManager.startTransaction();
      await transManager.getRepository(PoDocketBundlePslEntity).save(docBundlePslEntities);
      await transManager.getRepository(PoDocketPslEntity).save(docPslEntities);
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Docket and docket bundles to PSLB Mapping completed Successfully');
    } catch (err) {
      await transManager.releaseTransaction();
      if (lock) {
        await lock.unlock()
      }
      throw err;
    }
  };

  /**
  * Service to assign bundles to docket 
  * Usually calls after the dockets has been confirmed and bundles has been generated in the system
  * TODO: Should be bull job
  * @param docketNumber 
  * @param unitCode 
  * @param companyCode 
  * @param userName 
  * @returns 
 */
  async assignProductSubLineQtyToDocketBundles(docketNumber: string, unitCode: string, companyCode: string, userName: string, transManager: GenericTransactionManager): Promise<GlobalResponseObject> {
    try {
      const docketDetails = await this.poDocketRepo.findOne({ where: { docketNumber, unitCode, companyCode }, select: ['id', 'docketConfirmation', 'poSerial', 'createdUser', 'docketNumber'] });
      if (!docketDetails) {
        throw new ErrorResponse(0, 'Docket Details not found. Please check and try again')
      };
      if (!docketDetails.docketConfirmation) {
        throw new ErrorResponse(0, 'Docket Not Yet Confirmed. Please check and try again');
      };
      const docBundlePslEntities: PoDocketBundlePslEntity[] = [];
      const docPslMapDetails = await this.docPslRepo.find({ where: { docketNumber, unitCode, companyCode } });
      const docketBundlesInfo = await transManager.getRepository(PoDocketBundleEntity).find({ where: { docketNumber, unitCode, companyCode } });
      const sizeWiseDodPslMap = new Map<string, PoDocketPslEntity[]>();
      const pslInfoMap = new Map<number, PslInfoEntity>();
      for (const eachDocPsl of docPslMapDetails) {
        if (!pslInfoMap.has(eachDocPsl.pslId)) {
          const pslIInfo = await this.pslRepo.findOne({ where: { pslId: eachDocPsl.pslId, unitCode, companyCode }, select: ['size'] });
          pslInfoMap.set(eachDocPsl.pslId, pslIInfo)
        }
        const actPlsInfo = pslInfoMap.get(eachDocPsl.pslId);
        if (!sizeWiseDodPslMap.has(actPlsInfo.size)) {
          sizeWiseDodPslMap.set(actPlsInfo.size, []);
        }
        sizeWiseDodPslMap.get(actPlsInfo.size).push(eachDocPsl);
      }
      for (const eachDocBundle of docketBundlesInfo) {
        let remainingQty = eachDocBundle.quantity;
        while (remainingQty > 0) {
          for (const eachDocPsl of sizeWiseDodPslMap.get(eachDocBundle.size)) {
            if (eachDocPsl.quantity > 0 && remainingQty > 0) {
              const allowableQty = Math.min(eachDocPsl.quantity, remainingQty);
              const docketBundlePslEntity = new PoDocketBundlePslEntity();
              docketBundlePslEntity.bundleNumber = eachDocBundle.bundleNumber;
              docketBundlePslEntity.companyCode = companyCode;
              docketBundlePslEntity.createdUser = userName;
              docketBundlePslEntity.docketNumber = docketNumber;
              docketBundlePslEntity.poSerial = redlock.poSerial;
              docketBundlePslEntity.pslId = eachDocPsl.pslId;
              docketBundlePslEntity.quantity = allowableQty;
              docketBundlePslEntity.unitCode = unitCode;
              docketBundlePslEntity.poSerial = docketDetails.poSerial;
              docBundlePslEntities.push(docketBundlePslEntity);
              remainingQty -= allowableQty;
              eachDocPsl.quantity -= allowableQty;
            }
          }
          if (remainingQty > 0) {
            throw new ErrorResponse(0, `Docket quantity not matches for the Product ${eachDocBundle.productName} AND FG Color ${eachDocBundle.color} AND Size ${eachDocBundle.size} AND docket ${docketNumber} insufficient qty is ${remainingQty}`);
          }
        }
      }
      await transManager.getRepository(PoDocketBundlePslEntity).save(docBundlePslEntities);
      return new GlobalResponseObject(true, 0, 'Docket and docket bundles to PSLB Mapping completed Successfully');
    } catch (err) {
      throw err;
    }
  }

  /**
   * Service to un confirm the dockets
   * @param req 
   * @returns 
  */
  async unConfirmDockets(req: PoProdutNameRequest): Promise<GlobalResponseObject> {
    const unitCode = req.unitCode; const companyCode = req.companyCode;
    const manager = new GenericTransactionManager(this.dataSource);
    const docketIds = new Set<number>();
    const docketNumbers = new Set<string>();
    let checkFlag = false;
    try {
      // delete all the bundles and panels of all dockets of the PO
      const docketDetailsForPo = await this.poDocketRepo.find({ select: ['id'], where: { poSerial: req.poSerial, unitCode, companyCode, docketConfirmation: DocConfirmationStatusEnum.INPROGRESS } });
      if (docketDetailsForPo.length > 0) {
        throw new ErrorResponse(0, 'Docket confirmation is still in progress. Please wait and try again');
      }
      const docketDetailsByPoProd = await this.poDocketRepo.find({ where: { poSerial: req.poSerial, productName: req.productName, unitCode, companyCode } });
      if (!docketDetailsByPoProd.length) {
        throw new ErrorResponse(0, 'No dockets found for the given po and product name')
      }
      for (const docketInfo of docketDetailsByPoProd) {
        if (docketInfo.docketConfirmation != DocConfirmationStatusEnum.CONFIRMED) {
          throw new ErrorResponse(0, 'Dockets not yet confirmed for the given po and product name. Please check and try again')
        }
        docketIds.add(docketInfo.id);
        docketNumbers.add(docketInfo.docketNumber);
      }
      // check if the cut numbers are created for the po and the product
      const cutNumberRecords = await this.helperService.getCutRecordsForPoProductName(req.poSerial, req.productName ? [req.productName] : [], req.companyCode, req.unitCode);
      if (cutNumberRecords.length > 0) {
        throw new ErrorResponse(0, 'Cut numbers are already generated. You cannot unconfirm dockets');
      }
      // check if for any of the docket, it the material allocated
      const allocatedRollsForDockets = await this.helperService.getPoDocketMaterialRecordsByDocNumber([...docketNumbers], req.companyCode, req.unitCode);
      if (allocatedRollsForDockets.length > 0) {
        throw new ErrorResponse(0, `Material is already allocated for the docket : ${allocatedRollsForDockets[0].docketGroup}`);
      }
      // Need to update the dockets confirmation status to confirm before generating bundles / panels
      await this.poDocketRepo.update({ id: In([...docketIds]) }, { docketConfirmation: DocConfirmationStatusEnum.INPROGRESS });
      checkFlag = true;
      await manager.startTransaction();
      await manager.getRepository(PoDocketBundleEntity).delete({ docketNumber: In([...docketNumbers]), unitCode, companyCode });
      await manager.getRepository(PoDocketPanelEntity).delete({ docketNumber: In([...docketNumbers]), unitCode, companyCode });
      await manager.getRepository(PoDocketSerialsEntity).update({ poSerial: req.poSerial, unitCode, companyCode }, { lastPanelNumber: 0 });
      await manager.getRepository(PoDocketPslEntity).delete({ docketNumber: In([...docketNumbers]), unitCode, companyCode });
      await manager.getRepository(PoDocketBundlePslEntity).delete({ docketNumber: In([...docketNumbers]), unitCode, companyCode })
      // delete the cuts also for the po
      // await this.helperService.deleteCutsForPoSerial(req.poSerial, req.companyCode, req.unitCode, manager);
      await manager.completeTransaction();
      await this.poDocketRepo.update({ id: In([...docketIds]) }, { docketConfirmation: DocConfirmationStatusEnum.OPEN, bundleGenStatus: DocBundleGenerationStatusEnum.OPEN });

      // trigger the job for deleting the emb headers
      for (const docket of docketNumbers) {
        await this.helperService.addEmbHeaderDelJob(req.poSerial, docket, req.companyCode, req.unitCode, req.username);
      }
      return new GlobalResponseObject(true, 0, 'Docket un confirmed successfully.');
    } catch (err) {
      if (checkFlag) {
        await this.poDocketRepo.update({ id: In([...docketIds]) }, { docketConfirmation: DocConfirmationStatusEnum.CONFIRMED })
      }
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Will be called only if the **PANELS_GENERATION** is configured in the app config for the business
   * UPDATER
   * @param docketNumber 
   * @param bundleNumber 
   * @param size 
   * @param adbNumber 
   * @param adbRollId 
   * @param plies 
   * @param companyCode 
   * @param unitCode 
   * @param manager 
   * @returns 
   */
  async mappingAdbToPanels(docketNumber: string, components: string[], underDocLayNumber: number, bundleNumber: number, size: string, adbNumber: number, adbRollId: number, plies: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {

    if (this.NEED_PANELS) {
      for (const component of components) {
        const panelIds = new Set<number>();
        // get the panels form top - bottom for reporting the plies releated panels
        const panelInfo = await manager.getRepository(PoDocketPanelEntity).find({ where: { docketNumber: docketNumber, bundleNumber: bundleNumber, component: component, unitCode: unitCode, size: size, companyCode: companyCode, cutReported: false }, order: { panelNumber: 'ASC' }, take: plies });
        for (const rec of panelInfo) {
          panelIds.add(rec.panelNumber);
        }
        await manager.getRepository(PoDocketPanelEntity).update({ docketNumber: docketNumber, bundleNumber: bundleNumber, unitCode: unitCode, companyCode: companyCode, panelNumber: In([...panelIds]) }, { cutReported: true, adbNumber: adbNumber, adbRollId: adbRollId, underDocLayNumber: underDocLayNumber });
      }
    }
    await manager.getRepository(PoDocketBundleEntity).update({ docketNumber: docketNumber, bundleNumber: bundleNumber, size: size, unitCode: unitCode, companyCode: companyCode }, { cutStatus: CutStatusEnum.OPEN });
    return true;
  }

  /**
   * Will be called only if the **PANELS_GENERATION** is configured in the app config for the business
   * @param docketNumber 
   * @param layNumber 
   * @param companyCode 
   * @param unitCode 
   * @param manager 
   * @returns 
   */
  async unMappingAdbToPanels(docketNumber: string, layNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    if (this.NEED_PANELS) {
      await manager.getRepository(PoDocketPanelEntity).update({ docketNumber: docketNumber, underDocLayNumber: layNumber, unitCode: unitCode, companyCode: companyCode }, { cutReported: false, adbNumber: 0, adbRollId: 0, underDocLayNumber: 0 });
    }
    return true;
  }

  /**
   * UPDATER
   * @param docketNumber 
   * @param cutStatus 
   * @param companyCode 
   * @param unitCode 
   * @param manager 
   * @returns 
   */
  async updateCutStatusForDocBundlesByDocNumber(docketNumber: string, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    let updatedRecords: UpdateResult;
    if (manager) {
      updatedRecords = await manager.getRepository(PoDocketBundleEntity).update({ docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode }, { cutStatus: cutStatus });
    } else {
      updatedRecords = await this.poDocBundleRepo.update({ docketNumber: docketNumber, companyCode: companyCode, unitCode: unitCode }, { cutStatus: cutStatus });
    }
    return updatedRecords.affected > 0;
  }

  /**
   * UPDATER
   * @param docketNumber 
   * @param cutStatus 
   * @param companyCode 
   * @param unitCode 
   * @param manager 
   * @returns 
   */
  async updateCutStatusForDocBundleByDocNumber(docketNumber: string, docBundleNumber: number, cutStatus: CutStatusEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    let updatedRecords: UpdateResult;
    if (manager) {
      updatedRecords = await manager.getRepository(PoDocketBundleEntity).update({ docketNumber: docketNumber, bundleNumber: docBundleNumber, companyCode: companyCode, unitCode: unitCode }, { cutStatus: cutStatus });
    } else {
      updatedRecords = await this.poDocBundleRepo.update({ docketNumber: docketNumber, bundleNumber: docBundleNumber, companyCode: companyCode, unitCode: unitCode }, { cutStatus: cutStatus });
    }
    return updatedRecords.affected > 0;
  }

  // updates the panel number for the po serial
  async updatePanelNumberForPoProdNameColorSizeComp(entityType: PhysicalEntityTypeEnum, poSerial: number, prodName: string, fgColor: string, size: string, comps: string[], lastPanelNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    if (manager) {
      const rec = await manager.getRepository(PoDocketSerialsEntity).findOne({ select: ['id', 'lastPanelNumber'], where: { entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode } });
      await manager.getRepository(PoDocketSerialsEntity).update({ entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode, id: rec.id }, { lastPanelNumber: Number(rec.lastPanelNumber + lastPanelNumber) });
      // await manager.getRepository(PoDocketSerialsEntity).update({ entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode}, { lastPanelNumber: ()=>`last_panel_number + ${lastPanelNumber}`});
    } else {
      const rec = await this.poDocketSerialRepo.findOne({ select: ['id', 'lastPanelNumber'], where: { entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode } });
      await this.poDocketSerialRepo.update({ entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode, id: rec.id }, { lastPanelNumber: Number(rec.lastPanelNumber + lastPanelNumber) });
      // await this.poDocketSerialRepo.update({ entityType: entityType, poSerial: poSerial, productName: prodName, color: fgColor, size: size, component: In(comps), companyCode: companyCode, unitCode: unitCode}, { lastPanelNumber: ()=>`last_panel_number + ${lastPanelNumber}` });
    }
    return true;
  }

  // updates the panel number for the po serial
  async updatePanelNumberForPoProdNameComp(entityType: PhysicalEntityTypeEnum, poSerial: number, prodName: string, comps: string[], lastPanelNumber: number, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    if (manager) {
      const rec = await manager.getRepository(PoComponentSerialsEntity).findOne({ select: ['id', 'lastPanelNumber'], where: { entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode } });
      await manager.getRepository(PoComponentSerialsEntity).update({ entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode }, { lastPanelNumber: Number(rec.lastPanelNumber + lastPanelNumber) });
      // await manager.getRepository(PoComponentSerialsEntity).update({ entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode}, { lastPanelNumber: ()=>`last_panel_number` + lastPanelNumber});
    } else {
      const rec = await this.poPanelSerialRepo.findOne({ select: ['id', 'lastPanelNumber'], where: { entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode } });
      await this.poPanelSerialRepo.update({ entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode }, { lastPanelNumber: Number(rec.lastPanelNumber + lastPanelNumber) });
      // await this.poPanelSerialRepo.update({ entityType: entityType, poSerial: poSerial, productName: prodName, component: In(comps), companyCode: companyCode, unitCode: unitCode}, { lastPanelNumber: ()=>`last_panel_number` + lastPanelNumber});
    }
    return true;
  }

  async createRemarksDocketGroup(reqModel: RemarksDocketGroupRequest): Promise<RemarkDocketGroupResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const remks = reqModel.remarkss
      const record = await this.remarksDocketGroupRepo.findOne({ where: { docketGroup: remks.docGroup, companyCode: remks.companyCode, unitCode: remks.unitCode, } });
      const entity = new PoDocketGroupEntity();
      entity.docketGroup = remks.docGroup,
        entity.remarks = remks.remark,
        entity.companyCode = reqModel.companyCode,
        entity.createdUser = reqModel.username,
        entity.unitCode = reqModel.unitCode;
      if (record) {
        await transManager.getRepository(PoDocketGroupEntity).update({ docketGroup: remks.docGroup, companyCode: remks.companyCode, unitCode: remks.unitCode }, { remarks: remks.remark });
      }
      else {
        throw new ErrorResponse(55689, `There Is No Data Against Docket Group ${remks.docGroup}`)
      }
      await transManager.completeTransaction();
      return new RemarkDocketGroupResponse(true, 85552, `Remark Updated Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


}