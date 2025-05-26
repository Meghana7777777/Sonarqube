import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessingOrderInfoRequest, MC_ProductSubLineProcessTypeRequest } from "@xpparel/shared-models";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { MoBundleEntity } from "../entity/mo-bundle.entity";
import { DataSource, In } from "typeorm";
import { FgBundleEntity } from "../entity/fg-bundle.entity";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { ProcOrderEntity } from "../entity/proc-order.entity";
import { ProcOrderOslEntity } from "../entity/proc-order-osl.entity";
import { ProcOrderRepository } from "../entity/repository/proc-order.repository";
import { ProcOrderOslRepository } from "../entity/repository/proc-order-osl.repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { Injectable } from "@nestjs/common";


@Injectable()
export class ProcOrderCreationService {

    constructor(
        private dataSource: DataSource,
        private fgRepo: FgRepository,
        private fgOpDepRepo: FgOpDepRepository,
        private fgHelperService: FgCreationHelperService,
        private oslRepo: OslInfoRepository,
        private moBundleRepo: MoBundleRepository,
        private fgBundleRepo: FgBundleRepository,
        private procOrderRepo: ProcOrderRepository,
        private procOrderOslRepo: ProcOrderOslRepository
    ) {
        
    }

    // TESTED
    // ENDPOINT
    // creates the processing order and its lines in the PTS. Called from SPS or KNIT after the proc order creation. If a routing group has many processing types, then we have to call those many times
    async createProcOrderRef(req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, processingSerial, processType } = req;
            if(!processingSerial || !processType) {
                throw new ErrorResponse(0, `Processing serial and type are mandatory`);
            }
            const procInfo = await this.fgHelperService.getProcOrderInfoForProcSerial(processingSerial, processType, companyCode, unitCode);
            // check if the proc serial is already created
            const rec = await this.procOrderRepo.findOne({select:['id'], where: {companyCode, unitCode, procSerial: processingSerial, procType: processType }});
            if(rec) {
                throw new ErrorResponse(0, `Proc serial : ${processingSerial} is already created for type : ${processType}`);
            }
            const moNumber = procInfo.prcOrdMoInfo[0].moNumber;
            // first check if the fgs, fg op deps, mo bundles are created for all the osl ids under this specific proc serial
            const pslIdsPopStatusRecs = await this.oslRepo.find({select: ['oslId', 'fgCreated', 'fgDepCreated', 'bunCreated', 'bunFgCreated'], where: {companyCode, unitCode, moNo: moNumber}});
            // NOTE: Need to iterate all and throw exact psl id back
            pslIdsPopStatusRecs.forEach(r => {
                if(!(r.bunCreated && r.bunFgCreated && r.fgCreated && r.fgDepCreated)) {
                    throw new ErrorResponse(0, `PSL Id: ${r.oslId}. status { bundles: ${r.bunCreated}, bundle fg: ${r.bunFgCreated}, fg: ${r.fgCreated}, fg op dep : ${r.fgDepCreated} }`);
                }
            });
            
            const proEnt = new ProcOrderEntity();
            proEnt.companyCode = companyCode;
            proEnt.unitCode = unitCode;
            proEnt.createdUser = username;
            proEnt.procSerial = processingSerial;
            proEnt.procType = processType;
            await transManager.startTransaction();
            
