import { Injectable } from '@nestjs/common';
import {  PTS_C_ProcTypeBundleBarcodeModel, SPS_C_BundleInvConfirmationIdRequest, SPS_C_ProdColorBundlesSummaryRequest, SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, SPS_C_ProdColorInvConfirmationsRetrievalRequest, SPS_R_MoveToInvAllBundlesModel, SPS_R_MoveToInvAllBundlesResponse, SPS_R_MoveToInvConfirmationModel, SPS_R_MoveToInvConfirmationsResponse, SPS_R_MoveToInvConfirmedBundleModel, SPS_R_MoveToInvProcSerialBundleSummaryModel, SPS_R_MoveToInvProcSerialInvMoveQtyModel, SPS_R_MoveToInvProcSerialJobQtysModel, SPS_R_MoveToInvProcSerialOrderQtysModel, SPS_R_MoveToInvProcSerialSummaryModel, SPS_R_MoveToInvProcSerialSummaryResponse, SPS_R_ProdColorEligibleBundlesForMoveToInvModel, SPS_R_ProdColorEligibleBundlesForMoveToInvResponse } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { InventoryHelperService } from './invnentory-helper.service';
import { SJobBundleRepository } from '../entities/repository/s-job-bundle.repository';
import { InventoryConfirmationRepository } from '../entities/repository/inventory-confirmation.repo';
import { InventoryBundleRepository } from '../entities/repository/inventory-bundle.repo';
import { PoSubLineBundleRepository } from '../entities/repository/po-sub-line-bundle.repo';
import { ProductSubLineFeaturesEntity } from '../entities/product-sub-line-features-entity';
import { SJobPslRepository } from '../entities/repository/s-job-psl.repository';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';


@Injectable()
export class InventoryInfoService {
    constructor(
        private dataSource: DataSource,
        private helperService: InventoryHelperService,
        private jobBunRepo: SJobBundleRepository,
        private invConfRepo: InventoryConfirmationRepository,
        private invConfBunRepo: InventoryBundleRepository,
        private poSubLineBundle: PoSubLineBundleRepository,
        private jobPslRepo: SJobPslRepository,
        private poSubLineRepo: PoSubLineRepository
    ) {

    }

    // Called form Inventory movement UI 
    // Gets the actual bundles whose last op is completed for the given process type
    async getEligibleBundlesToMoveToInventoryForPoProdColorProcType(req: SPS_C_ProdColorEligibleBundlesForMoveToInvRequest): Promise<SPS_R_ProdColorEligibleBundlesForMoveToInvResponse> {
        const { companyCode, unitCode, procSerial, processType, fgColor, prodName } = req;
        if(!procSerial || !processType || !prodName || !fgColor) {
            throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
        }
        // first get the psl ids for the incoming criteria
        const pslRecs = await this.helperService.getPslIdsForProdColorProcSerial(companyCode, unitCode, procSerial, prodName, fgColor);
        if(pslRecs.length == 0) {
            throw new ErrorResponse(0, `Sorry no records found matching with prod : ${prodName} , proc serial : ${procSerial} and color : ${fgColor}`);
        }
        const pslIds = pslRecs.map(r => r.moProductSubLineId);
        const totalBundles = await this.jobBunRepo.getUniqueBundlesForPslIds(pslIds, processType, companyCode, unitCode, false, true);
        // const totalBundles = await this.jobBunRepo.find({select: ['abNumber', 'bundleNumber', 'qty', 'moProductSubLineId'], where: {companyCode, unitCode, moProductSubLineId: In(pslIds), processType: processType, movedToInv: false }});
        if(totalBundles.length == 0) {
            throw new ErrorResponse(0, `No pending bundles found to be moved to inventory`);
        }
        // psl wise barcodes
        const pslWiseBarcodes = new Map<number, string[]>();
        totalBundles.forEach(r => {
            r.psl_id = Number(r.psl_id);
            if(!pslWiseBarcodes.has(r.psl_id)) {
                pslWiseBarcodes.set(r.psl_id, []);
            }
            pslWiseBarcodes.get(r.psl_id).push(r.bundle_number);
        });
        const rm1s: PTS_C_ProcTypeBundleBarcodeModel[] = [];
        pslWiseBarcodes.forEach((brcds, pslId) => {
            rm1s.push(new PTS_C_ProcTypeBundleBarcodeModel(pslId, brcds));
        });
        console.log('1');
        // now make a call to PTS and get the eligible bundles that can be moved to inventory
        const outputCompBundles = await this.helperService.getOutputQtyForBundlesFromPts(companyCode, unitCode, procSerial, prodName, fgColor, processType, rm1s);
        const outputCompBunMap = new Map<string, { gQty: number, rQty: number, pslId: number}>(); // bundle => {}
        outputCompBundles.forEach(r => {
            r.barcodes.forEach(b => {
                if(!outputCompBunMap.has(b.barcode)) {
                    outputCompBunMap.set(b.barcode, { gQty: Number(b.gQty), rQty: Number(b.rQty), pslId: r.pslId });
                }
            });
        });
        const m1s: SPS_R_ProdColorEligibleBundlesForMoveToInvModel[] = [];
        // now based on this output qtys, we can confirm that the bundles can be moved to inventory
        totalBundles.forEach(r => {
            const bunRepProps = outputCompBunMap.get(r.bundle_number);
            const m1 = new SPS_R_ProdColorEligibleBundlesForMoveToInvModel(r.psl_id,r.bundle_number, r.qty, bunRepProps?.gQty ?? 0);
            m1s.push(m1);
        });
        return new SPS_R_ProdColorEligibleBundlesForMoveToInvResponse(true, 0, 'Eligible bundles retrieved', m1s);
    }

