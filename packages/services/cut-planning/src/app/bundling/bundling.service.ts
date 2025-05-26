import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { BundlingInfoService } from "./bundling-info.service";
import { BundlingHelperService } from "./bundling-helper.service";
import { CPS_C_BundlingConfirmationIdRequest, CPS_C_BundlingConfirmationRequest, CPS_ELGBUN_C_MainDocketRequest, CPS_R_BundlingConfirmationModel, CPS_R_BundlingConfirmationResponse, CPS_R_CutOrderConfirmedBundleModel, CPS_R_CutOrderEligibleBundlesResponse, GlobalResponseObject, PoCutBundlingMoveToInvStatusEnum, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoSubLineBundleRepository } from "../common/repository/po-sub-line-bundle.repo";
import { stringify } from "querystring";
import { ActualPbEntity } from "./entity/actual-pb.entity";
import { PoDocketPanelEntity } from "../docket-generation/entity/po-docket-panel.entity";
import { PoBundlingEntity } from "./entity/po-bundling.entity";
import { PoSubLineBundleEntity } from "../common/entity/po-sub-line-bundle.entity";
import { PoBundlingRepository } from "./repository/po-bundling.repo";
import { ActualPbRepository } from "./repository/actual-pb.repository";
import configuration from "../../config/configuration";
const util = require('util');

@Injectable()
export class BundlingService {
  private ACTUAL_TRACKING = configuration().appSepcific.ACTUAL_PRODUCT_BUNDLE_TRACK;
  constructor(
    private dataSource: DataSource,
    private infoService: BundlingInfoService,
    private helperService: BundlingHelperService,
    private poSubLineBundleRepo: PoSubLineBundleRepository,
    private poBundlingRepo: PoBundlingRepository,
    private actualPbRepo: ActualPbRepository,
  ) {

  }