            const procPslEnts: ProcOrderOslEntity[] = [];
            procInfo.prcOrdMoInfo.forEach(async m => {
                m.prcOrdLineInfo.forEach(async l => {
                    l.productInfo.forEach(async p => {
                        p.prcOrdSubLineInfo.forEach(async sl => {
                            const procOslEnt = new ProcOrderOslEntity();
                            procOslEnt.companyCode = companyCode;
                            procOslEnt.unitCode = unitCode;
                            procOslEnt.createdUser = username;
                            procOslEnt.jobMapped = false;
                            procOslEnt.fgDepUpdated = false;
                            procOslEnt.fgOpUpdated = false;
                            procOslEnt.moBundleUpdated = false;
                            procOslEnt.procSerial = processingSerial;
                            procOslEnt.quantity = sl.quantity;
                            procOslEnt.procType = processType;
                            procOslEnt.oslId = sl.productSubLineId;
                            procPslEnts.push(procOslEnt);
                        });
                    })
                })
            });
            await transManager.getRepository(ProcOrderEntity).save(proEnt, {reload: false});
            await transManager.getRepository(ProcOrderOslEntity).save(procPslEnts, {reload: false});
            await transManager.completeTransaction();
            // now call the map proc serial for the fg_op_dep and mo_bundle
            await this.triggerMapProcSerialForOslBundles(req);
            return new GlobalResponseObject(true, 0, `Processing order info created into PTS. Proc Order : ${req.processingSerial} and type : ${req.processType} `);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // ENDPOINT
    async deleteProcOrderRef(req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, processingSerial, processType } = req;
            const rec = await this.procOrderRepo.findOne({select:['id'], where: {companyCode, unitCode, procSerial: processingSerial, procType: processType }});
            if(!rec) {
                throw new ErrorResponse(0, `Proc serial : ${processingSerial} is not found for type : ${processType}`);
            }
            const procOsls = await this.procOrderOslRepo.find({select: ['oslId', 'procSerial', 'procType'], where: { companyCode: companyCode, unitCode: unitCode, procSerial: req.processingSerial, procType: req.processType }});
            if(procOsls.length == 0) {
                throw new ErrorResponse(0, `No PSLs found Proc Order : ${req.processingSerial} and type : ${req.processType} `);
            }
            const pslIds = procOsls.map(r => r.oslId);
            await transManager.startTransaction();
            await transManager.getRepository(ProcOrderEntity).delete({companyCode, unitCode, procSerial: processingSerial});
            await transManager.getRepository(ProcOrderOslEntity).delete({companyCode, unitCode, procSerial: processingSerial});
            await transManager.getRepository(MoBundleEntity).update({unitCode: unitCode, companyCode: companyCode, oslId: In(pslIds), procType: req.processType, procSerial: processingSerial }, { procSerial: 0 });
            await transManager.getRepository(FgOpDepEntity).update({oslId: In(pslIds), procType: req.processType, procSerial: processingSerial}, { procSerial: 0 });
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Processing order info deleted from PTS. Proc Order : ${req.processingSerial} and type : ${req.processType} `);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // ENDPOINT
    // triggers the mapping of proc serial to the mo bundles and fg_op_dep
    // Have to be called after the jobs generation in SPS
    async triggerMapProcSerialForOslBundles(req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const procOsls = await this.procOrderOslRepo.find({select: ['oslId', 'procSerial', 'procType'], where: { companyCode: companyCode, unitCode: unitCode, procSerial: req.processingSerial, procType: req.processType, moBundleUpdated: false}});
        if(procOsls.length == 0) {
            throw new ErrorResponse(0, `OSLs already mapped for all the OSL ids for the Proc Order : ${req.processingSerial} and type : ${req.processType} `);
        }
        for(const oslRec of procOsls) {
            const reqObj = new MC_ProductSubLineProcessTypeRequest(username, unitCode, companyCode, 0, [oslRec.oslId], req.processType, req.processingSerial);
            await this.mapProcSerialForOslBundlesAndFgOpDep(reqObj);
        }
        return new GlobalResponseObject(true, 0, `Proc serial mapping for the Proc Order : ${req.processingSerial} and type : ${req.processType} triggered`);
    }

    // ENDPOINT
    // TODO: When the same proc serial has multiple processing types, then we have to 
    // called from triggerMapProcSerialForOslBundles. Maps the proc serial for the MO bundles against the proc order
    async mapProcSerialForOslBundlesAndFgOpDep(req: MC_ProductSubLineProcessTypeRequest): Promise<GlobalResponseObject> {
        const  transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            const oslId =  req.moProductSubLineIds[0];
            const procSerial = req.processingSerial;
            // check if the osl already mapped for the mo bundles and proc serial and proc type
            const procOrderBundle = await this.moBundleRepo.findOne({select:['bundleBarcode'], where: {companyCode: companyCode, unitCode: unitCode, oslId: oslId, procSerial: procSerial, procType: req.processType } });
            if(procOrderBundle) {
                return new GlobalResponseObject(true, 0 , `Proc serial ${req.processingSerial} and type : ${req.processType} is already mapped for the bundles and OSL id : ${oslId}`);
            }
            // now get the bundles for the osl and proc serial and map them to the mo bundles
            const bundlesForProc = await this.fgHelperService.getBundlesForProcSerialAndOslIds(procSerial, req.processType, [oslId], companyCode, unitCode);
            console.log(bundlesForProc);
            await transManager.startTransaction();
            for(const b of bundlesForProc) {
                // update the proc serial for the bundles and osl id combination for the proc type
                await transManager.getRepository(MoBundleEntity).update({unitCode: unitCode, companyCode: companyCode, oslId: oslId, procType: req.processType, bundleBarcode: b.barcode}, { procSerial: procSerial });
                // update the proc serial for the fg op dep based on the fg numbers and the bundles
                const bundleFgs = await this.fgBundleRepo.find({select: ['fgNumber'], where: { bundleBarcode: b.barcode, oslId: oslId, procType: req.processType }});
                const fgs = bundleFgs.map(r => r.fgNumber);
                await transManager.getRepository(FgBundleEntity).update({ oslId: oslId, procType: req.processType, fgNumber: In(fgs)}, { procSerial: procSerial });
                await transManager.getRepository(FgOpDepEntity).update({ oslId: oslId, procType: req.processType, fgNumber: In(fgs)}, { procSerial: procSerial });
            }
            await transManager.getRepository(ProcOrderOslEntity).update({ companyCode: companyCode, unitCode: unitCode, procSerial: req.processingSerial, procType: req.processType, oslId: oslId }, { moBundleUpdated: true, fgDepUpdated: true, fgOpUpdated: true });
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Proc serial ${req.processingSerial} and type : ${req.processType} mapped for the bundles and OSL id : ${oslId}`);
        } catch (error) {
            throw error;
        }
    }

}