    async getInventoryConfirmationsForPoProdColorProcType(req: SPS_C_ProdColorInvConfirmationsRetrievalRequest): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        const { companyCode, unitCode, procSerial, processType, fgColor, prodName } = req;
        if(!procSerial || !processType || !prodName || !fgColor) {
            throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
        }
        const invConfRecs = await this.invConfRepo.find({where: {companyCode, unitCode, processingSerial: procSerial, processType: processType, productName: prodName, color: fgColor}});
        if(invConfRecs.length <= 0) {
            throw new ErrorResponse(0, `No inventory confirmation found for the selection`);
        }
        const m1s: SPS_R_MoveToInvConfirmationModel[] = [];
        for(const r of invConfRecs) {
            const m2s: SPS_R_MoveToInvConfirmedBundleModel[] = [];
            if(req.iNeedBundles) {
                const bundles = await this.invConfBunRepo.find({select: ['abBarcode', 'aQty', 'pQty', 'pslId'], where: {companyCode, unitCode, confirmationId: r.confirmationId}});
                for(const b of bundles) {
                    m2s.push(new SPS_R_MoveToInvConfirmedBundleModel(b.pslId, b.abBarcode, b.pQty, b.aQty));
                }
            }
            const m1 = new SPS_R_MoveToInvConfirmationModel(r.processingSerial, r.processType, r.color, r.productName, r.id, r.confirmationId.toString(), r.createdAt.toString(), r.createdUser, r.totalBundlesConfirmed, r.totalMovedQuantity, !r.isActive, null, r.invStatus, m2s);
            m1s.push(m1);
        }
        return new SPS_R_MoveToInvConfirmationsResponse(true, 0, 'Inventory confirmations retrieved successfully', m1s);
    }

    async getInventoryConfirmedBundlesForConfirmationId(req: SPS_C_BundleInvConfirmationIdRequest): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        const { confirmationId, companyCode, unitCode, processType } = req;
        if(!confirmationId || !processType ) {
            throw new ErrorResponse(0, 'Process type and confirmation id are mandatory. Few are not provided');
        }
        const invConfRecs = await this.invConfRepo.find({where: {companyCode, unitCode,  processType: processType, confirmationId: confirmationId}});
        if(invConfRecs.length <= 0) {
            throw new ErrorResponse(0, `No inventory confirmation found for the selection`);
        }
        const m1s: SPS_R_MoveToInvConfirmationModel[] = [];
        for(const r of invConfRecs) {
            let fgSku = '';
            const m2s: SPS_R_MoveToInvConfirmedBundleModel[] = [];
            if(req.iNeedBundles) {
                const bundles = await this.invConfBunRepo.find({select: ['abBarcode', 'aQty', 'pQty', 'pslId'], where: {companyCode, unitCode, confirmationId: r.confirmationId}});
                const poBundleRec = await this.poSubLineBundle.findOne({select: ['fgSku'], where: {companyCode, unitCode, processingSerial: r.processingSerial, procType: r.processType }});
                fgSku = poBundleRec.fgSku;
                for(const b of bundles) {
                    m2s.push(new SPS_R_MoveToInvConfirmedBundleModel(b.pslId, b.abBarcode, b.pQty, b.aQty));
                }
            }
            const m1 = new SPS_R_MoveToInvConfirmationModel(r.processingSerial, r.processType, r.color, r.productName, r.id, r.confirmationId.toString(), r.createdAt.toString(), r.createdUser, r.totalBundlesConfirmed, r.totalMovedQuantity, !r.isActive, fgSku, r.invStatus, m2s);
            m1s.push(m1);
        }
        return new SPS_R_MoveToInvConfirmationsResponse(true, 0, 'Inventory confirmations retrieved successfully', m1s);
    }

    
    async getAllBundlesForPoProdColorProcType(req: SPS_C_ProdColorEligibleBundlesForMoveToInvRequest): Promise<SPS_R_MoveToInvAllBundlesResponse> {
        const { companyCode, unitCode, procSerial, processType, fgColor, prodName } = req;
        if(!procSerial || !processType || !prodName || !fgColor) {
            throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
        }
        const pslRecs = await this.helperService.getPslIdsForProdColorProcSerial(companyCode, unitCode, procSerial, prodName, fgColor);
        if(pslRecs.length == 0) {
            throw new ErrorResponse(0, `Sorry no records found matching with prod : ${prodName} , proc serial : ${procSerial} and color : ${fgColor}`);
        }
        const pslIds = pslRecs.map(r => r.moProductSubLineId);
        const totalBundles = await this.jobBunRepo.getUniqueBundlesForPslIds(pslIds, processType, companyCode, unitCode, true, true);
        if(totalBundles.length == 0) {
            throw new ErrorResponse(0, `No pending bundles found to be moved to inventory`);
        }
        const m1s: SPS_R_MoveToInvAllBundlesModel[] = [];
        totalBundles.forEach(r => {
            const m1 = new SPS_R_MoveToInvAllBundlesModel(r.bundle_number, r.qty, r.psl_id, r.moved_to_inv);
            m1s.push(m1);
        });
        return new SPS_R_MoveToInvAllBundlesResponse(true, 0, 'All bundles for the proc order + prod name + color retrieved', m1s);
    }


    async getInventoryMovementSummaryForPoProdColorProcType(req: SPS_C_ProdColorBundlesSummaryRequest): Promise<SPS_R_MoveToInvProcSerialSummaryResponse> {
        const { companyCode, unitCode, procSerial, processType, fgColor, prodName } = req;
        if(!procSerial || !processType || !prodName || !fgColor) {
            throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
        }
        // first get all the psl ids for the input combination
        const pslRecs = await this.helperService.getPslIdsForProdColorProcSerial(companyCode, unitCode, procSerial, prodName, fgColor);
        if(pslRecs.length == 0) {
            throw new ErrorResponse(0, `Sorry no records found matching with prod : ${prodName} , proc serial : ${procSerial} and color : ${fgColor}`);
        }
        const pslIds = pslRecs.map(r => r.moProductSubLineId);
        const pslPropsRecs = await this.helperService.getPslPropsForPslIds(companyCode, unitCode, pslIds);
        const pslPropsMap = new Map<number, ProductSubLineFeaturesEntity>();
        pslPropsRecs.forEach(r => pslPropsMap.set(r.moProductSubLineId, r));

        const om1s: SPS_R_MoveToInvProcSerialOrderQtysModel[] = [];
        if(req.iNeedOrderQtys) {
            const orderQtysRecs = await this.poSubLineRepo.find({select: ['moProductSubLineId', 'quantity'], where: {processingSerial: procSerial, companyCode: companyCode, unitCode: unitCode, moProductSubLineId: In(pslIds)}});
            const orderQtysMap = new Map<string, SPS_R_MoveToInvProcSerialOrderQtysModel>(); // size => SPS_R_MoveToInvProcSerialJobQtysModel
            orderQtysRecs.forEach(r => {
                const pslProps = pslPropsMap.get(Number(r.moProductSubLineId));
                if(!orderQtysMap.has(pslProps.size)) {
                    orderQtysMap.set(pslProps.size, new SPS_R_MoveToInvProcSerialOrderQtysModel(pslProps.fgColor, pslProps.size, 0));
                }
                orderQtysMap.get(pslProps.size).oQty += Number(r.quantity);
            });
            // do not use map ATM
            orderQtysMap.forEach(r => {
                om1s.push(r);
            });
        }
        const jm1s: SPS_R_MoveToInvProcSerialJobQtysModel[] = [];
        if(req.iNeedJobQtys) {
            const jobPslRecs = await this.jobPslRepo.find({select: ['moProductSubLineId', 'cancelledQuantity', 'quantity', 'reJobGenQty'], where: {companyCode, unitCode, processType: processType, processingSerial: procSerial, moProductSubLineId: In(pslIds)} });
            const jobPslQtysMap = new Map<string, SPS_R_MoveToInvProcSerialJobQtysModel>(); // size => SPS_R_MoveToInvProcSerialJobQtysModel
            jobPslRecs.forEach(r => {
                const pslProps = pslPropsMap.get(Number(r.moProductSubLineId));
                if(!jobPslQtysMap.has(pslProps.size)) {
                    jobPslQtysMap.set(pslProps.size, new SPS_R_MoveToInvProcSerialJobQtysModel(pslProps.fgColor, pslProps.size, 0, 0, 0));
                }
                jobPslQtysMap.get(pslProps.size).reGenQty += Number(r.reJobGenQty);
                jobPslQtysMap.get(pslProps.size).jobQty += Number(r.quantity);
                jobPslQtysMap.get(pslProps.size).cancelledQty += Number(r.cancelledQuantity);
            });
            // do not use map ATM
            jobPslQtysMap.forEach(r => {
                jm1s.push(r);
            });
        }
        const im1s: SPS_R_MoveToInvProcSerialInvMoveQtyModel[] = [];
        if(req.iNeedInvMovedQty) {
            const invQtysMap = new Map<string, SPS_R_MoveToInvProcSerialInvMoveQtyModel>(); // size => SPS_R_MoveToInvProcSerialInvMoveQtyModel
            const totalPslQtys = await this.jobBunRepo.getTotalBundleQtyForPslIdsAndProcType(pslIds, processType, companyCode, unitCode, true, false);
            totalPslQtys.forEach(r => {
                const pslProps = pslPropsMap.get(Number(r.psl_id));
                if(!invQtysMap.has(pslProps.size)){
                    invQtysMap.set(pslProps.size, new SPS_R_MoveToInvProcSerialInvMoveQtyModel(pslProps.fgColor, pslProps.size, 0));
                }
                invQtysMap.get(pslProps.size).movedToInvQty += Number(r.total_qty);
            });
            // do not use map ATM
            invQtysMap.forEach(r => {
                im1s.push(r);
            });
        }
        const is1s: SPS_R_MoveToInvProcSerialBundleSummaryModel[] = [];
        if(req.iNeedBundlesSummary) {
            const invBunQtysSummaryMap = new Map<string, SPS_R_MoveToInvProcSerialBundleSummaryModel>(); // size => SPS_R_MoveToInvProcSerialInvMoveQtyModel
            const totalInvMovedPslQtys = await this.jobBunRepo.getTotalBundleQtyForPslIdsAndProcType(pslIds, processType, companyCode, unitCode, true, false);
            totalInvMovedPslQtys.forEach(r => {
                const pslProps = pslPropsMap.get(Number(r.psl_id));
                if(!invBunQtysSummaryMap.has(pslProps.size)){
                    invBunQtysSummaryMap.set(pslProps.size, new SPS_R_MoveToInvProcSerialBundleSummaryModel(pslProps.fgColor, pslProps.size, 0, 0, 0, 0));
                }
                invBunQtysSummaryMap.get(pslProps.size).totalInvMovedBundles += Number(r.total_bundles);
                invBunQtysSummaryMap.get(pslProps.size).totalInvMovedBundlesQty += Number(r.total_qty);
            });
            const totalInvNotMovedPslQtys = await this.jobBunRepo.getTotalBundleQtyForPslIdsAndProcType(pslIds, processType, companyCode, unitCode, false, true);
            totalInvNotMovedPslQtys.forEach(r => {
                const pslProps = pslPropsMap.get(Number(r.psl_id));
                if(!invBunQtysSummaryMap.has(pslProps.size)){
                    invBunQtysSummaryMap.set(pslProps.size, new SPS_R_MoveToInvProcSerialBundleSummaryModel(pslProps.fgColor, pslProps.size, 0, 0, 0, 0));
                }
                invBunQtysSummaryMap.get(pslProps.size).totalBundles += Number(r.total_bundles);
                invBunQtysSummaryMap.get(pslProps.size).totalBundlesQty += Number(r.total_qty);
            });
            // do not use map ATM
            invBunQtysSummaryMap.forEach(r => {
                is1s.push(r);
            });
        }

        const m1 = new SPS_R_MoveToInvProcSerialSummaryModel(procSerial, processType, prodName, fgColor, om1s, jm1s, is1s, im1s);
        return new SPS_R_MoveToInvProcSerialSummaryResponse(true, 0, 'SPS inventory summary retrieved', m1);
    }

}
