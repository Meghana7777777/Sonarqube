import { GlobalResponseObject, OslRefIdRequest, SI_MoNumberRequest, ProcessTypeEnum } from "@xpparel/shared-models";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { MoBundleEntity } from "../entity/mo-bundle.entity";
import { DataSource, In } from "typeorm";
import { FgBundleEntity } from "../entity/fg-bundle.entity";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { Injectable } from "@nestjs/common";
import { MoActualBundleRepository } from "../entity/repository/mo-actual-bundle.repository";
import { MoActualBundleParentRepository } from "../entity/repository/mo-actual-bundle-parent.repository";

@Injectable()
export class BundleCreationService {

    constructor(
        private dataSource: DataSource,
        private fgHelperService: FgCreationHelperService,
        private oslRepo: OslInfoRepository,
        private moBundleRepo: MoBundleRepository,
        private fgBundleRepo: FgBundleRepository,
    ) {
        
    }

    // TESTED
    // Called after MO confirmation in OMS
    // ENDPOINT
    // triggered from the MO
    async triggerCreateBundlesForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const oslRecForMo = await this.oslRepo.find({select: ['oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber, bunCreated: false}});
        if(oslRecForMo.length == 0) {
            throw new ErrorResponse(0, `OSLs already created for the MO number : ${req.moNumber}`);
        }
        for(const rec of oslRecForMo) {
            const oslReq = new OslRefIdRequest(username, unitCode, companyCode, 0, [rec.oslId]);
            await this.createBundlesForOslIdAndMapFgsForBundle(oslReq); 
        }
        return new GlobalResponseObject(true, 0, `Bundles creation for MO : ${req.moNumber} triggered successfully`);
    }

    // TESTED
    // ENDPOINT
    // triggered from the triggerCreateBundlesForMo
    async createBundlesForOslIdAndMapFgsForBundle(req: OslRefIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const oslId = req.oslRefId[0];
            const bundlesForOsl = await this.moBundleRepo.findOne({select: ['bundleBarcode'], where: { companyCode: companyCode, unitCode:  unitCode, oslId: oslId}});
            if(bundlesForOsl) {
                throw new ErrorResponse(0, `Bundles already created for the OSL : ${oslId}`);
            }
            // get the fg number range for the osl
            const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo', 'quantity'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, bunCreated: false } });
            if(!oslRec) {
                throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.oslRefId}`);
            }
            // get the bundles info from the OMS and create the bundles here
            const procBundlesInfo = await this.fgHelperService.getBundlesForOslId(oslId, companyCode, unitCode);
            const opSeqRefId = await this.fgHelperService.getOpSeqRefIdForMoProdColor(companyCode, unitCode, oslRec.moNo, oslRec.productCode, oslRec.color);
            // now get the op groups for the op seq ref id
            const procTypeSubProcsMap = await this.fgHelperService.getProcTypeSubProcsInfoForOpSeqRefId(companyCode, unitCode, opSeqRefId);
            await transManager.startTransaction();
            const bundleEnts: MoBundleEntity[] = [];
            let totalBunQty = 0;
            for(const r of procBundlesInfo) {
                if([ProcessTypeEnum.KNIT, ProcessTypeEnum.PACK, ProcessTypeEnum.CUT].includes(r.procType)) {
                    continue;
                }
                let fgStartNo = oslRec.fgStartNo;
                const fgEndNo = oslRec.fgEndNo;

                r.bundles = r.bundles.sort((a, b) => a.bundleBarcode > b.bundleBarcode ? 1 : 0);
                for(const b of r.bundles) {
                    const opGroupsForProc = procTypeSubProcsMap.get(b.procType);
                    // for each proc type, get the op groups. we have to create bundle per op group.
                    // Disabled mo bundle creation per sub process after actual bundle implementation
                    // opGroupsForProc.forEach(() => {
                        const bunEnt = new MoBundleEntity();
                        bunEnt.bundleBarcode = b.bundleBarcode;
                        bunEnt.quantity = b.bundleQty;
                        bunEnt.oslId = b.pslId;
                        bunEnt.procSerial = 0;
                        bunEnt.procType = b.procType;
                        bunEnt.unitCode = unitCode;
                        bunEnt.companyCode = companyCode;
                        bunEnt.createdUser = username;
                        bundleEnts.push(bunEnt);
                    // });

                    const fgBunEnts: FgBundleEntity[] = [];
                    let bunQty = b.bundleQty;
                    // create the fg bundle map here
                    while(bunQty > 0) {
                        const fgBunEnt = new FgBundleEntity();
                        fgBunEnt.bundleBarcode = b.bundleBarcode;
                        fgBunEnt.fgNumber = fgStartNo;
                        fgBunEnt.procType = r.procType;
                        fgBunEnt.oslId = b.pslId;
                        fgBunEnt.procSerial = 0;
                        fgBunEnts.push(fgBunEnt);
                        bunQty--;
                        fgStartNo++;
                        totalBunQty++;
                    }
                    await transManager.getRepository(FgBundleEntity).save(fgBunEnts, {reload: false});
                }
                if(fgStartNo-1 != fgEndNo) {
                    throw new ErrorResponse(0, `OSL id: ${oslId} Qty is : ${oslRec.quantity}. But received bundles for only for ${totalBunQty}`);
                }
            }
            await transManager.getRepository(MoBundleEntity).save(bundleEnts, {reload: false});
            await transManager.getRepository(OslInfoEntity).update({companyCode: companyCode, unitCode: unitCode, oslId: oslId, bunCreated: false}, { bunCreated: true, bunFgCreated: true });
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Bundles created for the osl successfully`);   
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // ENDPOINT
    // Deletes the bundles for the OSL id
    async deleteBundlesForOslId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode } = req;
        const oslId = req.oslRefId[0];
        const bundlesForOsl = await this.moBundleRepo.findOne({select: ['bundleBarcode'], where: { companyCode: companyCode, unitCode:  unitCode, oslId: oslId}});
        if(!bundlesForOsl) {
            throw new ErrorResponse(0, `No Bundles are created for the OSL : ${oslId}`);
        }
        await this.moBundleRepo.delete({ companyCode: companyCode, unitCode: unitCode, oslId: oslId});
        await this.fgBundleRepo.delete({ oslId: oslId });
        await this.oslRepo.update({companyCode: companyCode, unitCode: unitCode, oslId: oslId }, { bunCreated: false, bunFgCreated: false });
        return new GlobalResponseObject(true, 0, `Bundles created for the osl successfully`);
    }

    // TESTED
    // ENDPOINT
    // Deletes the bundles for the MO number
    async deleteBundlesForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode } = req;
        const oslRecsForMo = await this.oslRepo.find({select: ['oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber}});
        if(oslRecsForMo.length == 0) {
            throw new ErrorResponse(0, `OSL refs not found the MO number : ${req.moNumber}`);
        }
        const oslIds = oslRecsForMo.map(r => r.oslId);

        const bundlesForOsl = await this.moBundleRepo.findOne({select: ['bundleBarcode'], where: { companyCode: companyCode, unitCode:  unitCode, oslId: In(oslIds)}});
        if(!bundlesForOsl) {
            throw new ErrorResponse(0, `No Bundles are created for the MO number : ${req.moNumber}`);
        }
        await this.moBundleRepo.delete({ companyCode: companyCode, unitCode: unitCode, oslId: In(oslIds)});
        await this.fgBundleRepo.delete({ oslId: In(oslIds) });
        await this.oslRepo.update({companyCode: companyCode, unitCode: unitCode, oslId: In(oslIds) }, { bunCreated: false, bunFgCreated: false });
            
        return new GlobalResponseObject(true, 0, `Bundles deleted for the osl successfully`);
    }
}