  async getEligibleBundlesAgainstDocketForBundling(req: CPS_ELGBUN_C_MainDocketRequest): Promise<CPS_R_CutOrderEligibleBundlesResponse> {
    const { companyCode, unitCode, mainDocketNumber, underDocLayNumber, username } = req;
    if(!mainDocketNumber) {
      throw new ErrorResponse(0, 'Docket number is not provided');
    }
    if(!underDocLayNumber) {
      throw new ErrorResponse(0, 'Actual docket number is not provided');
    }
    const docRec = await this.helperService.getDocketRecordByDocNumber(mainDocketNumber.toString(), companyCode, unitCode);
    if(!docRec) {
      throw new ErrorResponse(0, `Docket record not found for the docket number : ${mainDocketNumber}`);
    }
    if(!docRec.mainDocket) {
      throw new ErrorResponse(0, `Docket given is not a main docket : ${mainDocketNumber}. Bundling can be done only for the main dockets`);
    }
    // get the PSL for the docket
    const pslIds = await this.helperService.getPslIdsForDocket(mainDocketNumber.toString(), companyCode, unitCode);
    if(pslIds.length == 0) {
      throw new ErrorResponse(0, `PSL ids not found for the docket number : ${mainDocketNumber}`);
    }
    const pslPropsMap = await this.helperService.getPslProps(pslIds, companyCode, unitCode);
    const {poSerial, productName, color, refComponent } = docRec;
    const componentsForPo = await this.helperService.getDistinctComponentsForPoSerialProdTypeAndColor(poSerial, productName, color, companyCode, unitCode);
    if(componentsForPo.length == 0) {
      throw new ErrorResponse(0, `Panels not found for the po serial : ${poSerial}, product : ${productName} and color : ${color}`);
    }
    const trimComps: string[] = componentsForPo.filter(r => r != refComponent);

    // get the pending planned bundles to be bundled for the psl ids
    const pendingPlannedBundles = await this.poSubLineBundleRepo.getPendingBundlesForBundling(poSerial, pslIds, companyCode, unitCode);
    if(pendingPlannedBundles.length == 0) {
      throw new ErrorResponse(0, `No pending bundles found for bundling for the po serial : ${poSerial}`);
    }
    // construct a map of psl id and its planned bundles
    const bundlePropsMap = new Map<string, {oQty: number, balQty: number, pslId: number, totalAbs: number}>();
    const pslWisePendingPbsMap = new Map<number, {bunNo: string, oQty: number, balQty: number}[]>();
    pendingPlannedBundles.forEach(r => {
      if(!pslWisePendingPbsMap.has(Number(r.psl_id))) {
        pslWisePendingPbsMap.set(Number(r.psl_id), []);
      }
      const bal = Number(r.quantity) - Number(r.bundled_quantity);
      pslWisePendingPbsMap.get(Number(r.psl_id)).push({bunNo: r.bundle_number, oQty: r.quantity, balQty: bal});
      if(!bundlePropsMap.has(r.bundle_number)) {
        bundlePropsMap.set(r.bundle_number, { oQty: r.quantity, balQty: bal, pslId: Number(r.psl_id), totalAbs: Number(r.total_abs)});
      }
    });
    let totalBundlesConf = 0;
    const m1s: CPS_R_CutOrderConfirmedBundleModel[]= [];
    const finalPbBunPanelsMap = await this.getEligibleBundlesAgainstDocketForBundlingHelper(req.mainDocketNumber, req.underDocLayNumber, req.companyCode, req.unitCode, req.username);
    for(const [currentOnGoingBundle, shadesPanels] of finalPbBunPanelsMap) {
      // console.log(shadesPanels);
      for(const [shade, readyPanels] of shadesPanels) {
        console.log(readyPanels);
        // check if the panels avl from all components
        const readyToBundlePanels = readyPanels.get(refComponent);
        const bundleProps = bundlePropsMap.get(currentOnGoingBundle);
        const pslId = bundleProps.pslId;
        let askingQty = 0;
        readyToBundlePanels.forEach(r => askingQty += r.qty);
        let minQtyFromAllComps = 9999;

        for(const comp of trimComps) {
          let currCompQty = 0;
          const compBundles = readyPanels.get(comp);
          compBundles.forEach(r => currCompQty += r.qty);
          minQtyFromAllComps = Math.min(minQtyFromAllComps, currCompQty);
        }
        // after iterating all components, we will get the final min qty across all components. This qty related panels has to be bundled under the main planned bundle

        if(minQtyFromAllComps <= 0) {
          continue;
        }

        // If the tracking is not actual tracking, then we will not bundle until all the original quantity of the bundle is available
        if(!this.ACTUAL_TRACKING) {
          if(minQtyFromAllComps != bundleProps.oQty) {
            continue;
          }
        }

        bundleProps.totalAbs++; // increment the total adbs here
        const AB_BARCODE = this.ACTUAL_TRACKING ? currentOnGoingBundle+'-'+bundleProps.totalAbs : currentOnGoingBundle;
        // save and update the DB here
        totalBundlesConf++;

        // A re checker that actually checks if all the panels are matching the bundled qtys
        for(const comp of componentsForPo) {
          let counter = 0;
          const inHandPanels = readyPanels.get(comp);
          const finalPanelsToBeUpdated: number[] = [];
          inHandPanels.forEach(r => {
            r.panels.forEach(p => {
              // Based on the min qty of all components, we only require sufficient panel numbers from each component
              if(counter < minQtyFromAllComps) {
                finalPanelsToBeUpdated.push(p);
                counter++;
              }
            })
          });
          console.log('--------------------------------------------');
          console.log(currentOnGoingBundle);
          console.log(finalPanelsToBeUpdated.length);
          console.log(minQtyFromAllComps);
          if(finalPanelsToBeUpdated.length < minQtyFromAllComps) {
            throw new ErrorResponse(0, `System Error : Planned bundle : ${currentOnGoingBundle}. The minimum panels estimated is ${minQtyFromAllComps}. But while filtering the panels for the ${comp} it received only ${finalPanelsToBeUpdated.length} panels. Please contact support team`);
          }
        }
        const pslInfo = pslPropsMap.get(pslId);
        const m1 = new CPS_R_CutOrderConfirmedBundleModel(null, pslId, currentOnGoingBundle, AB_BARCODE, minQtyFromAllComps, minQtyFromAllComps, color, pslInfo.size, shade);
        m1s.push(m1);
      }
    }
    return new CPS_R_CutOrderEligibleBundlesResponse(true, 0, 'Eligible bundles retrieved', m1s);
  }


