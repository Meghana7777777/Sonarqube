import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, MC_ProductSubLineProcessTypeRequest, ProcessingOrderInfoRequest } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgEntity } from "../entity/fg.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { MoBundleEntity } from "../entity/mo-bundle.entity";
import { DataSource, In } from "typeorm";
import { FgBundleEntity } from "../entity/fg-bundle.entity";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ProcOrderOslRepository } from "../entity/repository/proc-order-osl.repository";
import { ProcOrderRepository } from "../entity/repository/proc-order.repository";
import { ProcOrderOslEntity } from "../entity/proc-order-osl.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobCreationService {

    constructor(
        private dataSource: DataSource,
        private fgRepo: FgRepository,
        private fgOpDepRepo: FgOpDepRepository,
        private fgHelperService: FgCreationHelperService,
        private oslRepo: OslInfoRepository,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private moBundleRepo: MoBundleRepository,
        private fgBundleRepo: FgBundleRepository,
        private procOrderRepo: ProcOrderRepository,
        private procOrderOslRepo: ProcOrderOslRepository
    ) {
        
    }

    // ENDPOINT
    // triggered from the MO
    // Called after jobs creation in the SPS for a processing type
    async triggerMapJobsForProcSerial(req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const procOsls = await this.procOrderOslRepo.find({select: ['oslId', 'procSerial', 'procType'], where: { companyCode: companyCode, unitCode: unitCode, procSerial: req.processingSerial, procType: req.processType, jobMapped: false}});
        if(procOsls.length == 0) {
            throw new ErrorResponse(0, `Jobs are already mapped for all the OSL ids for the Proc Order : ${req.processingSerial} and type : ${req.processType} `);
        }
        for(const oslRec of procOsls) {
            const reqObj = new MC_ProductSubLineProcessTypeRequest(username, unitCode, companyCode, 0, [oslRec.oslId], req.processType, req.processingSerial);
            this.mapJobNumbersForProcSerialAndOslId(reqObj);
        }
        return new GlobalResponseObject(true, 0, `Proc serial mapping for the Proc Order : ${req.processingSerial} and type : ${req.processType} triggered`);
    }

    // ENDPOINT
    // triggered from the triggerMapJobsForProcSerial
    // We will get the bundles for the proc serial and the osl id. In the bundles we will have the job numbers as well
    async mapJobNumbersForProcSerialAndOslId(req: MC_ProductSubLineProcessTypeRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, processingSerial, processType } = req;
            console.log(req);
            const oslId = req.moProductSubLineIds[0];
            // get the osl rec for the proc serial
            const procOslRec = await this.procOrderOslRepo.findOne({select: ['oslId', 'jobMapped'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, procSerial: req.processingSerial, procType: req.processType } });
            if(!procOslRec) {
                throw new ErrorResponse(0, `Proc OSL record not found for the proc osl id : ${oslId} and Proc Serial: ${req.processingSerial} and Type: ${req.processType}`);
            }
            if(procOslRec.jobMapped) {
                throw new ErrorResponse(0, `Jobs for the osl id : ${oslId} and Proc Serial: ${req.processingSerial} and Type: ${req.processType} are already mapped for the bundles`);
            }
            const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo', 'quantity'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId } });
            if(!oslRec) {
                throw new ErrorResponse(0, `OSL record not found for the osl id : ${oslId}`);
            }
            const opSeqRefId = await this.fgHelperService.getOpSeqRefIdForMoProdColor(companyCode, unitCode, oslRec.moNo, oslRec.productCode, oslRec.color);
            // const procTypeSubProcsMap = await this.fgHelperService.getProcTypeSubProcsInfoForOpSeqRefId(companyCode, unitCode, opSeqRefId);
            // const subProcs = procTypeSubProcsMap.get(processType);
            // if(!subProcs?.size) {
            //     throw new ErrorResponse(0, `Unable to find the op groups for the opSeqRefId : ${opSeqRefId} and proc type : ${processType}`);
            // }
            // get the jobs info from the SPS and create the bundles here
            const procBundlesInfo = await this.fgHelperService.getJobsForProcSerialAndOslIds(processingSerial, processType, [oslId], companyCode, unitCode);
            await transManager.startTransaction();
            for(const b of procBundlesInfo) {
                const  job = b.jobNumber;
                // await transManager.getRepository(MoBundleEntity).update({companyCode: companyCode, unitCode: unitCode, procSerial: processingSerial, procType: processType, oslId: oslId, bundleBarcode: b.barcode, subProc: b.subProc}, { jobNumber: job });
            }
            await transManager.getRepository(ProcOrderOslEntity).update({companyCode: companyCode, unitCode: unitCode, procSerial: processingSerial, procType: processType, oslId: oslId}, { jobMapped: true});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Jobs mapped for the osl id : ${oslId} and Proc Serial: ${req.processingSerial} and Type: ${req.processType}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // ENDPOINT
    // deletes the job mapping for the proc serial and the proc type
    async deleteJobNumbersForProcSerial(req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, processingSerial, processType } = req;
            await transManager.startTransaction();
            // await transManager.getRepository(MoBundleEntity).update({companyCode: companyCode, unitCode: unitCode, procSerial: processingSerial, procType: processType}, { jobNumber: '' });
            await transManager.getRepository(ProcOrderOslEntity).update({companyCode: companyCode, unitCode: unitCode, procSerial: processingSerial, procType: processType }, { jobMapped: false});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Jobs deleted for the Proc Serial: ${req.processingSerial} and Type: ${req.processType}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


}
