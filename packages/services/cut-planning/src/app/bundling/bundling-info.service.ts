import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BundlingHelperService } from "./bundling-helper.service";
import { CPS_C_BundlingConfirmationIdRequest, CPS_R_ActualDocketsForBundlingModel, CPS_R_ActualDocketsForBundlingResponse, CPS_R_BundlingConfirmationModel, CPS_R_BundlingConfirmationResponse, CPS_R_CutBundlingCutRepQtySizeModel, CPS_R_CutBundlingDocGenQtySizeModel, CPS_R_CutBundlingOrderQtySizeModel, CPS_R_CutBundlingProductColoCgInfoModel, CPS_R_CutBundlingProductColorBundlingSummaryModel, CPS_R_CutBundlingProductColorBundlingSummaryResponse, CPS_R_CutBundlingSummaryRequest, CPS_R_CutOrderConfirmedBundleModel, CPS_R_CutOrderConfirmedBundlesModel, CPS_R_CutOrderConfirmedBundlesProductWise, CPS_R_CutOrderConfirmedBundlesResponse, CutStatusEnum, GlobalResponseObject, KMS_R_KnitOrderElgBundlesResponse, PoCutBundlingMoveToInvStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { PoDocketPanelRepository } from "../docket-generation/repository/po-docket-panel.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoBundlingRepository } from "./repository/po-bundling.repo";
import { ActualPbEntity } from "./entity/actual-pb.entity";
import { ActualPbRepository } from "./repository/actual-pb.repository";
import { PoSubLineBundleRepository } from "../common/repository/po-sub-line-bundle.repo";
import moment from "moment";

@Injectable()
export class BundlingInfoService {
  constructor(
    private dataSource: DataSource,
    private poBundlingRepo: PoBundlingRepository,
    private actualBunRepo: ActualPbRepository,
    private poSubLineBunRepo: PoSubLineBundleRepository,
    @Inject(forwardRef(()=>BundlingHelperService)) private helperService: BundlingHelperService
  ) {

  }

  async getBundlingSummaryForPoProdCodeAndColor(req: CPS_R_CutBundlingSummaryRequest): Promise<CPS_R_CutBundlingProductColorBundlingSummaryResponse> {
    const { companyCode, unitCode, poSerial, productName, fgColor, iNeedCutRepQtys, iNeedDocGenQtys } = req;
    const cutRm = await this.helperService.getCutRmForPoProdColor(poSerial, productName, fgColor, companyCode, unitCode);
    if(!cutRm) {
      throw new ErrorResponse(0, `Cut RM not found for po serial : ${poSerial}, prod name : ${productName}, color : ${fgColor}`);
    }

    const m1s: CPS_R_CutBundlingProductColoCgInfoModel[] = [];
    // -------------------------------- ORIGINAL QTYS -----------------------
    const orgQtys = await this.helperService.getCutOrderQtyForPoProdColor(poSerial, productName, fgColor, companyCode, unitCode);
    const moqs: CPS_R_CutBundlingOrderQtySizeModel[] = [];
    const sizeWiseQtyMap = new Map<string, number>(); // size => order qty
    orgQtys.forEach(r => {
      if(!sizeWiseQtyMap.has(r.size)) {
        sizeWiseQtyMap.set(r.size, 0);
      }
      const preVal = sizeWiseQtyMap.get(r.size);
      sizeWiseQtyMap.set(r.size, preVal + r.orderQty);
    });
    sizeWiseQtyMap.forEach((qty, size) => {
      const m2 = new CPS_R_CutBundlingOrderQtySizeModel(size, qty);
      moqs.push(m2);
    });
    // --------------------------------------------------------------------------


    // --------------------------------- DOC GEN QTYS -------------------------
    const itemWiseDocGenQtysMap = new Map<string, Map<string, {qty: number}>>(); // item code => size => qty
    const itemWiseDocs = new Map<string, Set<string>>();
    if(iNeedDocGenQtys) {
      const docGenQtys = await this.helperService.getSizeWiseDocGenQtysForPoProdColorRm(poSerial, productName, fgColor, null, companyCode, unitCode);
      console.log(docGenQtys);
      docGenQtys.forEach(r => {
        if(!itemWiseDocGenQtysMap.has(r.item_code)) {
          itemWiseDocGenQtysMap.set(r.item_code, new Map<string, {qty: number}>());
          itemWiseDocs.set(r.item_code, new Set<string>());
        }
        if(!itemWiseDocGenQtysMap.get(r.item_code).has(r.size)) {
          itemWiseDocGenQtysMap.get(r.item_code).set(r.size, {qty: 0});
        }
        const preQty = itemWiseDocGenQtysMap.get(r.item_code).get(r.size).qty;
        itemWiseDocGenQtysMap.get(r.item_code).set(r.size, {qty: preQty + Number(r.total_qty)});
        itemWiseDocs.get(r.item_code).add(r.docket_number);
      });
    }
    // --------------------------------------------------------------------------

    for(const rm of cutRm) {
      const docGenQtyModels: CPS_R_CutBundlingDocGenQtySizeModel[] = [];
      const cutRepQtyModels: CPS_R_CutBundlingCutRepQtySizeModel[] = [];
      const docGenQtys = itemWiseDocGenQtysMap.get(rm.iCode);
      console.log(docGenQtys);
      if(iNeedDocGenQtys) {
        docGenQtys?.forEach((obj, size) => {
          docGenQtyModels.push(new CPS_R_CutBundlingDocGenQtySizeModel(size, obj.qty));
        });
      }
      if(iNeedCutRepQtys) {
        const docs = itemWiseDocs.get(rm.iCode);
        if(docs.size > 0) {
          const cutRepQtys = await this.helperService.getSizeWiseCutReportedQtysForDockets(poSerial, [...docs], companyCode, unitCode);
          const bundledQtys = await this.helperService.getSizeWiseBundledQtysForDockets(poSerial, [...docs], companyCode, unitCode);
          console.log(cutRepQtys);
          const sizeWiseCutQtyMap = new Map<string, {cutQty: number, bundledQty: number}>(); // size => cut qty
          cutRepQtys?.forEach(a => {
            if(!sizeWiseCutQtyMap.has(a.size)) {
              sizeWiseCutQtyMap.set(a.size, {cutQty: 0, bundledQty: 0});
            }
            const preCutQty = sizeWiseCutQtyMap.get(a.size).cutQty;
            sizeWiseCutQtyMap.get(a.size).cutQty = preCutQty + Number(a.cut_qty);
          });
          bundledQtys?.forEach(a => {
            if(!sizeWiseCutQtyMap.has(a.size)) {
              sizeWiseCutQtyMap.set(a.size, {cutQty: 0, bundledQty: 0});
            }
            const preBunQty = sizeWiseCutQtyMap.get(a.size).bundledQty;
            sizeWiseCutQtyMap.get(a.size).bundledQty = preBunQty + Number(a.bundled_qty);
          });
          sizeWiseCutQtyMap.forEach((obj, size) => {
            cutRepQtyModels.push(new CPS_R_CutBundlingCutRepQtySizeModel(size, obj.cutQty, obj.bundledQty));
          });
        }
      }
      const m1 = new CPS_R_CutBundlingProductColoCgInfoModel(rm.iCode, rm.components, rm.refComponent, docGenQtyModels, cutRepQtyModels, moqs);
      m1s.push(m1);
    }
    const m4 = new CPS_R_CutBundlingProductColorBundlingSummaryModel(productName, fgColor, m1s);

    return new CPS_R_CutBundlingProductColorBundlingSummaryResponse(true, 0, 'Bundling summary retrieved', m4);
  }

  async getActualDocketsFoBundlingForPoProdCodeAndColor(req: CPS_R_CutBundlingSummaryRequest): Promise<CPS_R_ActualDocketsForBundlingResponse> {
    const {companyCode, unitCode, productName, fgColor, poSerial} = req;
    if(!poSerial || !productName || !fgColor) {
      throw new ErrorResponse(0, 'Po serial , Product name and Color are mandatory');
    }
    const m1s: CPS_R_ActualDocketsForBundlingModel[] = [];
    // get the dockets for the combination
    const docRecs = await this.helperService.getDocketsForPoProdColor(poSerial, productName, fgColor, companyCode, unitCode, true);
    for(const doc of docRecs) {
      // get the actual dockets for the doc
      const actualDocs = await this.helperService.getLayingRecordsForDocketGroups([doc.docketGroup], companyCode, unitCode);
      const layIds = actualDocs.map(r => r.id);
      const actualDocWisePlies = await this.helperService.getLayingRollRecordsForLayIds(layIds, unitCode, companyCode);
      const adWisePliesMap = new Map<number, number>(); // lay id => total plies
      actualDocWisePlies.forEach(r => {
        r.poDocketLayId = Number(r.poDocketLayId);
        if(!adWisePliesMap.has(r.poDocketLayId)) {
          adWisePliesMap.set(r.poDocketLayId, 0);
        }
        const preVal = adWisePliesMap.get(r.poDocketLayId);
        adWisePliesMap.set(r.poDocketLayId, preVal + Number(r.layedPlies));
      });

      for(const ad of actualDocs) {
        // get the bundling confirmations for the doc
        const bundlingRecs = await this.poBundlingRepo.find({select: ['docketNumber', 'totalBundlesConfirmed', 'underDocLayNumber', 'totalBundledQuantity'], where: {companyCode, unitCode, processingSerial: poSerial, docketNumber: doc.docketNumber, underDocLayNumber: ad.underDocLayNumber, isActive: true}});
        let totalBundlesPieces = 0;
        let totalBundledBundles = 0;
        bundlingRecs.forEach(r => {
          totalBundlesPieces += r.totalBundledQuantity;
          totalBundledBundles += r.totalBundlesConfirmed;
        });
        // get the total cut rep plies
        const cutRepPlies = ad.cutStatus == CutStatusEnum.COMPLETED ? adWisePliesMap.get(ad.id) : 0;
        const cutRepQty = doc.plannedBundles * cutRepPlies;
        const m1 = new CPS_R_ActualDocketsForBundlingModel(doc.docketNumber, doc.docketGroup, ad.underDocLayNumber, doc.plannedBundles, cutRepQty, Number(doc.plannedBundles) * Number(doc.plies), totalBundlesPieces, totalBundledBundles);
        m1s.push(m1);
      }
    }
    return new CPS_R_ActualDocketsForBundlingResponse(true, 0, 'Bundling dockets retrieved', m1s);
  }


  async getConfirmedBundlesForConfirmationId(req: CPS_C_BundlingConfirmationIdRequest): Promise<CPS_R_CutOrderConfirmedBundlesResponse> {
    const { companyCode, unitCode, confirmationId } = req;
    if(!confirmationId) {
      throw new ErrorResponse(0, 'Confirmation id is not provided');
    }
    const confRec = await this.poBundlingRepo.findOne({select: ['confirmationId', 'processingSerial'], where: {companyCode, unitCode, confirmationId: confirmationId, isActive: true}});
    if(!confRec) {
      throw new ErrorResponse(0, `Confirmation record not found for the confirmation id : ${confirmationId}`);
    }
    const m1s: CPS_R_CutOrderConfirmedBundleModel[] = [];
    // get the bundles for the conf id
    const bundles = await this.actualBunRepo.find({where: {companyCode, unitCode, confirmationId: confirmationId}});
    if(bundles.length == 0) {
      throw new ErrorResponse(0, `No bundles found for the confirmation id : ${confirmationId}`);
    }
    const pslIds = bundles.map(r => r.pslId);
    const pslPropsMap = await this.helperService.getPslProps(pslIds, companyCode, unitCode);
    // get the fg sku for the random bundle
    const bundleRec = await this.poSubLineBunRepo.findOne({select: ['fgSku'], where: {companyCode, unitCode, bundleNumber: bundles[0].pbBarcode, processingSerial: confRec.processingSerial }});
    bundles.forEach(b => {
      const pslProps = pslPropsMap.get(Number(b.pslId));
      const m1 = new CPS_R_CutOrderConfirmedBundleModel(bundleRec.fgSku, b.pslId, b.pbBarcode, b.abBarcode, b.aQty, b.pQty, pslProps.color, pslProps.size, b.shade);
      m1s.push(m1);
    });
    const m2 = new CPS_R_CutOrderConfirmedBundlesProductWise(confRec.productName, confRec.productName, confRec.productType, m1s);
    const m1 = new CPS_R_CutOrderConfirmedBundlesModel(confRec.processingSerial, ProcessTypeEnum.CUT, [m2]);
    return new CPS_R_CutOrderConfirmedBundlesResponse(true, 0, 'Confirmed bundles retrieved', [m1]);
  }

  async getBundlingConfirmationsForPoProdColor(req: CPS_R_CutBundlingSummaryRequest): Promise<CPS_R_BundlingConfirmationResponse> {
    const {companyCode, unitCode, poSerial, productName, fgColor} = req;
    const bundlingConfs = await this.poBundlingRepo.find({ where: { companyCode, unitCode, processingSerial: poSerial, productName: productName, color: fgColor }});
    if(bundlingConfs.length == 0) {
      throw new ErrorResponse(0, `No bundling operations are done for po serial : ${poSerial} product: ${productName}, color: ${fgColor}`);
    }
    const m1s: CPS_R_BundlingConfirmationModel[] = [];
    bundlingConfs.forEach(r => {
      const d = moment(r.createdAt).format('YYYY-MM-DD');
      const m1 = new CPS_R_BundlingConfirmationModel(r.confirmationId, r.docketNumber, r.totalBundledQuantity, [], r.totalBundlesConfirmed, r.confirmedBy, d, !r.isActive);
      m1s.push(m1);
    });

    return new CPS_R_BundlingConfirmationResponse(true, 0, 'Bundling confirmations retrieved', m1s);
  }

}