  async confirmBundlingForActualDocket(req: CPS_C_BundlingConfirmationRequest): Promise<CPS_R_BundlingConfirmationResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, mainDocketNumber, underDocLayNumber, username } = req;
      if(!mainDocketNumber) {
        throw new ErrorResponse(0, 'Docket number is not provided');
      }
      if(!underDocLayNumber) {
        throw new ErrorResponse(0, 'Actual docket number is not provided');
      }
      const docRec = await this.helperService.getDocketRecordByDocNumber(mainDocketNumber.toString(), companyCode, unitCode);
      if(!docRec) {
        throw new ErrorResponse(0, `Docket record not found for the docket number : ${mainDocketNumber}`);
      }
      if(!docRec.mainDocket) {
        throw new ErrorResponse(0, `Docket given is not a main docket : ${mainDocketNumber}. Bundling can be done only for the main dockets`);
      }
      // get the PSL for the docket
      const pslIds = await this.helperService.getPslIdsForDocket(mainDocketNumber.toString(), companyCode, unitCode);
      if(pslIds.length == 0) {
        throw new ErrorResponse(0, `PSL ids not found for the docket number : ${mainDocketNumber}`);
      }
      const {poSerial, productName, color, refComponent } = docRec;
      const componentsForPo = await this.helperService.getDistinctComponentsForPoSerialProdTypeAndColor(poSerial, productName, color, companyCode, unitCode);
      if(componentsForPo.length == 0) {
        throw new ErrorResponse(0, `Panels not found for the po serial : ${poSerial}, product : ${productName} and color : ${color}`);
      }
      const trimComps: string[] = componentsForPo.filter(r => r != refComponent);

      // get the pending planned bundles to be bundled for the psl ids
      const pendingPlannedBundles = await this.poSubLineBundleRepo.getPendingBundlesForBundling(poSerial, pslIds, companyCode, unitCode);
      if(pendingPlannedBundles.length == 0) {
        throw new ErrorResponse(0, `No pending bundles found for bundling for the po serial : ${poSerial}`);
      }
      // construct a map of psl id and its planned bundles
      const bundlePropsMap = new Map<string, {oQty: number, balQty: number, pslId: number, totalAbs: number}>();
      const pslWisePendingPbsMap = new Map<number, {bunNo: string, oQty: number, balQty: number}[]>();
      pendingPlannedBundles.forEach(r => {
        if(!pslWisePendingPbsMap.has(Number(r.psl_id))) {
          pslWisePendingPbsMap.set(Number(r.psl_id), []);
        }
        const bal = Number(r.quantity) - Number(r.bundled_quantity);
        pslWisePendingPbsMap.get(Number(r.psl_id)).push({bunNo: r.bundle_number, oQty: r.quantity, balQty: bal});
        if(!bundlePropsMap.has(r.bundle_number)) {
          bundlePropsMap.set(r.bundle_number, { oQty: r.quantity, balQty: bal, pslId: Number(r.psl_id), totalAbs: Number(r.total_abs)});
        }
      });
      let totalBundledPanels = 0;
      const finalPbBunPanelsMap = await this.getEligibleBundlesAgainstDocketForBundlingHelper(req.mainDocketNumber, req.underDocLayNumber, req.companyCode, req.unitCode, req.username);
      await transManager.startTransaction();
      const confirmationId = Date.now();
      
      let totalBundlesConf = 0;
      // Now we finally have the bundles segregated with shade. Loop all components and construct the eligible bundles
      for(const [currentOnGoingBundle, shadesPanels] of finalPbBunPanelsMap) {
        for(const [shade, readyPanels] of shadesPanels) {
          // check if the panels avl from all components
          const readyToBundlePanels = readyPanels.get(refComponent);
          const bundleProps = bundlePropsMap.get(currentOnGoingBundle);
          const pslId = bundleProps.pslId;
          let askingQty = 0;
          readyToBundlePanels.forEach(r => askingQty += r.qty);
          let minQtyFromAllComps = 9999;

          for(const comp of trimComps) {
            let currCompQty = 0;
            const compBundles = readyPanels.get(comp);
            compBundles.forEach(r => currCompQty += r.qty);
            minQtyFromAllComps = Math.min(minQtyFromAllComps, currCompQty);
          }
          // after iterating all components, we will get the final min qty across all components. This qty related panels has to be bundled under the main planned bundle

          if(minQtyFromAllComps <= 0) {
            continue;
          }
          // If the tracking is not actual tracking, then we will not bundle until all the original quantity of the bundle is available
          if(!this.ACTUAL_TRACKING) {
            if(minQtyFromAllComps != bundleProps.oQty) {
              continue;
            }
          }

          bundleProps.totalAbs++; // increment the total adbs here
          const AB_BARCODE = this.ACTUAL_TRACKING ? currentOnGoingBundle+'-'+bundleProps.totalAbs : currentOnGoingBundle;
          // save and update the DB here
          const apb = new ActualPbEntity();
          apb.companyCode = companyCode;
          apb.unitCode = unitCode;
          apb.createdUser = username;
          apb.docketNumber = mainDocketNumber;
          apb.pbBarcode = currentOnGoingBundle;
          apb.abBarcode = AB_BARCODE;
          apb.pslId = pslId;
          apb.shade = shade;
          apb.confirmationId = confirmationId;
          apb.pQty = bundleProps.oQty;
          apb.aQty = minQtyFromAllComps;
          apb.poSerial = poSerial;
          await transManager.getRepository(ActualPbEntity).save(apb, {reload: false});
          totalBundlesConf++;
          totalBundledPanels+=minQtyFromAllComps;
          // now update the docket panel table
          for(const comp of componentsForPo) {
            let counter = 0;
            const inHandPanels = readyPanels.get(comp);
            const finalPanelsToBeUpdated: number[] = [];
            inHandPanels.forEach(r => {
              r.panels.forEach(p => {
                // Based on the min qty of all components, we only require sufficient panel numbers from each component
                if(counter < minQtyFromAllComps) {
                  finalPanelsToBeUpdated.push(p);
                  counter++;
                }
              })
            });
            if(finalPanelsToBeUpdated.length < minQtyFromAllComps) {
              throw new ErrorResponse(0, `System Error : Planned bundle : ${currentOnGoingBundle}. The minimum panels estimated is ${minQtyFromAllComps}. But while filtering the panels for the ${comp} it received only ${finalPanelsToBeUpdated.length} panels. Please contact support team`);
            }
            await transManager.getRepository(PoDocketPanelEntity).update({companyCode, unitCode, pslId: pslId, component: comp, panelNumber: In(finalPanelsToBeUpdated)}, {abNumber: AB_BARCODE, pbNumber: currentOnGoingBundle, bundled: true, confirmationId: confirmationId});
          }
          await transManager.getRepository(PoSubLineBundleEntity).update({companyCode, unitCode, bundleNumber: currentOnGoingBundle}, { bundledQty: ()=>`bundled_quantity + ${minQtyFromAllComps}`, totalAbs: ()=>`total_abs + 1` });
        }
      }
      if(totalBundlesConf == 0) {
        throw new ErrorResponse(0, 'No sufficient inventory available to create product bundles');
      }
      if(totalBundlesConf > 0) {
        const poBunEnt = new PoBundlingEntity();
        poBunEnt.companyCode = companyCode;
        poBunEnt.unitCode = unitCode;
        poBunEnt.createdUser = username;
        poBunEnt.confirmationId = confirmationId;
        poBunEnt.processingSerial = poSerial;
        poBunEnt.processType = ProcessTypeEnum.CUT;
        poBunEnt.productType = docRec.productType;
        poBunEnt.productName = docRec.productName;
        poBunEnt.color = color;
        poBunEnt.docketNumber = mainDocketNumber;
        poBunEnt.underDocLayNumber = underDocLayNumber;
        poBunEnt.confirmedBy = username;
        poBunEnt.totalBundlesConfirmed = totalBundlesConf;
        poBunEnt.invStatus = PoCutBundlingMoveToInvStatusEnum.OPEN;
        poBunEnt.totalBundledQuantity = totalBundledPanels;
        await transManager.getRepository(PoBundlingEntity).save(poBunEnt, {reload: false});
      }
      await transManager.completeTransaction();
      const m1 = new CPS_R_BundlingConfirmationModel(confirmationId, mainDocketNumber, totalBundledPanels, [], totalBundlesConf, username, null, false);
      this.helperService.createCutInvInRequestByConfirmationId(confirmationId, companyCode, unitCode);
      this.helperService.createCutInvInPtsByConfirmationId(confirmationId, companyCode, unitCode)
      return new CPS_R_BundlingConfirmationResponse(true, 0, 'Eligible bundles confirmed', [m1]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  // HELPER
  async getEligibleBundlesAgainstDocketForBundlingHelper(mainDocketNumber: string, underDocLayNumber: number, companyCode: string, unitCode: string, username: string): Promise<Map<string, Map<string, Map<string, {panels: number[], qty: number, pslId: number, db: number, adbRollId: number}[]>>>> {
    const docRec = await this.helperService.getDocketRecordByDocNumber(mainDocketNumber.toString(), companyCode, unitCode);
    if(!docRec) {
      throw new ErrorResponse(0, `Docket record not found for the docket number : ${mainDocketNumber}`);
    }
    if(!docRec.mainDocket) {
      throw new ErrorResponse(0, `Docket given is not a main docket : ${mainDocketNumber}. Bundling can be done only for the main dockets`);
    }
    // get the PSL for the docket
    const pslIds = await this.helperService.getPslIdsForDocket(mainDocketNumber.toString(), companyCode, unitCode);
    if(pslIds.length == 0) {
      throw new ErrorResponse(0, `PSL ids not found for the docket number : ${mainDocketNumber}`);
    }
    const {poSerial, productName, color, refComponent } = docRec;
    const componentsForPo = await this.helperService.getDistinctComponentsForPoSerialProdTypeAndColor(poSerial, productName, color, companyCode, unitCode);
    if(componentsForPo.length == 0) {
      throw new ErrorResponse(0, `Panels not found for the po serial : ${poSerial}, product : ${productName} and color : ${color}`);
    }
    const trimComps: string[] = componentsForPo.filter(r => r != refComponent);
    console.log(trimComps);
    // get the pending planned bundles to be bundled for the psl ids
    const pendingPlannedBundles = await this.poSubLineBundleRepo.getPendingBundlesForBundling(poSerial, pslIds, companyCode, unitCode);
    if(pendingPlannedBundles.length == 0) {
      throw new ErrorResponse(0, `No pending bundles found for bundling for the po serial : ${poSerial}`);
    }
    // construct a map of psl id and its planned bundles
    const bundlePropsMap = new Map<string, {oQty: number, balQty: number, pslId: number, totalAbs: number}>();
    const pslWisePendingPbsMap = new Map<number, {bunNo: string, oQty: number, balQty: number}[]>();
    pendingPlannedBundles.forEach(r => {
      if(!pslWisePendingPbsMap.has(Number(r.psl_id))) {
        pslWisePendingPbsMap.set(Number(r.psl_id), []);
      }
      const bal = Number(r.quantity) - Number(r.bundled_quantity);
      pslWisePendingPbsMap.get(Number(r.psl_id)).push({bunNo: r.bundle_number, oQty: Number(r.quantity), balQty: bal});
      if(!bundlePropsMap.has(r.bundle_number)) {
        bundlePropsMap.set(r.bundle_number, { oQty: Number(r.quantity), balQty: bal, pslId: Number(r.psl_id), totalAbs: Number(r.total_abs)});
      }
    });
    

    // --------------------------------------------------------------------------------
    // now get the pending panels for bundling for this main docket
    const pendingPanelsForMainDoc = await this.helperService.getCutReportedPanelsForBundlingByActualDocket(mainDocketNumber, underDocLayNumber, companyCode, unitCode);
    if(pendingPanelsForMainDoc.length == 0) {
      throw new ErrorResponse(0, `No pending main docket panels found for bundling for the docket : ${mainDocketNumber} and lay number : ${underDocLayNumber}`);
    }
    console.log(pendingPanelsForMainDoc);

    // ----------------------------------------------------------------------------------------
    // now if it have the pending panels, proceed for bundling
    const adbRollIds = pendingPanelsForMainDoc.map(r => r.adb_roll_id);
    // get the props for the adb roll ids
    const adbRollProps = await this.helperService.getAdbRollsByAdbRollIds(adbRollIds, unitCode, companyCode);
    const adbPropsMap = new Map<number, {sh: string}>();
    adbRollProps.forEach(r => adbPropsMap.set(r.id, { sh: r.shade }) );
    // ----------------------------------------------------------------------------------------

    const pslIdWiseMainDocketUnBundledPanelsMap = new Map<number, Map<string, {db: number, panels: number[], adbNo: number,  adbRollId: number,_penPanelsCount: number }[]>>(); // db - docket bundle number, panels: array of panel numbers, penPanelsCount: equals to the no of unbundled panels.this will decrement in the iterations after fulfillment
    const totalPslIds = new Set<number>();
    const shades = new Set<string>();
    pendingPanelsForMainDoc.forEach(r => {
      if(!pslIdWiseMainDocketUnBundledPanelsMap.has(r.psl_id)) {
        pslIdWiseMainDocketUnBundledPanelsMap.set(r.psl_id, new Map<string, {db: number, panels: number[], adbNo: number, adbRollId: number, _penPanelsCount: number }[]>());
      }
      const shade = adbPropsMap.get(r.adb_roll_id).sh;
      if(!pslIdWiseMainDocketUnBundledPanelsMap.get(r.psl_id).has(shade)) {
        pslIdWiseMainDocketUnBundledPanelsMap.get(r.psl_id).set(shade, []);
      }
      const panels = r.panels.split(',').map(_p => Number(_p));
      pslIdWiseMainDocketUnBundledPanelsMap.get(r.psl_id).get(shade).push({db: r.bundle_number, panels: panels, adbNo: Number(r.adb_number),  adbRollId: Number(r.adb_roll_id) ,_penPanelsCount: panels.length });
      totalPslIds.add(Number(r.psl_id));
      shades.add(shade);
    });

    const pslIdWiseSubDocketUnBundledPanelsMap = new Map<number, Map<string, {db: number, adbNo: number,  adbRollId: number, panels: number[], _penPanelsCount: number }[]>>();
    // for each and every PSL id, we know how much qty the main component is reported. So now we will try to get the trim components against to the PSL id for the required qty
    for(const pslId of totalPslIds) {
      if(!pslIdWiseSubDocketUnBundledPanelsMap.has(pslId)) {
        pslIdWiseSubDocketUnBundledPanelsMap.set(pslId, new Map<string, {db: number, adbNo: number, adbRollId: number, panels: number[], _penPanelsCount: number }[]>());
      }
      // skip the main component
      for(const comp of trimComps) {
        if(comp == refComponent) {
          continue;
        }
        pslIdWiseSubDocketUnBundledPanelsMap.get(pslId).set(comp, []);
        // get the pending panels for bundling
        const pendingPanelsForSubDoc = await this.helperService.getCutReportedPanelsForBundlingByPslIds(poSerial, [pslId], comp, companyCode, unitCode);
        console.log(`SUB - ${comp} - ${pslId}`);
        console.log(pendingPanelsForSubDoc);
        pendingPanelsForSubDoc.forEach(r => {
          const panels = r.panels.split(',').map(_p => Number(_p));
          pslIdWiseSubDocketUnBundledPanelsMap.get(pslId).get(comp).push({db: r.bundle_number, adbNo: Number(r.adb_number), adbRollId: Number(r.adb_roll_id), panels: panels, _penPanelsCount: panels.length });
        });
      }
    }

    console.log('************************************************************************************');
    // console.log(util.inspect(pslIdWiseMainDocketUnBundledPanelsMap, {depth: null}));
    console.log(util.inspect(pslIdWiseSubDocketUnBundledPanelsMap, {depth: null}));
    // const finalPbBunPanelsMap = new Map<string, {refComp: string, panelNos: number[], pslId: number, dbNo: number, adbNo: number}[]>();
    const finalPbBunPanelsMap2 = new Map<string, Map<string, Map<string, {panels: number[], qty: number, pslId: number, db: number, adbRollId: number}[]>>>(); // pb => shade => ref comp => info
    // now iterate each and every planned bundle and attach the main docket panels and bundle them under a planned bundle
    for(const [pslId, pendingBundles] of pslWisePendingPbsMap) {
      nextBundle: for(const b of pendingBundles){
        let balQty = b.balQty;
        let currentOnGoingBundle = b.bunNo;
        if(balQty <= 0) {
          continue nextBundle;
        }
        finalPbBunPanelsMap2.set(currentOnGoingBundle, new Map<string, Map<string, {panels: number[], qty: number, pslId: number, db: number, adbRollId: number}[]>>());
        nextShade: for(const shade of shades) {
          if(!finalPbBunPanelsMap2.get(currentOnGoingBundle).has(shade)) {
            finalPbBunPanelsMap2.get(currentOnGoingBundle).set(shade, new Map<string, {panels: number[], qty: number, pslId: number, db: number, adbRollId: number}[]>());
            finalPbBunPanelsMap2.get(currentOnGoingBundle).get(shade).set(refComponent, []);
          }
          // get the eligible panels from all components
          const mc = pslIdWiseMainDocketUnBundledPanelsMap.get(pslId)?.get(shade) ?? [];
          nextAdb: for(const r of mc) {
            let balPanelCount = r._penPanelsCount;
            if(balPanelCount <= 0) {
              continue nextAdb;
            }
            let minQtyOfPbAndAvlPanels = Math.min(balQty, balPanelCount);
            const pickedPanels = r.panels?.splice(0, minQtyOfPbAndAvlPanels); // auto removal of elements by splice. so no need to reassign
            balPanelCount -= minQtyOfPbAndAvlPanels;
            // Re-Assign the values
            r._penPanelsCount = balPanelCount;
            balQty -= minQtyOfPbAndAvlPanels;
            
            finalPbBunPanelsMap2.get(currentOnGoingBundle).get(shade).get(refComponent).push({panels: pickedPanels, qty: minQtyOfPbAndAvlPanels, pslId: pslId, db: r.db, adbRollId: r.adbRollId });
            if(balQty <= 0) {
              continue nextBundle;
            }
          }
        }
      }
    }
    console.log('8888888888888888888888888888888888');
    // console.log(util.inspect(finalPbBunPanelsMap2, {depth: null}));

    // now repeat the same thing for the next components. 
    // Here we don't want to consider shades and all, we simply need panels in inventory of similar shade (not typically equivalent to the shade of main component fabric)
    for(const [currentOnGoingBundle, shadesPanels] of finalPbBunPanelsMap2) {
      for(const [shade, readyPanels] of shadesPanels) {
        const bundleProps = bundlePropsMap.get(currentOnGoingBundle);
        const readyToBundlePanels = readyPanels.get(refComponent);
        const pslId = bundleProps.pslId;
        
        // now iterate the trim component panels and
        nextComp: for(const comp of trimComps) {
          let askingQty = 0;
          readyToBundlePanels.forEach(r => askingQty += r.qty);
          console.log(`Asking qty : ${askingQty}`);
          // setting the trims map with same shade as of the main bundles 
          if(!finalPbBunPanelsMap2.get(currentOnGoingBundle).get(shade).has(comp)) {
            finalPbBunPanelsMap2.get(currentOnGoingBundle).get(shade).set(comp, []);
          }
          const otherPanels = pslIdWiseSubDocketUnBundledPanelsMap.get(pslId)?.get(comp) ?? [];
          nextAdb: for(const r of otherPanels) {
            let balPanelCount = r._penPanelsCount;
            if(balPanelCount <= 0) {
              continue nextAdb;
            }
            let minQtyOfPbAndAvlPanels = Math.min(askingQty, balPanelCount);
            const pickedPanels = r.panels?.splice(0, minQtyOfPbAndAvlPanels); // auto removal of elements by splice. so no need to reassign
            askingQty -= minQtyOfPbAndAvlPanels;
            r._penPanelsCount -= minQtyOfPbAndAvlPanels;
            finalPbBunPanelsMap2.get(currentOnGoingBundle).get(shade).get(comp).push({panels: pickedPanels, qty: minQtyOfPbAndAvlPanels, pslId: pslId, db: r.db, adbRollId: r.adbRollId });

            if(askingQty <= 0) {
              continue nextAdb;
            }
          }
        }
      }
    }
    console.log('==============================================================');
    console.log(util.inspect(finalPbBunPanelsMap2, {depth: null}));
    return finalPbBunPanelsMap2;
  }

  // deletes the bundling activity for the confirmation id
  async deleteBundling(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { companyCode, unitCode, confirmationId, username } = req;
      if(!confirmationId) {
        throw new ErrorResponse(0, 'Confirmation id is not provided');
      }
      const confRec = await this.poBundlingRepo.findOne({select: ['confirmationId', 'processingSerial', 'updatedAt', 'isActive'], where: {companyCode, unitCode, confirmationId: confirmationId}});
      if(!confRec) {
        throw new ErrorResponse(0, `Confirmation record not found for the confirmation id : ${confirmationId}`);
      }
      console.log(confRec);
      if(!confRec.isActive) {
        throw new ErrorResponse(0, `The given request is already unconfirmed on : ${confRec.updatedAt}`);
      }

      const bundles = await this.actualPbRepo.find({select: ['pbBarcode', 'aQty', 'pslId'], where: {companyCode, unitCode, confirmationId: confirmationId, isActive: true }});
      // validations with inventory system
      await transManager.startTransaction();
      await transManager.getRepository(PoBundlingEntity).update({companyCode, unitCode, confirmationId: confirmationId}, { isActive: false, updatedUser: username });
      await transManager.getRepository(PoDocketPanelEntity).update({companyCode, unitCode, poSerial: confRec.processingSerial, confirmationId}, {confirmationId: 0, abNumber: '', pbNumber: '', bundled: false});
      await transManager.getRepository(ActualPbEntity).update({companyCode, unitCode, confirmationId: confirmationId}, { isActive: false, updatedUser: username});
      for(const b of bundles) {
        await transManager.getRepository(PoSubLineBundleEntity).update({companyCode, unitCode, moProductSubLineId: b.pslId, bundleNumber: b.pbBarcode}, {bundledQty: ()=>`bundled_quantity - ${b.aQty}`, totalAbs: ()=>`total_abs - 1`});
      }
      await transManager.completeTransaction();
      // send the delete inventory request to INVS
      this.helperService.deleteCutInvInRequestByConfirmationId(confRec.confirmationId, companyCode, unitCode);
      this.helperService.deleteActualBundlesForConfirmationIdCut(confRec.confirmationId, companyCode, unitCode);
      return new GlobalResponseObject(true, 0, 'Bundling activity deleted');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
  
  // Called from INVS
  async updateExtSystemAckForBundlingConfirmation(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
    const { companyCode, unitCode, confirmationId, username } = req;
    const bundlingRec = await this.poBundlingRepo.findOne({select: ['id', 'invStatus'], where: { companyCode, unitCode, confirmationId: confirmationId, isActive: true }});
    if(!bundlingRec) {
      throw new ErrorResponse(0, `Bundling record not found for the confirmation id : ${confirmationId}`);
    }
    if(req.ackStatus == PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
      if(bundlingRec.invStatus == PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
        throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already confirmed by the inventory`);
      }
    } else {
      if(bundlingRec.invStatus == PoCutBundlingMoveToInvStatusEnum.OPEN) {
        throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already in open state`);
      }
    }
    await this.poBundlingRepo.update({companyCode, unitCode, confirmationId}, {invStatus: req.ackStatus});
    return new GlobalResponseObject(true, 0, `Confirmation status updated for confirmation id : ${confirmationId}`);
  }

  // Called from PTS
  async updatePtsSystemAckForBundlingConfirmation(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
    const { companyCode, unitCode, confirmationId, username } = req;
    const bundlingRec = await this.poBundlingRepo.findOne({select: ['id', 'ptsStatus'], where: { companyCode, unitCode, confirmationId: confirmationId }});
    if(!bundlingRec) {
      throw new ErrorResponse(0, `Bundling record not found for the confirmation id : ${confirmationId}`);
    }
    if(req.ackStatus == PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
      if(bundlingRec.ptsStatus == PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV) {
        throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already confirmed by the PTS`);
      }
    } else {
      if(bundlingRec.ptsStatus == PoCutBundlingMoveToInvStatusEnum.OPEN) {
        throw new ErrorResponse(0, `Bundling record for confirmation id ${confirmationId} was already in open state`);
      }
    }
    await this.poBundlingRepo.update({companyCode, unitCode, confirmationId}, {ptsStatus: req.ackStatus});
    return new GlobalResponseObject(true, 0, `Confirmation status updated for confirmation id : ${confirmationId}`);
  }
}

